import api from "../../services/axios";

export const getMessageUsers = async () => {
  const res = await api.get("/messages/users");
  return res.data;
};

export const getConversation = async (userId) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data;
};

export const sendPrivateMessage = async (userId, text) => {
  const res = await api.post(`/messages/${userId}`, { text });
  return res.data;
};