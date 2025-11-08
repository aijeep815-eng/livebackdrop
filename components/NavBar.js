import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-center items-center space-x-10 relative">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-300 whitespace-nowrap">
            LiveBackdrop
          </Link>

          {/* Dropdown: AI Tools */}
          <div className="relative group">
            <button className="font-semibold hover:text-blue-300">AI Tools ▾</button>
            <div className="absolute hidden group-hover:block bg-white text-blue-800 rounded-lg shadow-lg mt-2 left-0 w-52">
              <Link href="/generate" className="block px-4 py-2 hover:bg-blue-100">Generate Background</Link>
              <Link href="/upload" className="block px-4 py-2 hover:bg-blue-100">Upload & Edit</Link>

              {/* Submenu */}
              <div className="relative group/sub">
                <button className="block w-full text-left px-4 py-2 font-semibold hover:bg-blue-100">
                  Scene Mode ▸
                </button>
                <div className="absolute hidden group-hover/sub:block left-full top-0 bg-white text-blue-800 rounded-lg shadow-lg w-56">
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

          {/* Regular Links */}
          <Link href="/pricing" className="font-semibold hover:text-blue-300 whitespace-nowrap">
            Pricing
          </Link>
          <Link href="/gallery" className="font-semibold hover:text-blue-300 whitespace-nowrap">
            Gallery
          </Link>
          <Link href="/about" className="font-semibold hover:text-blue-300 whitespace-nowrap">
            About
          </Link>
          <Link href="/contact" className="font-semibold hover:text-blue-300 whitespace-nowrap">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
