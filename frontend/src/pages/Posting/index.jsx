import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { baseUrl } from '../../utils/config';
import dateConvert from '../../utils/dateConvert';

const Posting = ({edit = false, create = false}) => {
    const { id } = useParams();
    const [postingData, setPostingData] = useState(null);
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formLink, setFormLink] = useState("");
    const [formDueDate, setFormDueDate] = useState("");
    const [formPostedBy, setFormPostedBy] = useState(0);

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
                    setFormPostedBy(data.posted_by);
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

    console.log(formPostedBy);

    let page = "Loading...";
    if (postingData) {
        if (edit) {
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
                    <Button variant="success" disabled={!submittable} onClick={() => apiEdit(false)}> Submit</Button>
                    <Button variant="warning" onClick={() => history.push(`/posting/${id}`)}>Cancel</Button>
                </div>
                </>
            );
        } else {
            page = (
                <>
                    <h1>ID: {postingData.id}</h1>
                    <h1>Title: {postingData.title}</h1>
                    <div>
                        <Link to={`/posting/${id}/edit`} style={{marginRight: 10}}>Edit</Link>
                        <Link to={`/posting/${id}/delete`} onClick={() => apiDelete()}>Delete</Link>
                    </div>
                    <p>{postingData.description}</p>
                    <h2>Location: {postingData.location}</h2>
                    <h2>Link: {postingData.link}</h2>
                    <h2>Due Date: {postingData.due_date}</h2>
                    <h2>Posted By: {postingData.posted_by}</h2>
                </>
            )
        }
    } else if (create) {
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
                    <Button variant="success" disabled={!submittable} onClick={() => apiEdit(true)}> Submit</Button>
                    <Button variant="warning" onClick={() => history.push(`/posting/${id}`)}>Cancel</Button>
                </div>
            </>
        );
    }

    return <Container>{page}</Container>
}

export default Posting;