import React, { useState, useMemo, useEffect }from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import './styles.css';
import data from './data.json';
import {request} from '../../utils/api';

const Applications = ({startId = -1, postings = false, loggedIn = false}) => {
    const [itemData, setItemData] = useState([]);
    const [currentId, setCurrentId] = useState(startId);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!loggedIn) {
            return;
        }

        request('GET', '/application/user')
            .then((data) => setItemData(data))
    }, []);

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
                    <h3>{currentApplication.name}</h3>
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
            </div>}
        </Container>
    )
}

export default Applications