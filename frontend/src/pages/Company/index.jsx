import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Paginator from '../../utils/pagination';

const Company = () => {
    const query = new URLSearchParams(useLocation().search);
    const currentPage = parseInt(query.get("page")) || 1;
    const perPage = parseInt(query.get("per_page")) || 25;
    const [totalPages, setTotalPages] = useState(1);
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        const url = new URL("http://127.0.0.1:5000/company/all");
        const params = { page: currentPage, per_page: perPage };
        url.search = new URLSearchParams(params).toString();
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCompanyData(data.payload); 
                setTotalPages(data.total_pages)
            })
            .catch((err) => console.log(err));
    }, [currentPage, perPage]);

    const table = useMemo(() => {
        const rows = companyData.map((entry) => (
            <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.name}</td>
                <td>{entry.website}</td>
                <td>{entry.description}</td>
            </tr>
        ))
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Website</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }, [companyData]);

    return (
        <div>
            {table}
            <Paginator domain="/company" currentPage={currentPage} totalPages={totalPages} perPage={perPage}/>
        </div>
    )
}

export default Company;