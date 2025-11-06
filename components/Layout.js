import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LiveBackdrop
          </Link>
          <nav className="space-x-6 text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/login" className="hover:text-blue-600">Login</Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-500 text-center py-4 mt-10">
        © {new Date().getFullYear()} LiveBackdrop. All rights reserved.
      </footer>
    </div>
  );
}
