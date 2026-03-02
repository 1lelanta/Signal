import { NavLink } from "react-router-dom";

const linkBase = "block px-4 py-2 rounded-md text-sm transition";

const Sidebar = () => {
  return (
    <aside className="w-64 h-[calc(100vh-64px)] border-r border-slate-800 bg-slate-900 p-4">
      <nav className="space-y-2">
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Deep Feed
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Explore
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Notifications
        </NavLink>

        <NavLink
          to="/reputation"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Reputation
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;