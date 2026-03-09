import api from "./axios";

export const createReport = async (payload) => {
  const res = await api.post("/reports", payload);
  return res.data;
};

export const listReports = async (params = {}) => {
  const res = await api.get("/reports", { params });
  return res.data;
};

export const getReport = async (id) => {
  const res = await api.get(`/reports/${id}`);
  return res.data;
};

export const updateReport = async (id, payload) => {
  const res = await api.patch(`/reports/${id}`, payload);
  return res.data;
};
