import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Paginator from '../../utils/pagination';

const AllView = ({domain, apiDomain, attributes}) => {
    const query = new URLSearchParams(useLocation().search);
    const currentPage = parseInt(query.get("page")) || 1;
    const perPage = parseInt(query.get("per_page")) || 25;
    const [totalPages, setTotalPages] = useState(1);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const url = new URL(apiDomain);
        const params = { page: currentPage, per_page: perPage };
        url.search = new URLSearchParams(params).toString();
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setTableData(data.payload); 
                setTotalPages(data.total_pages)
            })
            .catch((err) => console.log(err));
    }, [currentPage, perPage, apiDomain]);

    const table = useMemo(() => {
        const rows = tableData.map((entry) => {
            const cells = attributes.map((attribute) => (
                <td key={attribute}>{entry[attribute]}</td>
            ))
            return (<tr key={entry.id}>
                {cells}
            </tr>);
        })
        const thCells = attributes.map((attribute) => (
            <th key={attribute}>{attribute}</th>
        ));
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {thCells}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }, [tableData, attributes]);

    return (
        <Container style={{marginTop: "1rem"}}>
            <Paginator span={3} domain={domain} currentPage={currentPage} totalPages={totalPages} perPage={perPage}/>
            {table}
            <Paginator span={3} domain={domain} currentPage={currentPage} totalPages={totalPages} perPage={perPage}/>
        </Container>
    )
}

export default AllView;