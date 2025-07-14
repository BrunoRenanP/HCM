import axios from 'axios';

const baseURL = 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateUserReport = async () => {
  try {
    await api.post('/report/user');
  } catch (error) {
    throw new Error('Falha ao solicitar a geração do relatório CSV.');
  }
};