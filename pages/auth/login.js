import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1>Welcome, {session.user?.email}</h1>
        <p>You are already logged in.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>Login</button>
      </form>
    </div>
  );
}
