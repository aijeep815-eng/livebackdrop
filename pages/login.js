import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError(''); // 这里先不管真正登录，只验证按钮是否工作
    alert('邮箱登录表单已提交（测试用）');
  };

  const handleGoogle = () => {
    alert('Google 按钮已触发（说明前端点击事件是正常的）');
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login (前端测试版)</h1>

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

        {error && (
          <p className="text-red-600 text-sm whitespace-pre-line">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          测试邮箱登录按钮
        </button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button
        onClick={handleGoogle}
        className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100"
      >
        <span className="text-gray-700 font-medium">
          测试 Google 登录按钮（应当弹出提示框）
        </span>
      </button>

      <p className="text-sm text-center mt-3">
        No account?{' '}
        <Link href="/register" className="text-blue-700 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
