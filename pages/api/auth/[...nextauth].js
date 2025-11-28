// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import Usage from '../../../models/Usage';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name || user.email,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },

    async signIn({ user, account, req }) {
      await dbConnect();

      // Google 首次登录时，同步用户到数据库
      if (account?.provider === 'google') {
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
          });
        }
      }

      // 记录登录事件（不一定有真实 IP/设备）
      try {
        let ip = 'unknown';
        let ua = 'unknown';

        if (req && req.headers) {
          const xf = req.headers['x-forwarded-for'];
          const raw = Array.isArray(xf) ? xf[0] : (xf || '').toString();
          const candidate =
            (raw || '')
              .split(',')[0]
              .trim() || req.socket?.remoteAddress || '';

          ip = candidate || 'unknown';
          ua = req.headers['user-agent'] || 'unknown';
        }

        await Usage.create({
          userEmail: user.email,
          type: 'login',
          ip,
          userAgent: ua,
          meta: {
            provider: account?.provider || 'unknown',
          },
        });
      } catch (e) {
        console.error('login log failed', e.message);
      }

      return true;
    },
  },
};

export default NextAuth(authOptions);
