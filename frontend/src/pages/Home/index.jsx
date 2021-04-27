import logo from './logo.svg';
import styles from './styles.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

const Home = () => (
  <Container>
    <h1>Jobtracker System - Still Under Construction</h1>
    <p>
      Hey there! We've got some basic functionality working for the midterm demo.
      Just make sure you have the backend running.
      Click on some of the links below to get to some CRUD operations.
    </p>
    <Row>
      <Link to="/company">Company</Link>
    </Row>
    <Row>
      <Link to="/posting">Posting</Link>
    </Row>
    <Row>
      <Link to="/most_applicants">Jeffrey's Advanced Query</Link>
    </Row>
    <Row>
      <Link to="/profile">Edit Profile</Link>
    </Row>
    <Row>
      <Link to="/login">Login</Link>
    </Row>
    <Row>
      <Link to="/logout">Logout</Link>
    </Row>
  </Container>
);

export default Home;
