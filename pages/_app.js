import "@/styles/globals.css";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  // 登录页和注册页使用完整布局
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
