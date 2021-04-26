import React, { useState, useMemo, useEffect }from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './styles.css';
import { request } from '../../utils/api';
import dateConvert from '../../utils/dateConvert';
import Task from '../../utils/Task';

const Applications = ({startId = -1, postings = false, loggedIn = false}) => {
    const [itemData, setItemData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [currentId, setCurrentId] = useState(startId);
    const [search, setSearch] = useState("");

    const [creatingTask, setCreatingTask] = useState(false);
    const [taskFormData, setTaskFormData] = useState({name: "", due_date: ""});

    useEffect(() => {
        if (!loggedIn) {
            return;
        }

        request('GET', '/application/user')
            .then((data) => setItemData(data))
    }, []);

    useEffect(() => {
        if (!loggedIn || currentId <= 0) {
            return;
        }

        request('GET', `/application/tasks/${currentId}`)
            .then((data) => setTasks(data));
    }, [currentId, creatingTask]);

    const filteredItems = useMemo(() => {
        return itemData.filter((application) => application.company.toLowerCase().includes(search) 
            || application.title.toLowerCase().includes(search));
    }, [itemData, search]);

    const applicationsList = filteredItems.map((item) => {
        const selected = postings ? item.id === currentId : item.application_id === currentId;
        return (
        <div className={clsx("application", selected && "selectedApplication")} 
            onClick={() => setCurrentId(item.application_id)}
            key={item.application_id}>
            <img src={`//logo.clearbit.com/${item.website}`} className="companyLogo"/>
            <div className="applicationText">
                <h3 className="applicationTitle">{item.title}</h3>
                <h4 className="applicationCompany">{item.name}</h4>
            </div>
            
        </div>
        );
    });

    const currentApplication = useMemo(() => {
        if (postings) {
            return itemData.find((application) =>application.posting_id);
        }
        return itemData.find((application) => application.application_id === currentId);
    }, [currentId, itemData]);

    // Note task display is untested - have to add a way to create tasks first
    const taskDisplay = tasks.map((task) => <Task {...task} />)

    function createTask() {
        const body = {
            name: taskFormData["name"],
            due_date: dateConvert(new Date(taskFormData["due_date"])),
            application_id: currentId, 
            completed: false
        };
        request('POST', '/task/create', body)
            .then(() => {
                setTaskFormData({name: "", due_date: ""});
                setCreatingTask(false);
            });
    }
    
    return (
        <Container className="applicationsPage">
            <div className="leftCol">
                <input type="text" className={clsx("form-control", "applicationSearch")} value={search} onChange={(e) => setSearch(e.target.value)}/>
                <div className="applications">
                    {applicationsList}
                </div>
            </div>
            
            {currentId > 0 &&
            <div className="applicationDetail">
                <div className="currentCompany">
                    <img src={`//logo.clearbit.com/${currentApplication.website}`} className="currentLogo"/>
                    <h3>{currentApplication.company}</h3>
                </div>
                <div className="currentTitle">
                    <h1>{currentApplication.title}</h1>
                    {!postings &&
                    <span className={clsx("statusPill", currentApplication.status.toLowerCase())}>{currentApplication.status}</span>}
                </div>
                <div className="attribute">
                    <h4>Source</h4>
                    <a href={currentApplication.link}>{currentApplication.link}</a>
                </div>
                <div className="attribute">
                    <h4>Description</h4>
                    <p>{currentApplication.description}</p>
                </div>
                <div className="attribute">
                    <h4>Location</h4>
                    <p>{currentApplication.location}</p>
                </div>

                <div className="tasks">
                    {taskDisplay}
                </div>
                
                <Button onClick={() => setCreatingTask(true)}>Add Task</Button>
                <Modal show={creatingTask} onHide={() => setCreatingTask(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add A Task</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={taskFormData["name"]} onChange={(e) => setTaskFormData({...taskFormData, name: e.target.value})}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control type="text" value={taskFormData["due_date"]} onChange={(e) => setTaskFormData({...taskFormData, due_date: e.target.value})}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setCreatingTask(false)}>Close</Button>
                        <Button variant="primary" onClick={createTask}>Add Task</Button>
                    </Modal.Footer>
                </Modal>
            </div>}
        </Container>
    )
}

export default Applications