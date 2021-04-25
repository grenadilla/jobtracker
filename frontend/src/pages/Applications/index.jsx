import React, { useState, useMemo }from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import './styles.css';
import data from './data.json';

const Applications = () => {
    const applications = data
    const [currentId, setCurrentId] = useState(-1);

    const applicationsList = applications.map((application) => {
        return (
        <div className={clsx("application", application.application_id === currentId && "selectedApplication")} 
            onClick={() => setCurrentId(application.application_id)}
            key={application.application_id}>
            <img src={`//logo.clearbit.com/${application.website}`} className="companyLogo"/>
            <div className="applicationText">
                <h3 className="applicationTitle">{application.title}</h3>
                <h4 className="applicationCompany">{application.name}</h4>
            </div>
            
        </div>
        );

        /*
            {application.application_id == id &&
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='100' height='100' className={"selectedArrow"}>
                <path d="M 95,50 5,95 5,5 z"/>
            </svg>}
        */
    });

    const currentApplication = useMemo(() => {
        return applications.find((application) => application.application_id === currentId);
    }, [currentId, applications])

    return (
        <Container className="container">
            <div className="applications">
                {applicationsList}
            </div>
            {currentId > 0 &&
            <div className="applicationDetail">
                <div className="currentCompany">
                    <img src={`//logo.clearbit.com/${currentApplication.website}`} className="currentLogo"/>
                    <h3>{currentApplication.name}</h3>
                </div>
                <div className="currentTitle">
                    <h1>{currentApplication.title}</h1>
                    <span className="statusPill">{currentApplication.status}</span>
                </div>
                <div className="currentSource">
                    <h4>Source</h4>
                    <a href={currentApplication.link}>{currentApplication.link}</a>
                </div>
                <div className="currentDescription">
                    <h4>Description</h4>
                    <p>{currentApplication.description}</p>
                </div>
            </div>}
        </Container>
    )
}

export default Applications