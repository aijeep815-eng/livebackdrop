import { getCsrfToken, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <form
        method="post"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          登录 LiveBackdrop
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
            ⚠️ {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-gray-700 text-sm font-medium">邮箱</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            placeholder="your@email.com"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 text-sm font-medium">密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            placeholder="请输入密码"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          {loading ? "正在登录..." : "登录"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          还没有账户？
          <Link href="/register" className="text-blue-600 hover:underline ml-1">
            点击注册
          </Link>
        </p>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
}
