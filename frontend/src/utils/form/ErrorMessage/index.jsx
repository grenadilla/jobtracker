import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

const ErrorMessage = ({ name, hideErrors = false }) => {
  const { formState: { errors } } = useFormContext();

  if (!hideErrors && errors[name]) {
    return <Form.Text className="text-danger">{errors[name].message}</Form.Text>
  }
  return null;
};

export default ErrorMessage;
