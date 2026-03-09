import React, { useEffect, useState } from "react";
import api from "../services/axios";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [uRes, pRes] = await Promise.all([api.get("/admin/users"), api.get("/admin/posts")]);
      setUsers(uRes.data.users || []);
      setPosts(pRes.data.posts || []);
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

  if (loading) return <div className="p-4">Loading admin...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold mb-4">Admin Dashboard</h1>

      <section className="mt-4 grid gap-6">
        <div className="rounded-lg shadow bg-white dark:bg-slate-900 p-4">
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left text-xs text-slate-500">
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
                    <td className="py-3 text-slate-600">{u.email}</td>
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

        <div className="rounded-lg shadow bg-white dark:bg-slate-900 p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p._id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{p.title}</div>
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
