import { useEffect, useState } from "react";

export default function Success() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function updatePlan() {
      try {
        await fetch("/api/stripe/sync-plan", { method: "POST" });
      } catch (e) {}
      setDone(true);
    }
    updatePlan();
  }, []);

  return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <h1>🎉 升级成功！</h1>
      <p>你的账户已经拥有 Creator Unlimited 套餐权限。</p>
      <p>你现在可以无限生成虚拟背景，不再受每日限制。</p>

      {done ? (
        <a
          href="/generate"
          style={{
            marginTop: "20px",
            display: "inline-block",
            padding: "10px 25px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
          }}
        >
          开始生成背景
        </a>
      ) : (
        <p>正在激活套餐，请稍等…</p>
      )}
    </div>
  );
}
