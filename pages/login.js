import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res.error) setError(res.error);
    else window.location.href = "/";
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        method="post"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-96"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          登录 LiveBackdrop
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-3">
          <span className="text-gray-700 text-sm">邮箱</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded p-2"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 text-sm">密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded p-2"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          登录
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
}
