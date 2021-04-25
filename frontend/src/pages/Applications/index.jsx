import React, { useState, useMemo }from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import './styles.css';
import data from './data.json';

const Applications = ({startId = -1}) => {
    const applications = data
    const [currentId, setCurrentId] = useState(startId);
    const [search, setSearch] = useState("");

    const filteredApplications = useMemo(() => {
        return applications.filter((application) => application.name.toLowerCase().includes(search) 
            || application.title.toLowerCase().includes(search));
    }, [applications, search]);

    const applicationsList = filteredApplications.map((application) => {
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

    });

    const currentApplication = useMemo(() => {
        return applications.find((application) => application.application_id === currentId);
    }, [currentId, applications]);

    console.log("update");

    return (
        <Container className="container">
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
                    <h3>{currentApplication.name}</h3>
                </div>
                <div className="currentTitle">
                    <h1>{currentApplication.title}</h1>
                    <span className={clsx("statusPill", currentApplication.status.toLowerCase())}>{currentApplication.status}</span>
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