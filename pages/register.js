import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOkMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      setLoading(false);

      if (!data.ok) {
        setError(data.message || '注册失败。');
        return;
      }

      setOkMsg('注册成功，请使用邮箱和密码登录。');
      // 1-2 秒后跳转到登录页
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError('网络错误，请稍后再试。');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

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
        <div>
          <label className="block text-sm font-medium mb-1">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {okMsg && <p className="text-green-600 text-sm">{okMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded ${
            loading ? 'bg-gray-400 cursor-wait' : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          {loading ? 'Registering…' : '邮箱注册'}
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
        <span className="text-gray-700 font-medium">使用 Google 帐号注册 / 登录</span>
      </a>

      <p className="text-sm text-center mt-3">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-700 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
