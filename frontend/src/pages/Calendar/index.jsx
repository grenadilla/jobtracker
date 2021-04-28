import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Task from '../../utils/Task';
import { request } from '../../utils/api';
import './styles.css';

const Calendar = () => {
    const [itemData, setItemData] = useState([]);
    
    function fetchApplicationTasks() {
        request('GET', '/application/tasks')
            .then((data) => setItemData(data));
    }

    useEffect(() => {
        fetchApplicationTasks();
    }, []);

    const tasks = itemData.sort((task1, task2) => {
        const date1 = new Date(task1.due_date);
        const date2 = new Date(task2.due_date);
        if (date1 < date2) {
            return -1;
        } else if (date2 < date1) {
            return 1;
        }
        return 0;
    });

    const taskDisplay = tasks.length > 0 ? tasks.map((task => (
        <Task {...task} key={`${task.application_id} ${task.position}`} onUpdate={fetchApplicationTasks}/>
    ))) : <h1>Nothing To Do!</h1>;

    return (
        <Container className="calendar">
            {taskDisplay}
        </Container>
    )
}

export default Calendar;