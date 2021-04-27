import { useHistory } from "react-router";

// Login is a dummy component that just redirects back home
// It's meant to be used with AuthenticatedRoute for actual login functionality
const Login = () => {
  const history = useHistory();
  history.push('/');
  return null;
};

export default Login;