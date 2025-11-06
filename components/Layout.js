import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 顶部导航（包含 LOGO、菜单、多语言切换） */}
      <NavBar />

      {/* 主体内容 */}
      <main className="flex-grow">{children}</main>

      {/* 底部版权 */}
      <Footer />
    </div>
  );
}
