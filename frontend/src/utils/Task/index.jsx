import React from 'react';
import clsx from 'clsx';
import './styles.css';

const Task = ({name, title, company, application_id, due_date, completed}) => {
    const dueDateResult = completed ? "Completed" : due_date;
    return (
        <div className={clsx("task", completed && "completed")}>
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
    )
}

export default Task;