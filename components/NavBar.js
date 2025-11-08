import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-center items-center px-6 py-3 space-x-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide hover:text-blue-300 transition-colors"
        >
          LiveBackdrop
        </Link>

        {/* AI Tools Dropdown */}
        <div className="relative group">
          <button className="font-semibold hover:text-blue-300 transition-colors">
            AI Tools ▾
          </button>

          {/* 一级菜单 */}
          <div className="absolute hidden group-hover:block bg-white text-blue-800 rounded-lg shadow-lg mt-2 min-w-[14rem]">
            <Link
              href="/generate"
              className="block px-4 py-2 hover:bg-blue-100 transition-colors"
            >
              Generate Background
            </Link>
            <Link
              href="/upload"
              className="block px-4 py-2 hover:bg-blue-100 transition-colors"
            >
              Upload & Edit
            </Link>

            {/* 二级菜单 */}
            <div className="relative group/submenu">
              <button className="block px-4 py-2 w-full text-left font-semibold hover:bg-blue-100 transition-colors">
                Scene Mode ▸
              </button>

              <div className="absolute hidden group-hover/submenu:block left-full top-0 bg-white text-blue-800 rounded-lg shadow-lg min-w-[14rem]">
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Office & Meeting
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Streaming & Studio
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Indoor Living
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Outdoor & Nature
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Education & Presentation
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Business & Brand
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Creative & Theme
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-100">
                  Custom AI Mode
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Other menu items */}
        <Link
          href="/pricing"
          className="font-semibold hover:text-blue-300 transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/gallery"
          className="font-semibold hover:text-blue-300 transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/about"
          className="font-semibold hover:text-blue-300 transition-colors"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="font-semibold hover:text-blue-300 transition-colors"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
