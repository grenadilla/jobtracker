import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Company = ({edit = false, create = false}) => {
    const { id } = useParams();
    const [companyData, setCompanyData] = useState(null);
    const [formName, setFormName] = useState("");
    const [formWebsite, setFormWebsite] = useState("");
    const [formDescription, setFormDescription] = useState("");

    const history = useHistory();

    useEffect(() => {
        const apiDomain = `http://127.0.0.1:5000/company/${id}`
        const url = new URL(apiDomain);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCompanyData(data);
                setFormName(data.name);
                setFormWebsite(data.website);
                setFormDescription(data.description);
            })
            .catch((err) => console.log(err));
    }, [edit, create, id]);

    const submittable = formName && formWebsite && formDescription;

    function apiEdit() {
        const data = {
            id,
            name: formName,
            website: formWebsite,
            description: formDescription
        }

        const url = "http://127.0.0.1:5000/company/edit";
        fetch(url, { method: 'post', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then(() => history.push(`/company/${id}`));

    }

    let page = "Loading...";
    if (companyData) {
        if (edit) {
            page = (
                <>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={formName} onChange={(e) => setFormName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Website</Form.Label>
                        <Form.Control type="text" value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                    </Form.Group>
                </Form>
                <div>
                    <Button variant="success" disabled={!submittable} onClick={() => apiEdit()}> Submit</Button>
                    <Button variant="warning" onClick={() => history.push(`/company/${id}`)}>Cancel</Button>
                </div>
                </>
            );
        } else {
            page = (
                <>
                    <h1>ID: {companyData.id}</h1>
                    <h1>Name: {companyData.name}</h1>
                    <div>
                        <Link to={`/company/${id}/edit`}>Edit</Link>
                    </div>
                    <p>{companyData.description}</p>
                </>
            )
        }
    }

    return <Container>{page}</Container>
}

export default Company;