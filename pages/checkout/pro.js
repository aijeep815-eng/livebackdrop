// pages/checkout/pro.js
// 安全占位版本：只负责跳转到 /pricing，避免构建报错

export default function ProCheckoutRedirect() {
  if (typeof window !== 'undefined') {
    window.location.href = '/pricing';
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-700 text-sm">
        正在跳转到升级页面...
      </p>
    </div>
  );
}
