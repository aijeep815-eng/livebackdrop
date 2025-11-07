import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-10 px-4 bg-white">
      {/* Hero 区域 */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Bring Your Live to Life</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Create stunning virtual backgrounds with AI. Generate, customize, and download in seconds.
        </p>
      </section>

      {/* 三个功能图片区 - 使用 grid 完美居中 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 place-items-center w-full text-center">
        <div className="max-w-sm">
          <Image src="/ai-generate.png" alt="AI Generate" width={300} height={200} className="rounded-xl shadow-lg" />
          <h3 className="text-xl font-semibold mt-4">AI Generate</h3>
          <p className="text-gray-500 mt-2 px-4">Automatically create virtual backgrounds with AI power.</p>
        </div>

        <div className="max-w-sm">
          <Image src="/customize.png" alt="Customize" width={300} height={200} className="rounded-xl shadow-lg" />
          <h3 className="text-xl font-semibold mt-4">Customize</h3>
          <p className="text-gray-500 mt-2 px-4">Adjust lighting, colors, and style for your unique brand.</p>
        </div>

        <div className="max-w-sm">
          <Image src="/download.png" alt="Download" width={300} height={200} className="rounded-xl shadow-lg" />
          <h3 className="text-xl font-semibold mt-4">Download</h3>
          <p className="text-gray-500 mt-2 px-4">Instantly download and use your new virtual background.</p>
        </div>
      </section>
    </main>
  );
}
