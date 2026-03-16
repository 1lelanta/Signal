import React, { useEffect, useState } from "react";
import { useTheme } from "../app/themeContext";
import { Link } from "react-router-dom";
import api from "../services/axios";
import { listReports } from "../services/reportAPI";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [uRes, pRes, rRes] = await Promise.all([api.get("/admin/users"), api.get("/admin/posts"), listReports()]);
      setUsers(uRes.data.users || []);
      setPosts(pRes.data.posts || []);
      setReports(Array.isArray(rRes) ? rRes : (rRes.reports || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeTrust = async (id, level) => {
    try {
      await api.patch(`/admin/users/${id}/trust`, { trustLevel: level });
      await load();
    } catch (err) { console.error(err); }
  };

  const removePost = async (id) => {
    if(!confirm("Delete this post?")) return;
    try{
      await api.delete(`/admin/posts/${id}`);
      await load();
    }catch(err){console.error(err)}
  };

  const { isWarm } = useTheme();

  if (loading) return <div className="p-4">Loading admin...</div>;

  return (
    <div className={`min-h-screen p-6 space-y-6 ${isWarm ? 'bg-gradient-to-br from-stone-50 to-stone-100 text-slate-900' : 'bg-gradient-to-br from-slate-950 to-slate-900 text-white'}`}>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/reports" className="px-3 py-1 rounded bg-amber-600 text-white text-sm">View Reports</Link>
          <div className="text-sm text-slate-500">Summary view — moderator tools</div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg shadow ${isWarm ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200'}`}>
          <div className={`text-xs ${isWarm ? 'text-slate-400' : 'text-slate-400'}`}>Total users</div>
          <div className="text-2xl font-bold mt-2">{users.length}</div>
          <div className="h-2 bg-slate-800/10 rounded mt-3">
            <div className="h-2 bg-purple-500 rounded" style={{ width: `${Math.min(100, users.length)}%` }} />
          </div>
        </div>

        <div className={`p-4 rounded-lg shadow ${isWarm ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200'}`}>
          <div className={`text-xs ${isWarm ? 'text-slate-400' : 'text-slate-400'}`}>Total posts</div>
          <div className="text-2xl font-bold mt-2">{posts.length}</div>
          <div className="h-2 bg-slate-800/10 rounded mt-3">
            <div className="h-2 bg-green-500 rounded" style={{ width: `${Math.min(100, posts.length)}%` }} />
          </div>
        </div>

        <div className={`p-4 rounded-lg shadow ${isWarm ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200'}`}>
          <div className={`text-xs ${isWarm ? 'text-slate-400' : 'text-slate-400'}`}>Open reports</div>
          <div className="text-2xl font-bold mt-2">{reports.length}</div>
          <div className="h-2 bg-slate-800/10 rounded mt-3">
            <div className="h-2 bg-red-500 rounded" style={{ width: `${Math.min(100, reports.length)}%` }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg shadow p-4 ${isWarm ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200'}`}>
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className={`text-left text-xs ${isWarm ? 'text-slate-500' : 'text-slate-300'}`}>
                  <th className="pb-2">Username</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Trust</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="py-3">{u.username}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3 font-medium">{u.trustLevel}</td>
                    <td className="py-3">
                      <select
                        defaultValue={u.trustLevel}
                        onChange={(e) => changeTrust(u._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="newbie">newbie</option>
                        <option value="trusted">trusted</option>
                        <option value="Expert">Expert</option>
                        <option value="moderator">moderator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`rounded-lg shadow p-4 ${isWarm ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200'}`}>
          <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p._id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium break-words max-w-sm">{p.title || p.content?.slice(0,80)}</div>
                  <div className="text-xs text-slate-500">by {p.author?.username}</div>
                </div>
                <div>
                  <button
                    onClick={() => removePost(p._id)}
                    className="text-sm px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </div>
  );
};

export default Admin;
