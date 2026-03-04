import api from "../../services/axios";

export const updateProfile = async (payload) => {
  const res = await api.put("/users/profile", payload);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.post("/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const getFollowStatus = async (userId) => {
  const res = await api.get(`/users/${userId}/follow-status`);
  return res.data;
};

export const toggleFollowUser = async (userId) => {
  const res = await api.post(`/users/${userId}/follow`);
  return res.data;
};
