import {
  Alert,
  Snackbar,
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  Box,
  Divider
} from '@mui/material';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { registerUser } from '../service/UserService';
import { fetchAddressByZipCode } from '../service/ViaCepService';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    cellPhone: '',
    cpf: '',
    street: '',
    city: '',
    state: '',
    neighborhood: '',
    zipCode: '',
    numberHouse: '',
  });

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const cleanInput = (input) => input.replace(/\D/g, '');

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'zipCode') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length === 8) {
        try {
          const data = await fetchAddressByZipCode(cleaned);
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        } catch (error) {
          setMessage('Erro ao buscar endereço no ViaCEP.');
          setSeverity('error');
          setOpen(true);
        }
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const personDTO = {
        name: formData.name,
        cellPhone: cleanInput(formData.cellPhone),
        cpf: cleanInput(formData.cpf),
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          neighborhood: formData.neighborhood,
          zipCode: cleanInput(formData.zipCode),
          numberHouse: formData.numberHouse,
        }
      };

      await registerUser(personDTO);
      setMessage('Pessoa cadastrada com sucesso!');
      setSeverity('success');
    } catch (error) {
      setMessage(error.message);
      setSeverity('error');
    } finally {
      setOpen(true);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Cadastro de Pessoa
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Dados Pessoais
            </Typography>

            <TextField
              fullWidth
              label="Nome"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              margin="dense"
            />

            <InputMask
              mask="(99) 99999-9999"
              value={formData.cellPhone}
              onChange={handleChange}
              maskChar={null}
            >
              {() => (
                <TextField
                  fullWidth
                  label="Celular"
                  name="cellPhone"
                  required
                  margin="dense"
                />
              )}
            </InputMask>

            <InputMask
              mask="999.999.999-99"
              value={formData.cpf}
              onChange={handleChange}
              maskChar={null}
            >
              {() => (
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  required
                  margin="dense"
                />
              )}
            </InputMask>
          </Grid>

          {/* Seção de endereço */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Endereço
            </Typography>

            <InputMask
              mask="99999-999"
              value={formData.zipCode}
              onChange={handleChange}
              maskChar={null}
            >
              {() => (
                <TextField
                  fullWidth
                  label="CEP"
                  name="zipCode"
                  required
                  margin="dense"
                />
              )}
            </InputMask>

            <TextField
              fullWidth
              label="Rua"
              name="street"
              required
              value={formData.street}
              onChange={handleChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Número"
              name="numberHouse"
              required
              value={formData.numberHouse}
              onChange={handleChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Bairro"
              name="neighborhood"
              required
              value={formData.neighborhood}
              onChange={handleChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Cidade"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Estado"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="contained" type="submit" color="primary">
            Cadastrar
          </Button>
        </Box>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RegisterForm;
