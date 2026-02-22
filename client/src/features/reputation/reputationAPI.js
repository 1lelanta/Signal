

import api from "../../services/axios";

export const getUserReputation = async (userId) => {
  const res = await api.get(`/reputation/${userId}`);
  return res.data;
};