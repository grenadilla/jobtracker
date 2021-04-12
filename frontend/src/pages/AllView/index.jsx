import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Paginator from '../../utils/pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AllView = ({domain, apiDomain, attributes}) => {
    const query = new URLSearchParams(useLocation().search);
    const currentPage = parseInt(query.get("page")) || 1;
    const perPage = parseInt(query.get("per_page")) || 25;
    const search = query.get("search") || "";
    const [totalPages, setTotalPages] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [formSearch, setFormSearch] = useState("");

    const history = useHistory();

    useEffect(() => {
        const url = new URL(apiDomain);
        const params = { page: currentPage, per_page: perPage, search };
        url.search = new URLSearchParams(params).toString();
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setTableData(data.payload); 
                setTotalPages(data.total_pages)
            })
            .catch((err) => console.log(err));
    }, [currentPage, perPage, apiDomain, search]);

    const table = useMemo(() => {
        const rows = tableData.map((entry) => {
            const cells = attributes.map((attribute) => (
                <td key={attribute}>{entry[attribute]}</td>
            ))
            return (
                <tr key={entry.id} style={{cursor: "pointer"}} onClick={() => history.push(`${domain}/${entry.id}`)}>
                    {cells}
                </tr>
            );
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
    }, [tableData, attributes, history, domain]);

    return (
        <Container style={{marginTop: "1rem"}}>
            <Paginator span={3} domain={domain} search={search} currentPage={currentPage} totalPages={totalPages} perPage={perPage}/>
            <Link to={`${domain}/create`}>Create</Link>
            <div>
                <Form.Control type="text" value={formSearch} onChange={(e) => setFormSearch(e.target.value)}/>
                <Button variant="primary" onClick={() => history.push(`${domain}/?search=${formSearch}`)}>Search</Button>
            </div>
            {table}
            <Paginator span={3} domain={domain} search={search} currentPage={currentPage} totalPages={totalPages} perPage={perPage}/>
        </Container>
    )
}

export default AllView;