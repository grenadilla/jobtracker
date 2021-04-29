import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { baseUrl } from '../../utils/config';

const User = ({edit = false, create = false}) => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [formUsername, setFormUsername] = useState("");
	const [formPassword, setFormPassword] = useState("");
	const [formName, setFormName] = useState("");
	const [formGrade, setFormGrade] = useState("");
	const [formGPA, setFormGPA] = useState("");

    const history = useHistory();

    useEffect(() => {
        if (!create) {
            const apiDomain = `${baseUrl}/user/${id}`
            const url = new URL(apiDomain);
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setFormUsername(data.username);
					setFormPassword(data.password);
					setFormName(data.name);
					setFormGrade(data.grade);
					setFormGPA(data.gpa);
                })
                .catch((err) => console.log(err));
        }
    }, [edit, create, id]);

    const submittable = formName && formName && formGrade;

    function apiEdit(create) {
        const data = {
            id,
            name: formName,
            username: formUsername,
            password: formPassword,
			name: formName,
            grade: formGrade,
            gpa: formGPA
        }

        const url = create ? `${baseUrl}/user/create` : `${baseUrl}/user/edit`;
        const redirect = create ? '/user' : `/user/${id}`;
        fetch(url, { method: 'post', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then(() => history.push(redirect));
    }

    function apiDelete() {
        const url = `${baseUrl}/user/delete`;
        const redirect = '/user';
        fetch(url, { method: 'post', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({id})
        }).then(() => history.push(redirect));
    }

    let page = "Loading...";
    if (userData) {
        if (edit) {
            page = (
                <>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={formUsername} onChange={(e) => setFormUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control as="textarea" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />
                    </Form.Group>
					<Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={formName} onChange={(e) => setFormName(e.target.value)}/>
                    </Form.Group>
					<Form.Group>
                        <Form.Label>Grade</Form.Label>
                        <Form.Control type="text" value={formGrade} onChange={(e) => setFormGrade(e.target.value)}/>
                    </Form.Group>
					<Form.Group>
                        <Form.Label>GPA</Form.Label>
                        <Form.Control type="text" value={formGPA} onChange={(e) => setFormGPA(e.target.value)}/>
                    </Form.Group>
                </Form>
                <div>
                    <Button variant="success" disabled={!submittable} onClick={() => apiEdit(false)}> Submit</Button>
                    <Button variant="warning" onClick={() => history.push(`/user/${id}`)}>Cancel</Button>
                </div>
                </>
            );
        } else {
            page = (
                <>
                    <h1>ID: {userData.id}</h1>
                    <h1>Name: {userData.name}</h1>
                    <div>
                        <Link to={`/user/${id}/edit`} style={{marginRight: 10}}>Edit</Link>
                        <Link to={`/user/${id}/delete`} onClick={() => apiDelete()}>Delete</Link>
                    </div>
                    <p>{userData.grade}</p>
                </>
            )
        }
    } else if (create) {
        page = (
            <>
            <Form>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={formUsername} onChange={(e) => setFormUsername(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" value={formPassword} onChange={(e) => setFormPassword(e.target.value)}/>
                </Form.Group> 
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control as="textarea" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </Form.Group>
				<Form.Group>
                    <Form.Label>Grade</Form.Label>
                    <Form.Control as="textarea" value={formGrade} onChange={(e) => setFormGrade(e.target.value)} />
                </Form.Group>
				<Form.Group>
                    <Form.Label>GPA</Form.Label>
                    <Form.Control as="textarea" value={formGPA} onChange={(e) => setFormGPA(e.target.value)} />
                </Form.Group>
            </Form>
            <div>
                <Button variant="success" disabled={!submittable} onClick={() => apiEdit(true)}> Submit</Button>
                <Button variant="warning" onClick={() => history.push(`/user`)}>Cancel</Button>
            </div>
            </>
        );
    }

    return <Container>{page}</Container>
}

export default User;