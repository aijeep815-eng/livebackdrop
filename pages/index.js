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

      {/* 三个功能图片区 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-center justify-center">
        <div className="flex flex-col items-center">
          <Image src="/ai-generate.jpg" alt="AI Generate" width={300} height={200} className="rounded-xl shadow-md" />
          <h3 className="text-xl font-semibold mt-4">AI Generate</h3>
          <p className="text-gray-500 text-center mt-2 px-4">Automatically create virtual backgrounds with AI power.</p>
        </div>

        <div className="flex flex-col items-center">
          <Image src="/customize.jpg" alt="Customize" width={300} height={200} className="rounded-xl shadow-md" />
          <h3 className="text-xl font-semibold mt-4">Customize</h3>
          <p className="text-gray-500 text-center mt-2 px-4">Adjust lighting, colors, and style for your unique brand.</p>
        </div>

        <div className="flex flex-col items-center">
          <Image src="/download.jpg" alt="Download" width={300} height={200} className="rounded-xl shadow-md" />
          <h3 className="text-xl font-semibold mt-4">Download</h3>
          <p className="text-gray-500 text-center mt-2 px-4">Instantly download and use your new virtual background.</p>
        </div>
      </section>
    </main>
  );
}
