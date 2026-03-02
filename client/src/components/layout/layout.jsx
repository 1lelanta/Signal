import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Desktop spacer to keep content centered on full viewport */}
        <div className="hidden md:block w-64 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};

export default Layout;