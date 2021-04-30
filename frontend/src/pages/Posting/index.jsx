import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../utils/config';
import dateConvert from '../../utils/dateConvert';
import { request } from '../../utils/api';

const Posting = ({edit = false, create = false, loggedIn = false}) => {
    const { id } = useParams();
    const [postingData, setPostingData] = useState(null);
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formLink, setFormLink] = useState("");
    const [formDueDate, setFormDueDate] = useState("");
    const [formPostedBy, setFormPostedBy] = useState(0);

    const [applying, setApplying] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (!create) {
            const apiDomain = `${baseUrl}/posting/${id}`
            const url = new URL(apiDomain);
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setPostingData(data);
                    setFormTitle(data.title);
                    setFormDescription(data.description);
                    setFormLocation(data.location);
                    setFormLink(data.link);
                    setFormDueDate(data.due_date);
                    setFormPostedBy({ value: data.posted_by, label: data.company });
                })
                .catch((err) => console.log(err));
        }
    }, [edit, create, id]);

    const submittable = formTitle && formLink && formDescription && formLocation && formDueDate && formPostedBy;

    function apiEdit(create) {
        const data = {
            id,
            title: formTitle,
            description: formDescription,
            location: formLocation,
            link: formLink,
            due_date: dateConvert(new Date(formDueDate)),
            posted_by: formPostedBy["value"]
        }

        const url = create ? `${baseUrl}/posting/create` : `${baseUrl}/posting/edit`;
        const redirect = create ? '/posting' : `/posting/${id}`;
        fetch(url, { method: 'post', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then(() => history.push(redirect));
    }

    function apiDelete() {
        const url = `${baseUrl}/posting/delete`;
        const redirect = '/posting';
        fetch(url, { method: 'post', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id})
        }).then(() => history.push(redirect));
    }

    let page = "Loading...";

    if (postingData && !edit) {
        page = (
            <>
                <h1>ID: {postingData.id}</h1>
                <h1>{postingData.title}</h1>
                <h2>{postingData.company}</h2>
                <div>
                    <Link to={`/posting/${id}/edit`} style={{marginRight: 10}}>Edit</Link>
                    <Link to={`/posting/${id}/delete`} onClick={() => apiDelete()}>Delete</Link>
                </div>

                <div>
                    <h2>Description</h2>
                    <p>{postingData.description}</p>
                </div>
                <div>
                    <h2>Location</h2>
                    <p>{postingData.location}</p>
                </div>
                <div>
                    <h2>Link</h2>
                    <a href={`//${postingData.link}`}>{postingData.link}</a>
                </div>
                <div>
                    <h2>Due Date</h2>
                    <p>{postingData.due_date}</p>
                </div>
            </>
        )
    } else if (edit || create) {
        const promiseOptions = (inputValue) => fetch(`${baseUrl}/company/ids?search=${inputValue}`).then(data => data.json());
        page = (
            <>
                <Form>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Link</Form.Label>
                        <Form.Control type="text" value={formLink} onChange={(e) => setFormLink(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="text" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Posted By</Form.Label>
                        <AsyncSelect defaultOptions loadOptions={promiseOptions} value={formPostedBy} onChange={(value) => setFormPostedBy(value)}/>                    
                    </Form.Group>
                </Form>
                <div>
                    <Button variant="success" disabled={!submittable} onClick={() => apiEdit(create)}> Submit</Button>
                    <Button variant="warning" onClick={() => history.push(`/posting/${id}`)}>Cancel</Button>
                </div>
            </>
        );
    }

    const [portal, setPortal] = useState("");

    function apply(applying = true) {
        setApplying(false);
        const status = applying ? "APPLIED" : "INTERESTED";
        request("POST", `/posting/apply`, {
            posting_id: id,
            portal,
            status
        });
    }

    return (
        <Container>
            {page}
            <Button onClick={() => setApplying(true)}>Apply</Button>
            <Modal show={applying} onHide={() => setApplying(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Apply To This Posting</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Portal</Form.Label>
                            <Form.Control type="text" value={portal} onChange={(e) => setPortal(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setApplying(false)}>Close</Button>
                    <Button variant="primary" onClick={() => apply(true)}>Apply</Button>
                    <Button variant="info" onClick={() => apply(false)}>Mark Interest</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Posting;