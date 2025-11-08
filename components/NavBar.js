import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-blue-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-center items-center gap-8 flex-wrap">
          
          <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-300">
            LiveBackdrop
          </Link>

          <div className="relative group">
            <button className="font-semibold hover:text-blue-300">AI Tools ▾</button>
            <div className="absolute hidden group-hover:flex flex-col bg-white text-blue-800 rounded-lg shadow-lg mt-2 left-0 w-56 z-50">
              <Link href="/generate" className="px-4 py-2 hover:bg-blue-100">Generate Background</Link>
              <Link href="/upload" className="px-4 py-2 hover:bg-blue-100">Upload & Edit</Link>

              <div className="relative group/sub">
                <button className="text-left px-4 py-2 font-semibold hover:bg-blue-100">Scene Mode ▸</button>
                <div className="absolute hidden group-hover/sub:flex flex-col left-full top-0 bg-white text-blue-800 rounded-lg shadow-lg w-60 z-50">
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Office & Meeting</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Streaming & Studio</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Indoor Living</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Outdoor & Nature</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Education & Presentation</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Business & Brand</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Creative & Theme</a>
                  <a href="#" className="px-4 py-2 hover:bg-blue-100">Custom AI Mode</a>
                </div>
              </div>
            </div>
          </div>

          <Link href="/pricing" className="font-semibold hover:text-blue-300">Pricing</Link>
          <Link href="/gallery" className="font-semibold hover:text-blue-300">Gallery</Link>
          <Link href="/about" className="font-semibold hover:text-blue-300">About</Link>
          <Link href="/contact" className="font-semibold hover:text-blue-300">Contact</Link>
        </div>
      </div>
    </nav>
  )
}
