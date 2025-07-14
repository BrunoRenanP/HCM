import { Box, Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import InputMask from 'react-input-mask';
import styled from 'styled-components';

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: calc(98% - 40px);
  max-width: 100%;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const FormButton = styled(Button)`
  margin-top: 20px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  font-family: 'Poppins', sans-serif;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;

  
  & > div {
    min-width: 250px; 
  }
`;

const AForm = ({ title, fields, onSubmit, values, onChange }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        onSubmit(data);
    };


    const groupedFields = Array.isArray(fields) ? fields.reduce((acc, field) => {
        if (field && field.section) {
            if (!acc[field.section]) {
                acc[field.section] = [];
            }
            acc[field.section].push(field);
        }
        return acc;
    }, {}) : {};

    return (
        <FormContainer component="form" onSubmit={handleSubmit}>
            <FormTitle>{title}</FormTitle>
            <SectionContainer>
                {Object.keys(groupedFields).map((section) => (
                    <Section key={section}>
                        <SectionTitle>{section}</SectionTitle>
                        <FieldContainer>
                            {groupedFields[section].map((field) => {
                                if (!field || !field.name) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={field.name}>
                                        {field.component ? (
                                            field.component
                                        ) : (
                                            <InputMask
                                                mask={field.mask || ''}
                                                value={values[field.name] || ''}
                                                onChange={(e) => {
                                                    const { name, value } = e.target;
                                                    if (onChange) {
                                                        onChange(name, value);
                                                    }
                                                }}
                                                maskChar={null}
                                            >
                                                {(inputProps) => (
                                                    <TextField
                                                        {...inputProps}
                                                        name={field.name}
                                                        label={field.label}
                                                        type={field.type}
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        required={field.required}
                                                    />
                                                )}
                                            </InputMask>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </FieldContainer>
                    </Section>
                ))}
            </SectionContainer>
            <FormButton type="submit" variant="contained" color="primary">
                Cadastrar
            </FormButton>
        </FormContainer>
    );
};

AForm.propTypes = {
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            required: PropTypes.bool,
            section: PropTypes.string.isRequired,
            component: PropTypes.element,
            mask: PropTypes.string
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    values: PropTypes.object,
    onChange: PropTypes.func
};

export default AForm;
