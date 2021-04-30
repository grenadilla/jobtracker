import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { request } from '../../utils/api';
import { baseUrl } from '../../utils/config';

const SuggestedPostings = () => {
    const [tableData, setTableData] = useState([]);
    const history = useHistory();

    useEffect(() => {
        request('GET', '/posting/suggest')
            .then((data) => setTableData(data));
    }, []);

    const table = useMemo(() => {
        const rows = tableData.map((entry) => {
            return (
                <tr key={entry.posting_id} onClick={() => history.push(`posting/${entry.posting_id}`)} className="dataRow">
                    <td>{entry.posting_id}</td>
                    <td>{entry.title}</td>
                    <td>{entry.qualification}</td>
                </tr>
            );
        });

        return (
            <Table striped bordered hover className="dataTable">
                <thead>
                    <tr>
                        <th>Posting ID</th>
                        <th>Title</th>
                        <th>Qualification Score</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }, [tableData]);

    return (
        <Container style={{marginTop: "1rem"}}>
            {table}
        </Container>
    )
}

export default SuggestedPostings;