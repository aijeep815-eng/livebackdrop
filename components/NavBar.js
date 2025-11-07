import { useState } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [isSceneModeOpen, setIsSceneModeOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center text-2xl font-bold text-gray-800">
            LiveBackdrop
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <a href="/" className="hover:text-blue-600 transition">Home</a>

            {/* AI Tools Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsAIToolsOpen(true)}
              onMouseLeave={() => setIsAIToolsOpen(false)}
            >
              <button className="hover:text-blue-600 transition">AI Tools ▾</button>
              {isAIToolsOpen && (
                <div className="absolute bg-white shadow-lg rounded-md mt-2 w-56 text-left z-10">
                  <a href="/ai/generate" className="block px-4 py-2 hover:bg-gray-100">Generate Background</a>
                  <a href="/ai/upload" className="block px-4 py-2 hover:bg-gray-100">Upload & Edit</a>

                  {/* Scene Mode Nested */}
                  <div
                    className="relative group"
                    onMouseEnter={() => setIsSceneModeOpen(true)}
                    onMouseLeave={() => setIsSceneModeOpen(false)}
                  >
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Scene Mode ▸</button>
                    {isSceneModeOpen && (
                      <div className="absolute left-full top-0 bg-white shadow-lg rounded-md mt-0 ml-1 w-64 text-left z-20">
                        <a href="/scene/office" className="block px-4 py-2 hover:bg-gray-100">Office & Meeting</a>
                        <a href="/scene/streaming" className="block px-4 py-2 hover:bg-gray-100">Streaming & Studio</a>
                        <a href="/scene/indoor" className="block px-4 py-2 hover:bg-gray-100">Indoor Living</a>
                        <a href="/scene/outdoor" className="block px-4 py-2 hover:bg-gray-100">Outdoor & Nature</a>
                        <a href="/scene/education" className="block px-4 py-2 hover:bg-gray-100">Education & Presentation</a>
                        <a href="/scene/business" className="block px-4 py-2 hover:bg-gray-100">Business & Brand</a>
                        <a href="/scene/creative" className="block px-4 py-2 hover:bg-gray-100">Creative & Theme</a>
                        <a href="/scene/custom" className="block px-4 py-2 hover:bg-gray-100">Custom AI Mode</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <a href="/pricing" className="hover:text-blue-600 transition">Pricing</a>
            <a href="/gallery" className="hover:text-blue-600 transition">Gallery</a>
            <a href="/about" className="hover:text-blue-600 transition">About</a>
            <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none text-xl"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <a href="/" className="block px-4 py-2 hover:bg-gray-100">Home</a>
          <button
            onClick={() => setIsAIToolsOpen(!isAIToolsOpen)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            AI Tools ▾
          </button>

          {isAIToolsOpen && (
            <div className="pl-4">
              <a href="/ai/generate" className="block px-4 py-2 hover:bg-gray-100">Generate Background</a>
              <a href="/ai/upload" className="block px-4 py-2 hover:bg-gray-100">Upload & Edit</a>

              <button
                onClick={() => setIsSceneModeOpen(!isSceneModeOpen)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Scene Mode ▾
              </button>

              {isSceneModeOpen && (
                <div className="pl-4">
                  <a href="/scene/office" className="block px-4 py-2 hover:bg-gray-100">Office & Meeting</a>
                  <a href="/scene/streaming" className="block px-4 py-2 hover:bg-gray-100">Streaming & Studio</a>
                  <a href="/scene/indoor" className="block px-4 py-2 hover:bg-gray-100">Indoor Living</a>
                  <a href="/scene/outdoor" className="block px-4 py-2 hover:bg-gray-100">Outdoor & Nature</a>
                  <a href="/scene/education" className="block px-4 py-2 hover:bg-gray-100">Education & Presentation</a>
                  <a href="/scene/business" className="block px-4 py-2 hover:bg-gray-100">Business & Brand</a>
                  <a href="/scene/creative" className="block px-4 py-2 hover:bg-gray-100">Creative & Theme</a>
                  <a href="/scene/custom" className="block px-4 py-2 hover:bg-gray-100">Custom AI Mode</a>
                </div>
              )}
            </div>
          )}

          <a href="/pricing" className="block px-4 py-2 hover:bg-gray-100">Pricing</a>
          <a href="/gallery" className="block px-4 py-2 hover:bg-gray-100">Gallery</a>
          <a href="/about" className="block px-4 py-2 hover:bg-gray-100">About</a>
          <a href="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</a>
        </div>
      )}
    </nav>
  );
}
