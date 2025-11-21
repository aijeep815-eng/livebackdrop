import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // 预热，减少第一次卡顿
    fetch('/api/ping').catch(() => {});
    fetch('/api/auth/session').catch(() => {});
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    alert('邮箱登录表单已提交（这里只是测试，不真正登录）');
  };

  const handleGoogle = async () => {
    setMsg('');
    setGoogleLoading(true);
    alert('Google 按钮点击成功，开始调用 signIn("google") ……');

    try {
      const res = await signIn('google', {
        callbackUrl: '/',
        redirect: false,
      });

      setGoogleLoading(false);

      if (!res) {
        setMsg('signIn 返回了空结果（res 为 null/undefined），说明前端调用到了，但后端没有正常响应。');
        return;
      }

      // 把返回的对象打印出来，方便我们看问题
      setMsg('signIn 返回: ' + JSON.stringify(res));

      if (res.error) {
        // 例如 Configuration / OAuthCallback 等
        alert('Google 登录失败，错误: ' + res.error);
        return;
      }

      if (res.url) {
        // 手动跳转
        window.location.href = res.url;
      }
    } catch (e) {
      setGoogleLoading(false);
      setMsg('调用 signIn("google") 时抛出异常: ' + (e?.message || String(e)));
      alert('调用 signIn("google") 时报错，详情见页面红字。');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login 调试版</h1>

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

        {msg && (
          <p className="text-red-600 text-xs whitespace-pre-wrap break-all">
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          测试邮箱表单（不会真正登录）
        </button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100"
      >
        <span className="text-gray-700 font-medium">
          {googleLoading ? 'Connecting…' : '使用 Google 登录（调试）'}
        </span>
      </button>

      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <p>如果点击按钮后既没有弹窗，也没有红字信息，说明 Vercel 部署的不是这个 login.js。</p>
        <p>下面这个是直接走 NextAuth 默认链接：</p>
        <a
          href="/api/auth/signin/google"
          className="text-blue-700 underline break-all"
        >
          /api/auth/signin/google
        </a>
      </div>

      <p className="text-sm text-center mt-3">
        No account?{' '}
        <Link href="/register" className="text-blue-700 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
