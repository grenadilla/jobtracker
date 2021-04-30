import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Home from './pages/Home';
import AllView from './pages/AllView';
import Company from './pages/Company';
import Posting from './pages/Posting';
import MostApplicants from './pages/MostApplicants';
import User from './pages/User';
import TestAuth from './pages/TestAuth';
import SignUp from './pages/SignUp';
import Applications from './pages/Applications';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Navbar from 'react-bootstrap/Navbar';
import SuggestedPostings from './pages/SuggestedPostings';
import { baseUrl } from './utils/config';

const App = () => (
  <Router>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Job Tracker</Navbar.Brand>
      <div>
        <Link to="/profile" className="navlink">Edit Profile</Link>
        <Link to="/login" className="navlink">Login</Link>
        <Link to="/logout" className="navlink">Logout</Link>
        <Link to="/applications" className="navlink">Applications</Link>
        <Link to="/calendar" className="navlink">Calendar</Link>
        <Link to="/company" className="navlink">Companies</Link>
        <Link to="/posting" className="navlink">Postings</Link>
        <Link to="/most_applicants" className="navlink">Popular Companies</Link>
        <Link to="/suggestions" className="navlink">Suggested Postings</Link>
      </div>
    </Navbar>

    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>

      <AuthenticatedRoute path="/test" exact>
        <TestAuth />
      </AuthenticatedRoute>

      <AuthenticatedRoute path="/login" exact>
        <Login />
      </AuthenticatedRoute>

      <Route path="/logout" exact>
        <Logout />
      </Route>

      <AuthenticatedRoute path="/signup" skipSignupCheck exact>
        <SignUp />
      </AuthenticatedRoute>

      <AuthenticatedRoute path="/profile" exact>
        <SignUp update />
      </AuthenticatedRoute>

      <AuthenticatedRoute path="/applications" exact>
        <Applications loggedIn />
      </AuthenticatedRoute>

      <AuthenticatedRoute path="/suggestions" exact>
        <SuggestedPostings />
      </AuthenticatedRoute>

      <Route path="/applications" exact>
        <Applications />
      </Route>

      <AuthenticatedRoute path="/calendar" exact>
        <Calendar />
      </AuthenticatedRoute>

      <AuthenticatedRoute path="/suggestions" exact>
        <AllView domain="/suggestions" apiDomain={`${baseUrl}/suggestions`} 
          attributes={["id", "title", "description", "location", "link", "due_date", "posted_by", "score"]} />
      </AuthenticatedRoute>

      <Route exact path="/company">
        <AllView domain="/company" apiDomain={`${baseUrl}/company/all`} attributes={["id", "name", "website", "description"]} /> 
      </Route>

      <Route exact path="/company/create">
        <Company create />
      </Route>

      <Route exact path="/company/:id">
        <Company />
      </Route>

      <Route exact path="/company/:id/edit">
        <Company edit />
      </Route>

      <AuthenticatedRoute exact path="/posting/:id">
        <Posting loggedIn/>
      </AuthenticatedRoute>
      <Route exact path="/posting">
        <AllView domain="/posting" apiDomain={`${baseUrl}/posting/all`} attributes={["id", "title", "description", "location", "link", "due_date", "posted_by"]} />
      </Route>
      <Route exact path="/posting/create">
        <Posting create />
      </Route>
      <Route exact path="/posting/:id">
        <Posting />
      </Route>
      <Route exact path="/posting/:id/edit">
        <Posting edit />
      </Route>

      <Route path="/most_applicants">
        <MostApplicants/>
      </Route>

      <Route exact path="/user">
        <AllView domain="/user" apiDomain={`${baseUrl}/user/all`} attributes={["id", "username", "name", "grade", "gpa"]} /> 
      </Route>

      <Route exact path="/user/create">
        <User create />
      </Route>

      <Route exact path="/user/:id">
        <User />
      </Route>

      <Route exact path="/user/edit">
        <User edit />
      </Route>

    </Switch>
  </Router>
);

export default App;
