import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center items-center space-x-10">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-300">
          LiveBackdrop
        </Link>

        {/* Dropdown: AI Tools */}
        <div className="relative">
          <button className="peer font-semibold hover:text-blue-300">AI Tools ▾</button>
          {/* 一级下拉 */}
          <div className="absolute hidden peer-hover:flex hover:flex flex-col bg-white text-blue-800 rounded-lg shadow-lg mt-2 left-0 w-56 z-50">
            <Link href="/generate" className="block px-4 py-2 hover:bg-blue-100">Generate Background</Link>
            <Link href="/upload" className="block px-4 py-2 hover:bg-blue-100">Upload & Edit</Link>

            {/* 二级下拉 */}
            <div className="relative">
              <button className="peer/sub block w-full text-left px-4 py-2 font-semibold hover:bg-blue-100">
                Scene Mode ▸
              </button>
              <div className="absolute hidden peer-hover/sub:flex hover:flex flex-col left-full top-0 bg-white text-blue-800 rounded-lg shadow-lg w-60 z-50">
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
        <Link href="/pricing" className="font-semibold hover:text-blue-300">Pricing</Link>
        <Link href="/gallery" className="font-semibold hover:text-blue-300">Gallery</Link>
        <Link href="/about" className="font-semibold hover:text-blue-300">About</Link>
        <Link href="/contact" className="font-semibold hover:text-blue-300">Contact</Link>
      </div>
    </nav>
  )
}
