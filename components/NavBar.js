import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [showAITools, setShowAITools] = useState(false);
  const [showSceneMode, setShowSceneMode] = useState(false);

  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold hover:text-blue-300">
          LiveBackdrop
        </Link>

        <div className="flex space-x-6 items-center">
          <div
            className="relative"
            onMouseEnter={() => setShowAITools(true)}
            onMouseLeave={() => setShowAITools(false)}
          >
            <button className="font-semibold hover:text-blue-300">AI Tools ▾</button>
            {showAITools && (
              <div className="absolute left-0 mt-2 bg-white text-blue-800 rounded-md shadow-lg w-52">
                <Link href="/generate" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Generate Background</Link>
                <Link href="/upload" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Upload & Edit</Link>
                <div
                  className="relative"
                  onMouseEnter={() => setShowSceneMode(true)}
                  onMouseLeave={() => setShowSceneMode(false)}
                >
                  <div className="block px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white">Scene Mode ▸</div>
                  {showSceneMode && (
                    <div className="absolute top-0 left-full ml-1 bg-white text-blue-800 rounded-md shadow-lg w-56">
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Office & Meeting</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Streaming & Studio</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Indoor Living</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Outdoor & Nature</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Education & Presentation</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Business & Brand</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Creative & Theme</Link>
                      <Link href="#" className="block px-4 py-2 hover:bg-blue-600 hover:text-white">Custom AI Mode</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/pricing" className="hover:text-blue-300 font-semibold">Pricing</Link>
          <Link href="/gallery" className="hover:text-blue-300 font-semibold">Gallery</Link>
          <Link href="/about" className="hover:text-blue-300 font-semibold">About</Link>
          <Link href="/contact" className="hover:text-blue-300 font-semibold">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
