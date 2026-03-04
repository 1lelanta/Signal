import api from "../../services/axios";

export const getMessageUsers = async () => {
  const res = await api.get("/messages/users");
  return res.data;
};

export const getConversation = async (userId) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data;
};

export const uploadMessageImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/messages/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const sendPrivateMessage = async (userId, payload) => {
  const res = await api.post(`/messages/${userId}`, payload);
  return res.data;
};

export const getUnreadMessagesCount = async () => {
  const res = await api.get("/messages/unread/count");
  return res.data;
};