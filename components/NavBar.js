import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-center items-center gap-10 flex-wrap">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-300">
            LiveBackdrop
          </Link>

          {/* AI Tools dropdown */}
          <div className="relative group inline-flex items-center">
            <button className="font-semibold hover:text-blue-300">
              AI Tools ▾
            </button>
            <div className="absolute hidden group-hover:block bg-white text-blue-800 rounded-lg shadow-lg mt-2 left-0 min-w-[210px]">
              <Link href="/generate" className="block px-4 py-2 hover:bg-blue-100">Generate Background</Link>
              <Link href="/upload" className="block px-4 py-2 hover:bg-blue-100">Upload & Edit</Link>

              {/* Submenu */}
              <div className="relative group/sub">
                <button className="block w-full text-left px-4 py-2 font-semibold hover:bg-blue-100">
                  Scene Mode ▸
                </button>
                <div className="absolute hidden group-hover/sub:block left-full top-0 bg-white text-blue-800 rounded-lg shadow-lg min-w-[240px]">
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Office & Meeting</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Streaming & Studio</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Indoor Living</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Outdoor & Nature</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Education & Presentation</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Business & Brand</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Creative & Theme</a>
                  <a href="#" className="block px-4 py-2 hover:bg-blue-100">Custom AI Mode</a>
                </div>
              </div>
            </div>
          </div>

          {/* Normal links */}
          <Link href="/pricing" className="font-semibold hover:text-blue-300">Pricing</Link>
          <Link href="/gallery" className="font-semibold hover:text-blue-300">Gallery</Link>
          <Link href="/about" className="font-semibold hover:text-blue-300">About</Link>
          <Link href="/contact" className="font-semibold hover:text-blue-300">Contact</Link>
        </div>
      </div>
    </nav>
  )
}
