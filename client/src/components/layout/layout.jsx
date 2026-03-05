import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../../app/themeContext";

const Layout = ({ children }) => {
  const { isWarm } = useTheme();

  return (
    <div className={`min-h-screen ${isWarm ? "bg-stone-100 text-slate-900" : "bg-slate-950 text-slate-200"}`}>
      <Navbar />

      <div className="mx-auto flex w-full max-w-screen-2xl">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="w-full">
            {children}
          </div>
        </main>

        {/* Desktop spacer to keep center column truly centered in viewport */}
        <div className="hidden md:block w-64 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};

export default Layout;