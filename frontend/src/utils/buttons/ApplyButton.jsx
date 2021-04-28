import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '../form/Select';
import Input from '../form/Input';
import { createApplication, getApplication, updateApplication } from '../api';

const schema = yup.object().shape({
  status: yup.string().required(),
  portal: yup.string().url(),
});

const defaultValues = {};

const statusOptions = ['Interested', 'Applied', 'Rejected', 'Offer', 'Accepted']
  .map(label => ({ label, value: label.toUpperCase() }));

// if update mode is desired, provide the application id to update for `applicationToUpdate` (and postingId is not necessary then)
const ApplyButton = ({ postingId, applicationToUpdate = -1, children, onSubmit, ...props }) => {
  const [showPopup, setShowPopup] = useState(false);
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { handleSubmit } = methods;

  useEffect(() => {
    if (showPopup) {
      methods.reset({});
      if (applicationToUpdate >= 0) {
        getApplication(applicationToUpdate).then(data => methods.reset(data));
      }
    }
  }, [applicationToUpdate, showPopup]);

  const handleValidSubmit = async ({ status, portal }) => {
    if (applicationToUpdate >= 0) {
      await updateApplication(applicationToUpdate, status, portal);
    } else {
      await createApplication(postingId, status, portal);
    }
    setShowPopup(false);
    onSubmit && onSubmit();
  }

  const handleError = data => {
    console.log(data);
  }

  return (
    <div>
      <Button {...props} onClick={() => setShowPopup(true)}>{children || 'Apply Now'}</Button>

      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>{children || 'Apply Now'}</Modal.Title>
        </Modal.Header>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleValidSubmit, handleError)}>
            <Modal.Body>
              <Select name="status" options={statusOptions} placeholder="Status" />
              <Input name="portal" placeholder="Portal Link" />
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPopup(false)}>Close</Button>
              <Button type="submit">Submit</Button>
            </Modal.Footer>
          </form>
        </FormProvider>
      </Modal>
    </div>
  )
};

export default ApplyButton;
