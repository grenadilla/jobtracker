import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router"

const Logout = () => {
  const history = useHistory();
  const { isAuthenticated, logout } = useAuth0();

  if (isAuthenticated) {
    logout();
  } else {
    history.push('/');
  }

  return null;
}

export default Logout;
