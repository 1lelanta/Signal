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

  if (loading) return <div>Loading admin...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <section className="mt-6">
        <h2 className="font-semibold">Users</h2>
        <table className="w-full mt-2">
          <thead><tr><th>Username</th><th>Email</th><th>Trust</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=> (
              <tr key={u._id} className="border-t">
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.trustLevel}</td>
                <td>
                  <select defaultValue={u.trustLevel} onChange={(e)=>changeTrust(u._id, e.target.value)}>
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
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Posts</h2>
        <ul>
          {posts.map(p=> (
            <li key={p._id} className="border p-2 mt-2 flex justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">by {p.author?.username}</div>
              </div>
              <div>
                <button onClick={()=>removePost(p._id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
