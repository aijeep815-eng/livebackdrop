import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 头部 */}
      <Header />

      {/* 主体内容 */}
      <main className="flex-grow">{children}</main>

      {/* 脚部 */}
      <Footer />
    </div>
  );
}
