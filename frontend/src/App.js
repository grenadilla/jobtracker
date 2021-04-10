import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Company from './pages/Company';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/company">
        <Company />
      </Route>
    </Switch>
  </Router>
)

export default App;
