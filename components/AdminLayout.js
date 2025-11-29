// components/AdminLayout.js
import NavBar from "./NavBar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ title, description, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <NavBar />
      <main className="flex flex-1">
        <AdminSidebar />
        <section className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {title && (
            <header className="mb-6 border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  {description}
                </p>
              )}
            </header>
          )}
          {children}
        </section>
      </main>
    </div>
  );
}
