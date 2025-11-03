import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); return; }
    // auto sign-in
    const s = await signIn("credentials", { redirect:false, email, password, callbackUrl:"/" });
    if (!s?.error) router.push("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label>Name (optional)</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button className="btn btn--primary" type="submit">Create</button>
        </form>
        <p className="muted">Already have an account? <a href="/auth/login">Login</a></p>
      </div>
      <style jsx>{`
        .auth-page{min-height:70vh;display:grid;place-items:center;padding:40px;background:var(--page-bg)}
        .auth-card{width:100%;max-width:420px;background:#fff;border-radius:16px;box-shadow:var(--shadow);padding:24px}
        h1{margin:0 0 14px}
        form{display:grid;gap:10px}
        label{font-weight:600}
        input{border:1px solid #d0e3ff;border-radius:10px;padding:10px 12px;outline:none}
        input:focus{border-color:#6fb5ff;box-shadow:0 0 0 3px rgba(63,156,255,.15)}
        .error{color:#d34040;margin:6px 0}
        .muted{opacity:.8;margin-top:12px}
      `}</style>
    </div>
  );
}
