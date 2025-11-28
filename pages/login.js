import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    });

    setLoading(false);

    if (!res) {
      setError('登录失败，请稍后重试。');
      return;
    }

    if (res.error) {
      setError('邮箱或密码错误。');
      return;
    }

    // 登录成功
    router.push(res.url || '/');
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded ${
            loading ? 'bg-gray-400 cursor-wait' : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          {loading ? 'Logging in…' : '邮箱登录'}
        </button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <a
        href="/api/auth/signin/google?callbackUrl=/"
        className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100"
      >
        <span className="text-gray-700 font-medium">使用 Google 登录</span>
      </a>

      <p className="text-sm text-center mt-3">
        No account?{' '}
        <Link href="/register" className="text-blue-700 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
