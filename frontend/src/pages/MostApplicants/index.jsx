import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { baseUrl } from '../../utils/config';

const MostApplicants = () => {
    const [applicantData, setApplicantData] = useState(null);

    useEffect(() => {
        const url = `${baseUrl}/most_applicants`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => setApplicantData(data))
            .catch((err) => console.error(err))
    }, []);

    const applicantRows = applicantData ? applicantData.map((entry) => (
        <tr key={entry.id}>
            <td>{entry.id}</td>
            <td>{entry.name}</td>
            <td>{entry.title}</td>
            <td>{entry.num}</td>
        </tr>
    )) : null;

    return applicantData ? (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>Posting ID</th>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Num Remaining Applicants</th>
                    </tr>
                </thead>
                <tbody>
                    {applicantRows}
                </tbody>
            </Table>
        </Container>
    ) : "Loading...";
}

export default MostApplicants;