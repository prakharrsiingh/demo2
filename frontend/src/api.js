import axios from 'axios';

// Use environment variable if available, otherwise fallback to local server or render
const API_URL = import.meta.env.VITE_API_URL || 'https://candidate-backend-eugn.onrender.com/api';

export const getCandidates = async () => {
  const response = await axios.get(`${API_URL}/candidates`);
  return response.data;
};

export const addCandidate = async (candidateData) => {
  const response = await axios.post(`${API_URL}/candidates`, candidateData);
  return response.data;
};

export const matchCandidates = async (matchData) => {
  const response = await axios.post(`${API_URL}/match`, matchData);
  return response.data;
};

export const aiShortlist = async (matchData) => {
  const response = await axios.post(`${API_URL}/ai/shortlist`, matchData);
  return response.data;
};

export const toggleShortlist = async (id) => {
  const response = await axios.put(`${API_URL}/candidates/${id}/shortlist`);
  return response.data;
};
