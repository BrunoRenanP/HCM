import axios from 'axios';

const baseURL = 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/user/all');
    return response.data;
  } catch (error) {
    throw new Error('Nenhum usuário encontrado!');
  }
};

export const fetchUsersByName = async (name) => {
  try {
    const response = await api.get(`/user/get${name ? `/${name}` : ''}`);
    return response.data;
  } catch (error) {
    throw new Error('Nenhum usuário encontrado!');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao cadastrar pessoa. Por favor, tente novamente.');
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.patch('/user/update', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao atualizar pessoa. Por favor, tente novamente.');
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/user/delete/${userId}`);
  } catch (error) {
    throw new Error('Falha ao deletar pessoa.');
  }
};