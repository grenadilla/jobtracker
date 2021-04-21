import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Card, Col, Container, Form, Row, Button} from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { createUser } from "../../utils/api";

import styles from './styles.module.scss'

const SignUp = () => {
  const { user } = useAuth0();
  const [gpa, setGPA] = useState(0);
  const [grade, setGrade] = useState(0);
  const { search } = useLocation();
  const history = useHistory();

  const params = new URLSearchParams(search);
  const redirectTo = params.get('redirect_to') || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser({ email: user.email, name: user.name, grade, gpa })
      .then(() => history.push(redirectTo))
      .catch(err => {
        alert('Failed to sign up\n\nError: ' + err.message);
        history.push('/');
      });
  }
  
  return (
    <Container className={styles.signup}>
      <Row className={styles.row}>
        <Col />

        <Col sm="6">
          <Card>
            <Card.Body>
              <h3 className={styles.title}>Sign Up</h3>
              <Form action="" onSubmit={handleSubmit}>
                <Form.Group controlId="signupGPA">
                  <Form.Label>GPA</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="4"
                    step=".1"
                    placeholder="Enter GPA"
                    value={gpa}
                    onChange={(e) => setGPA(Number(e.target.value))}
                  />
                </Form.Group>

                <Form.Group controlId="signupGrade">
                  <Form.Label>Grade</Form.Label>
                  <Form.Control as="select" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                    <option value={0}>Freshman</option>
                    <option value={1}>Sophomore</option>
                    <option value={2}>Junior</option>
                    <option value={3}>Senior</option>
                  </Form.Control>
                </Form.Group>

                <Button type="submit" block>Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col />
      </Row>
    </Container>
  )
};

export default SignUp;
