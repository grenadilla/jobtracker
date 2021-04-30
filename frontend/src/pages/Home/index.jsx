import logo from './logo.svg';
import styles from './styles.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

const Home = () => (
  <Container>
    <h1>Jobtracker System</h1>
    <p>
      We've created this job and internship application tracking system for students like us.
      Mark the postings you've applied to; add tasks to these applications; and keep up to date with what you need to do.
      It's that easy!
      Check out the calendar for a full list of all your tasks.
    </p>
  </Container>
);

export default Home;
