import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>LiveBackdrop – AI Virtual Backgrounds</title>
        <meta
          name="description"
          content="Create stunning AI-generated virtual backgrounds for your live streams and meetings."
        />
      </Head>

      {/* 顶部大标题区域 */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-white to-blue-50">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6">
          LiveBackdrop
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl">
          Create stunning virtual backgrounds powered by AI for your live
          streams and meetings.
        </p>
        <Link
          href="/generate"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Get Started
        </Link>
      </section>

      {/* 功能介绍区 —— 水平居中、上下对齐 */}
      <section className="w-full flex justify-center items-center py-20 bg-white">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl w-full px-6 text-center place-items-center">
          {/* 卡片1 */}
          <div className="flex flex-col items-center">
            <Image
              src="/ai-generate.png"
              alt="AI Generate"
              width={120}
              height={120}
              className="mb-6"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              AI Generate
            </h3>
            <p className="text-gray-600 max-w-xs">
              Instantly create professional virtual backgrounds using advanced
              AI.
            </p>
          </div>

          {/* 卡片2 */}
          <div className="flex flex-col items-center">
            <Image
              src="/customize.png"
              alt="Customize"
              width={120}
              height={120}
              className="mb-6"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Customize</h3>
            <p className="text-gray-600 max-w-xs">
              Fine-tune lighting, colors, and composition for your perfect
              scene.
            </p>
          </div>

          {/* 卡片3 */}
          <div className="flex flex-col items-center">
            <Image
              src="/download.png"
              alt="Download"
              width={120}
              height={120}
              className="mb-6"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Download</h3>
            <p className="text-gray-600 max-w-xs">
              Save and apply your generated backgrounds with a single click.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
