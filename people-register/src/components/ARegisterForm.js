import { TextField } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import styled from 'styled-components';
import AForm from './AForm';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ARegisterForm = ({ title, fields, onSubmit }) => {
    const [formValues, setFormValues] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));

        if (name === 'zipCode' && value.length === 9) {
            fetchAddressData(value);
        }
    };



    const fetchAddressData = async (zipCode) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
            if (response.data && response.data.logradouro) {
                setFormValues(prevValues => ({
                    ...prevValues,
                    street: response.data.logradouro,
                    city: response.data.localidade,
                    state: response.data.uf,
                    neighborhood: response.data.bairro,
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
        }
    };

    const clearFormValues = () => {
        setFormValues({});
    };

    const customFields = fields.map(field => {
        let mask;
        let onChange;
        if (field.name === 'zipCode') {
            mask = '99999-999';
            onChange = handleChange;
        } else if (field.name === 'cellPhone') {
            mask = '(99) 99999-9999';
            onChange = handleChange;
        } else if (field.name === 'cpf') {
            mask = '999.999.999-99';
            onChange = handleChange;
        }

        return {
            ...field,
            component: mask ? (
                <InputMask
                    key={field.name}
                    mask={mask}
                    maskChar={null}
                    value={formValues[field.name] || ''}
                    onChange={onChange}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            label={field.label}
                            name={field.name}
                            type={field.type}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required={field.required}
                            sx={{ flexBasis: 'auto' }}
                        />
                    )}
                </InputMask>
            ) : (
                <TextField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required={field.required}
                    value={formValues[field.name] || ''}
                    onChange={handleChange}
                    sx={{ flexBasis: 'auto' }}
                />
            )
        };
    });

    return (
        <FormContainer>
            <AForm title={title} fields={customFields} onSubmit={() => { onSubmit(formValues); clearFormValues(); }} />
        </FormContainer>
    );
};

ARegisterForm.propTypes = {
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            required: PropTypes.bool,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.string.isRequired,
                    label: PropTypes.string.isRequired,
                })
            ),
            section: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ARegisterForm;
