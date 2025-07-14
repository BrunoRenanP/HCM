import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import ATable from '../components/ATable';
import { fetchAllUsers, fetchUsersByName, updateUser, deleteUser } from '../service/UserService';
import { fetchAddressByZipCode } from '../service/ViaCepService';
import { generateUserReport } from '../service/ReportService';

const PeopleTable = () => {
  const [rows, setRows] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    cpf: '',
    cellPhone: '',
    address: {
      street: '',
      numberHouse: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // Função para formatar CPF
  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar celular
  const formatCellPhone = (phone) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const columns = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Nome' },
    { 
      id: 'cpf', 
      numeric: false, 
      disablePadding: true, 
      label: 'CPF',
      format: (row) => formatCPF(row.cpf)
    },
    { 
      id: 'cellPhone', 
      numeric: false, 
      disablePadding: true, 
      label: 'Celular',
      format: (row) => formatCellPhone(row.cellPhone)
    },
    {
      id: 'localization',
      numeric: false,
      disablePadding: true,
      label: 'Localidade',
      format: (row) => `${row.address.street}, ${row.address.numberHouse}, ${row.address.city} - ${row.address.state}`
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchAllUsers();
        setRows(users);
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchData();
  }, []);

  const fetchFilteredRows = async (filterText) => {
    try {
      const users = await fetchUsersByName(filterText);
      return users;
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return [];
    }
  };

  const handleAddressChange = async (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => {
      const newValues = {
        ...prevValues,
        address: {
          ...prevValues.address,
          [name]: value
        }
      };

      if (name === 'zipCode') {
        const cleanedZipCode = value.replace(/\D/g, '');
        if (cleanedZipCode.length === 8) {
          fetchAddressByZipCode(cleanedZipCode)
            .then((data) => {
              const { logradouro, numero, localidade, uf } = data;
              setFormValues((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  street: logradouro || '',
                  numberHouse: numero || '',
                  city: localidade || '',
                  state: uf || ''
                }
              }));
            })
            .catch((error) => {
              setSnackbarMessage(error.message);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
            });
        }
      }

      return newValues;
    });
  };

  const handleDeleteRows = async (rowsToDelete) => {
    try {
      await Promise.all(rowsToDelete.map((row) => deleteUser(row.id)));
      setRows((prevRows) => prevRows.filter((row) => !rowsToDelete.includes(row)));
      setSnackbarMessage('Pessoas deletadas com sucesso!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleGenerateReport = async () => {
    try {
      await generateUserReport();
      setSnackbarMessage('Relatório CSV está sendo gerado.');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleEditRow = (rowToEdit) => {
    setFormValues({ ...rowToEdit, address: rowToEdit.address || {} });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleUpdatePerson = async () => {
    try {
      await updateUser(formValues);
      setSnackbarMessage('Pessoa atualizada com sucesso!');
      setSnackbarSeverity('success');
      const updatedRows = await fetchAllUsers();
      setRows(updatedRows);
      handleCloseEditDialog();
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '24px' }}>
        <Tooltip title="Gerar relatório de todos os usuários cadastrados no sistema" arrow>
          <Button variant="contained" color="primary" onClick={handleGenerateReport}>
            Gerar Relatório
          </Button>
        </Tooltip>
      </div>
      <ATable
        columns={columns}
        rows={rows}
        title="Usuários cadastrados"
        fetchFilteredRows={fetchFilteredRows}
        onDeleteRows={handleDeleteRows}
        onEditRow={handleEditRow}
      />

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Pessoa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.name}
            onChange={handleEditChange}
          />
          <InputMask
            mask="999.999.999-99"
            maskChar={null}
            value={formValues.cpf}
            onChange={handleEditChange}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                margin="dense"
                name="cpf"
                label="CPF"
                type="text"
                fullWidth
                variant="standard"
              />
            )}
          </InputMask>
          <InputMask
            mask="(99) 99999-9999"
            maskChar={null}
            value={formValues.cellPhone}
            onChange={handleEditChange}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                margin="dense"
                name="cellPhone"
                label="Celular"
                type="text"
                fullWidth
                variant="standard"
              />
            )}
          </InputMask>
          <InputMask
            mask="99999-999"
            maskChar={null}
            value={formValues.address.zipCode}
            onChange={handleAddressChange}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                margin="dense"
                name="zipCode"
                label="CEP"
                type="text"
                fullWidth
                variant="standard"
              />
            )}
          </InputMask>
          <TextField
            margin="dense"
            name="street"
            label="Rua"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.address.street}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="numberHouse"
            label="Número"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.address.numberHouse}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="Cidade"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.address.city}
            onChange={handleAddressChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="Estado"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.address.state}
            onChange={handleAddressChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleUpdatePerson}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PeopleTable;