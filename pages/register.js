import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "注册失败");

      setSuccess("注册成功！请返回登录页面登录。");
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-6">
          注册 LiveBackdrop
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 text-center">
            ✅ {success}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-gray-700 text-sm font-medium">昵称（可选）</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
            placeholder="你的昵称"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm font-medium">邮箱</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
            placeholder="your@email.com"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm font-medium">密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
            placeholder="请输入密码"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 text-sm font-medium">确认密码</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
            placeholder="请再次输入密码"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
        >
          {loading ? "正在注册..." : "注册"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          已有账户？
          <Link href="/login" className="text-green-600 hover:underline ml-1">
            点击登录
          </Link>
        </p>
      </form>
    </div>
  );
}
