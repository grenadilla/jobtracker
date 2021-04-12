import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllView from './pages/AllView';
import 'bootstrap/dist/css/bootstrap.min.css';
import Application from './pages/Application';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/company">
        <AllView domain="/company" apiDomain="http://127.0.0.1:5000/company/all" attributes={["id", "name", "website", "description"]} /> 
      </Route>
      <Route path="/posting">
        <AllView domain="/posting/all" apiDomain="http://127.0.0.1:5000/posting/all" attributes={["id", "title", "description", "location", "link", "due_date", "posted_by"]} />
      </Route>
      <Route path="/application">
        <Application />
      </Route>
    </Switch>
  </Router>
)

export default App;
