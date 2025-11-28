// pages/dashboard.js
import { getSession, useSession } from 'next-auth/react';
import { dbConnect } from '../lib/mongodb';
import User from '../models/User';
import Usage from '../models/Usage';
import { useState, useEffect } from 'react';

export default function Dashboard({ user, logs }) {
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

  // 分页：每页条数
  const pageSize = 10;
  const [page, setPage] = useState(0);

  // 页面加载时记录一次「真实设备 / IP」访问
  useEffect(() => {
    const logActivity = async () => {
      try {
        await fetch('/api/user/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
      } catch (e) {
        // 忽略错误，不影响页面
      }
    };
    logActivity();
  }, []);

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

  const loginLogs = (logs || []).filter((l) => l.type === 'login');
  const activityLogs = (logs || []).filter((l) => l.type === 'activity');
  const lastLogin = loginLogs[0];
  const lastActivity = activityLogs[0];

  const formatDate = (s) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  const displayIp = (ip) => {
    if (!ip || ip === 'unknown') return '未知';
    return ip;
  };

  const displayUA = (ua) => {
    if (!ua || ua === 'unknown') return '未知设备';
    return ua;
  };

  // 计算分页
  const total = logs?.length || 0;
  const pageCount = total === 0 ? 1 : Math.ceil(total / pageSize);
  const currentPage = Math.min(Math.max(page, 0), pageCount - 1);
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const pageLogs = (logs || []).slice(start, end);

  const handlePrev = () => {
    setPage((p) => Math.max(p - 1, 0));
  };

  const handleNext = () => {
    setPage((p) => Math.min(p + 1, pageCount - 1));
  };

  return (
    <div className="max-w-3xl mx-auto mt-24 bg-white rounded-lg shadow p-6 space-y-8">
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
              {formatDate(user.createdAt)}
            </p>
          </div>
        )}
        {lastLogin && (
          <div>
            <p className="text-sm text-gray-500">最近登录时间（认证事件）</p>
            <p className="text-lg font-medium">
              {formatDate(lastLogin.createdAt)}
            </p>
          </div>
        )}
        {lastActivity && (
          <div>
            <p className="text-sm text-gray-500">最近活动设备 / IP（真实浏览器）</p>
            <p className="text-sm text-gray-700">
              IP：{displayIp(lastActivity.ip)}
            </p>
            <p className="text-sm text-gray-700">
              设备：{displayUA(lastActivity.userAgent)}
            </p>
          </div>
        )}
      </section>

      {/* 修改昵称 */}
      <section className="space-y-3 border-t pt-4">
        <h2 className="text-lg font-semibold">修改昵称</h2>
        <form onSubmit={handleNameSave} className="space-y-3 max-w-sm">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Display Name
            </label>
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
              nameLoading
                ? 'bg-gray-400 cursor-wait'
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {nameLoading ? 'Saving…' : '保存昵称'}
          </button>
        </form>
      </section>

      {/* 修改密码 */}
      <section className="space-y-3 border-t pt-4">
        <h2 className="text-lg font-semibold">修改密码</h2>
        {!hasPassword ? (
          <p className="text-sm text-gray-600">
            当前账号主要通过第三方登录，尚未设置本地密码。
            如需设置本地密码，可以先通过邮箱注册或在未来增加绑定功能。
          </p>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                当前密码
              </label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                新密码
              </label>
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
                pwLoading
                  ? 'bg-gray-400 cursor-wait'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {pwLoading ? 'Updating…' : '保存密码'}
            </button>
          </form>
        )}
      </section>

      {/* 最近活动 / 登录记录（分页） */}
      <section className="space-y-3 border-t pt-4">
        <h2 className="text-lg font-semibold">最近记录</h2>
        {(!logs || logs.length === 0) ? (
          <p className="text-sm text-gray-600">暂无记录。</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">时间</th>
                    <th className="text-left py-2 pr-4">类型</th>
                    <th className="text-left py-2 pr-4">IP</th>
                    <th className="text-left py-2 pr-4">方式</th>
                    <th className="text-left py-2">设备</th>
                  </tr>
                </thead>
                <tbody>
                  {pageLogs.map((log, idx) => (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="py-2 pr-4">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="py-2 pr-4">
                        {log.type === 'login'
                          ? '登录'
                          : log.type === 'activity'
                          ? '活动'
                          : log.type}
                      </td>
                      <td className="py-2 pr-4">
                        {displayIp(log.ip)}
                      </td>
                      <td className="py-2 pr-4">
                        {log.meta?.provider === 'google'
                          ? 'Google'
                          : log.meta?.provider === 'credentials'
                          ? '邮箱'
                          : '-'}
                      </td>
                      <td className="py-2 text-gray-500 max-w-xs truncate">
                        {displayUA(log.userAgent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页控制 */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <div>
                第 <span className="font-semibold">{currentPage + 1}</span> 页 / 共{' '}
                <span className="font-semibold">{pageCount}</span> 页（共 {total} 条）
              </div>
              <div className="space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 0
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-blue-700 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  上一页
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= pageCount - 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage >= pageCount - 1
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-blue-700 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  下一页
                </button>
              </div>
            </div>
          </>
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
  const dbLogs = await Usage.find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

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

  const safeLogs = dbLogs.map((l) => ({
    type: l.type,
    createdAt: l.createdAt ? l.createdAt.toISOString() : null,
    ip: l.ip || '',
    userAgent: l.userAgent || '',
    meta: l.meta || {},
  }));

  return {
    props: {
      user: safeUser,
      logs: safeLogs,
    },
  };
}
