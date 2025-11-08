import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <ul className="flex justify-center items-center space-x-10 list-none m-0 p-0">
          
          {/* Logo */}
          <li>
            <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-300 whitespace-nowrap">
              LiveBackdrop
            </Link>
          </li>

          {/* Dropdown: AI Tools */}
          <li className="relative group">
            <button className="font-semibold hover:text-blue-300 whitespace-nowrap">
              AI Tools ▾
            </button>

            {/* 一级下拉 */}
            <ul className="absolute hidden group-hover:block bg-white text-blue-800 rounded-lg shadow-lg mt-2 left-0 w-56">
              <li>
                <Link href="/generate" className="block px-4 py-2 hover:bg-blue-100">
                  Generate Background
                </Link>
              </li>
              <li>
                <Link href="/upload" className="block px-4 py-2 hover:bg-blue-100">
                  Upload & Edit
                </Link>
              </li>

              {/* 二级下拉 */}
              <li className="relative group/sub">
                <button className="block w-full text-left px-4 py-2 font-semibold hover:bg-blue-100">
                  Scene Mode ▸
                </button>
                <ul className="absolute hidden group-hover/sub:block left-full top-0 bg-white text-blue-800 rounded-lg shadow-lg w-60">
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Office & Meeting</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Streaming & Studio</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Indoor Living</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Outdoor & Nature</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Education & Presentation</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Business & Brand</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Creative & Theme</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-blue-100">Custom AI Mode</a></li>
                </ul>
              </li>
            </ul>
          </li>

          {/* Regular links */}
          <li><Link href="/pricing" className="font-semibold hover:text-blue-300 whitespace-nowrap">Pricing</Link></li>
          <li><Link href="/gallery" className="font-semibold hover:text-blue-300 whitespace-nowrap">Gallery</Link></li>
          <li><Link href="/about" className="font-semibold hover:text-blue-300 whitespace-nowrap">About</Link></li>
          <li><Link href="/contact" className="font-semibold hover:text-blue-300 whitespace-nowrap">Contact</Link></li>
        </ul>
      </div>
    </nav>
  )
}
