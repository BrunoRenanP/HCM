import axios from 'axios';

const baseURL = 'https://viacep.com.br/ws';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAddressByZipCode = async (zipCode) => {
  const formattedZipCode = zipCode.replace(/\D/g, '');
  if (formattedZipCode.length !== 8) {
    throw new Error('CEP inválido.');
  }
  try {
    const response = await api.get(`/${formattedZipCode}/json/`);
    return response.data;
  } catch (error) {
    throw new Error('Falha ao buscar endereço.');
  }
};