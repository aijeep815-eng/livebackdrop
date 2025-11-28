// pages/dashboard.js
import { getSession, useSession } from 'next-auth/react';
import { dbConnect } from '../lib/mongodb';
import User from '../models/User';
import { useState } from 'react';

export default function Dashboard({ user }) {
  const { data: session } = useSession();
  const displayUser = user || session?.user;

  const [name, setName] = useState(displayUser?.name || '');
  const [nameMsg, setNameMsg] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  if (!displayUser) {
    return (
      <div className="max-w-xl mx-auto mt-32 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const providerLabel =
    user?.provider === 'google'
      ? 'Google 账号'
      : user?.provider === 'credentials'
      ? '邮箱账号'
      : user?.provider === 'mixed'
      ? '邮箱 + Google'
      : '未知';

  const hasPassword = !!user?.hasPassword;

  const handleNameSave = async (e) => {
    e.preventDefault();
    setNameMsg('');
    setNameErr('');
    setNameLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setNameLoading(false);

      if (!data.ok) {
        setNameErr(data.message || '保存失败。');
      } else {
        setNameMsg('保存成功。');
      }
    } catch (err) {
      setNameLoading(false);
      setNameErr('网络错误，请稍后再试。');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    setPwLoading(true);

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      setPwLoading(false);

      if (!data.ok) {
        setPwErr(data.message || '修改失败。');
      } else {
        setPwMsg('密码已更新。');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPwLoading(false);
      setPwErr('网络错误，请稍后再试。');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 bg-white rounded-lg shadow p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Account Dashboard</h1>

      {/* 基本信息展示 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">基本信息</h2>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{displayUser.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">登录方式</p>
          <p className="text-lg font-medium">{providerLabel}</p>
        </div>
        {user?.createdAt && (
          <div>
            <p className="text-sm text-gray-500">注册时间</p>
            <p className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </section>

      {/* 修改昵称 */}
      <section className="space-y-3 border-t pt-4">
        <h2 className="text-lg font-semibold">修改昵称</h2>
        <form onSubmit={handleNameSave} className="space-y-3 max-w-sm">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Display Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：Alexander"
            />
          </div>
          {nameErr && <p className="text-sm text-red-600">{nameErr}</p>}
          {nameMsg && <p className="text-sm text-green-600">{nameMsg}</p>}
          <button
            type="submit"
            disabled={nameLoading}
            className={`px-4 py-2 rounded text-white ${
              nameLoading ? 'bg-gray-400 cursor-wait' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {nameLoading ? 'Saving…' : '保存昵称'}
          </button>
        </form>
      </section>

      {/* 修改密码（只对有本地密码的账号显示） */}
      <section className="space-y-3 border-t pt-4">
        <h2 className="text-lg font-semibold">修改密码</h2>
        {!hasPassword ? (
          <p className="text-sm text-gray-600">
            当前账号主要通过 Google 登录，尚未设置本地密码。
            如果后续需要，我们可以增加「为 Google 账号设置邮箱密码」的功能。
          </p>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
            <div>
              <label className="block text-sm text-gray-600 mb-1">当前密码</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">新密码</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {pwErr && <p className="text-sm text-red-600">{pwErr}</p>}
            {pwMsg && <p className="text-sm text-green-600">{pwMsg}</p>}
            <button
              type="submit"
              disabled={pwLoading}
              className={`px-4 py-2 rounded text-white ${
                pwLoading ? 'bg-gray-400 cursor-wait' : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {pwLoading ? 'Updating…' : '保存密码'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=/dashboard`,
        permanent: false,
      },
    };
  }

  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email }).lean();

  const safeUser = dbUser
    ? {
        name: dbUser.name || '',
        email: dbUser.email,
        provider: dbUser.provider || null,
        createdAt: dbUser.createdAt ? dbUser.createdAt.toISOString() : null,
        updatedAt: dbUser.updatedAt ? dbUser.updatedAt.toISOString() : null,
        hasPassword: !!dbUser.password,
      }
    : {
        name: session.user.name || '',
        email: session.user.email,
        provider: null,
        createdAt: null,
        updatedAt: null,
        hasPassword: false,
      };

  return {
    props: {
      user: safeUser,
    },
  };
}
