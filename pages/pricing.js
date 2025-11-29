import Head from 'next/head';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <>
      <Head><title>Pricing – LiveBackdrop</title></Head>
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">选择最适合你的方案</h1>
          <p className="text-slate-600 text-lg mb-12">从轻量免费到专业无限制，总有一个适合你。</p>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="bg-white rounded-2xl shadow p-8 flex flex-col border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Free</h2>
              <p className="text-slate-500 mb-6">适合轻度使用的个人用户</p>
              <p className="text-4xl font-bold text-blue-600 mb-6">$0<span className="text-lg text-slate-500"> / 月</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li>✔ 每天 3 张 AI 背景</li><li>✔ 图像实验室每天 1 次</li>
                <li>✔ 1024×1024 分辨率</li><li>✔ 最近 3 张历史记录</li>
                <li>✘ 无高清</li><li>✘ 无无限制生成</li><li>✘ 有轻微水印</li>
              </ul>
              <a href="/auth/signin" className="w-full text-center py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition">免费使用</a>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl shadow p-8 flex flex-col border border-blue-700">
              <h2 className="text-2xl font-bold mb-2">Creator Pro</h2>
              <p className="text-blue-100 mb-6">无限生成，高清输出，专业创作者必备</p>
              <p className="text-4xl font-bold mb-6">$12<span className="text-lg text-blue-200"> / 月</span></p>
              <ul className="text-left space-y-3 mb-8 text-blue-50">
                <li>✔ 无限生成</li><li>✔ 图像实验室无限制</li><li>✔ 1536×1024 高清</li>
                <li>✔ 去水印</li><li>✔ 无限历史记录</li><li>✔ 更快速度</li><li>✔ 商用授权</li>
              </ul>
              <a href="/checkout/pro" className="w-full text-center py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition">升级为 Pro</a>
            </div>
          </div>

          <p className="text-slate-400 text-sm mt-12">所有订阅随时可取消。</p>
        </div>
      </div>
    </>
  );
}
