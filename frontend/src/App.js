import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllView from './pages/AllView';
import Company from './pages/Company';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact>
        <Home />
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
      <Route path="/posting">
        <AllView domain="/posting" apiDomain="http://127.0.0.1:5000/posting/all" attributes={["id", "title", "description", "location", "link", "due_date", "posted_by"]} />
      </Route>
    </Switch>
  </Router>
);

export default App;
