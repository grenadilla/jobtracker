import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>

      <AuthenticatedRoute path="/test" exact>
        <TestAuth />
      </AuthenticatedRoute>

      <AuthenticatedRoute path="/signup" skipSignupCheck exact>
        <SignUp />
      </AuthenticatedRoute>

      <Route path="/applications" exact>
        <Applications />
      </Route>

      <Route path="/calendar" exact>
        <Calendar />
      </Route>

      <Route exact path="/company">
        <AllView domain="/company" apiDomain="http://127.0.0.1:5000/company/all" attributes={["id", "name", "website", "description"]} /> 
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

      <Route exact path="/posting">
        <AllView domain="/posting" apiDomain="http://127.0.0.1:5000/posting/all" attributes={["id", "title", "description", "location", "link", "due_date", "posted_by"]} />
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
        <AllView domain="/user" apiDomain="http://127.0.0.1:5000/user/all" attributes={["id", "username", "name", "grade", "gpa"]} /> 
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
