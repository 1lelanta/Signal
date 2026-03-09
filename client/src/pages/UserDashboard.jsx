import React from "react";

const UserDashboard = () => {
  return (
    <div className="p-4">
      <div className="rounded-lg shadow p-6 bg-white dark:bg-slate-900">
        <h1 className="text-2xl font-extrabold">Your Dashboard</h1>
        <p className="mt-3 text-slate-600">Welcome back — this is a lightweight dashboard. Extend with widgets like saved posts, activity, and settings.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-slate-50 dark:bg-slate-800">
            <div className="text-sm text-slate-500">Reputation</div>
            <div className="text-2xl font-bold mt-2">0</div>
          </div>
          <div className="p-4 border rounded bg-slate-50 dark:bg-slate-800">
            <div className="text-sm text-slate-500">Posts</div>
            <div className="text-2xl font-bold mt-2">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
