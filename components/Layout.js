// /components/Layout.js
import * as NavBarMod from "@/components/NavBar";
import * as NavMod from "@/components/Nav";
import * as FooterMod from "@/components/Footer";

// 兼容不同导出方式与命名：default / 命名导出
const Pick = (mod, names) => {
  for (const n of names) {
    if (mod && mod[n]) return mod[n];
  }
  return null;
};

// 选择可用的头部与脚部组件（不改你任何原始文件）
const HeaderComp =
  Pick(NavBarMod, ["default", "NavBar"]) ||
  Pick(NavMod, ["default", "Nav"]) ||
  null;

const FooterComp = Pick(FooterMod, ["default", "Footer"]) || (() => null);

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {HeaderComp ? <HeaderComp /> : null}
      <main className="flex-grow">{children}</main>
      <FooterComp />
    </div>
  );
}
