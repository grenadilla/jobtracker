import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import './styles.css';
import { Button, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../form/Input';
import { deleteApplicationTask, updateApplicationTask } from '../api';
import Select from '../form/Select';

const schema = yup.object().shape({
    name: yup.string().required(),
    due_date: yup.string(),
    completed: yup.boolean(),
});

const completedOptions = [
    { value: false, label: 'Incomplete' },
    { value: true, label: 'Complete' },
];

const Task = ({name, title, company, application_id, due_date, completed, position, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit } = methods;

    useEffect(() => {
        methods.reset({ name, due_date, completed })
    }, [name, due_date, completed]);

    const handleValidSubmit = async data => {
        await updateApplicationTask({ application_id, position, ...data });
        setIsEditing(false);
        onUpdate && onUpdate();
    }

    const handleDelete = () => {
        deleteApplicationTask(application_id, position);
        setIsEditing(false);
        onUpdate && onUpdate();
    }

    const dueDateResult = completed ? "Completed" : due_date;
    return (
        <div className="taskContainer">
            <div className={clsx("task", completed && "completed")} onClick={() => setIsEditing(true)}>
                <div>
                    <h3 className="taskName">{name}</h3>
                    <div>
                        {`${title} - ${company}`}
                    </div>
                </div>
                <span>
                    {dueDateResult}
                </span>
            </div>

            <Modal show={isEditing} onHide={() => setIsEditing(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleValidSubmit)}>
                        <Modal.Body>
                            <Input name="name" placeholder="Name" />
                            <Input name="due_date" placeholder="Due Date" />
                            <Select name="completed" placeholder="Status" options={completedOptions} />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                            <Button type="submit">Submit</Button>
                        </Modal.Footer>
                    </form>
                </FormProvider>
            </Modal>
        </div>
    )
}

export default Task;