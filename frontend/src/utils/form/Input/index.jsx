import { Form } from "react-bootstrap";
import { useFormContext } from "react-hook-form"
import ErrorMessage from "../ErrorMessage";

const Input = ({ name, ...props }) => {
  const { register } = useFormContext();

  return (
    <Form.Group>
      <Form.Control {...props} {...register(name)} />
      <ErrorMessage name={name} />
    </Form.Group>
  );
};

export default Input;
