import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../features/users/profileAPI";
import { useReputation } from "../features/reputation/useReputation";
import PostList from "../components/post/PostList";

const ProfileView = () => {
  const { id } = useParams();
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const { score } = useReputation(id);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile(id);
        setTarget(res.user || res);
      } catch (err) {
        setTarget(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (!target) return <div className="p-4">Profile not found.</div>;

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">
      <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={target.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${target.username}`}
            alt={target.username}
            className="h-20 w-20 rounded-full object-cover border border-slate-700"
          />
          <div>
            <h2 className="text-xl font-bold">{target.username}</h2>
            <p className="text-sm text-slate-400">@{target.username}</p>
            <p className="mt-2 text-sm text-slate-300">{target.bio}</p>
            <p className="mt-2 text-yellow-400">⭐ Reputation: {score}</p>
          </div>
        </div>
      </div>

      <PostList postsOwnerId={id} />
    </div>
  );
};

export default ProfileView;
