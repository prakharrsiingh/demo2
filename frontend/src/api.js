import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
