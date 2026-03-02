import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useReputation } from "../features/reputation/useReputation";
import { usePosts } from "../features/posts/usePosts";
import { updateProfile, uploadAvatar } from "../features/users/profileAPI";
import ReputationProgress from "../components/reputation/ReputationProgress";
import PostList from "../components/post/PostList";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const userId = user?._id;
  const { score } = useReputation(userId);
  const { posts } = usePosts(userId);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setUsername(user.username || "");
    setBio(user.bio || "");
    setAvatarPreview(user.avatar || "");
    const names = Array.isArray(user.skills)
      ? user.skills.map((entry) => (typeof entry === "string" ? entry : entry?.skill)).filter(Boolean)
      : [];
    setSkillsInput(names.join(", "));
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(user?.avatar || "");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      let avatarUrl = user.avatar || "";
      if (avatarFile) {
        const uploaded = await uploadAvatar(avatarFile);
        avatarUrl = uploaded.avatarUrl || avatarUrl;
      }

      const skills = skillsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const updated = await updateProfile({
        username,
        bio,
        skills,
        avatar: avatarUrl,
      });

      updateUser(updated);
      setAvatarFile(null);
      setAvatarPreview(updated.avatar || "");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="text-center py-10">Please log in to edit your profile.</div>;
  }

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">

      <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <img
            src={avatarPreview || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
            alt={user.username}
            className="h-20 w-20 rounded-full object-cover border border-slate-700"
          />
          <div>
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <p className="text-yellow-400 mt-1">⭐ Reputation: {score}</p>
            <ReputationProgress score={score} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-3">{message}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tell people about yourself"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Skills (comma separated)</label>
            <Input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Profile Image</label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>

      <PostList posts={posts} />

    </div>
  );
};

export default Profile;