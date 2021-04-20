import { useAuth0 } from "@auth0/auth0-react";
import { Route, useLocation } from "react-router-dom";

const AuthenticatedRoute = ({ path, ...props}) => {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if(!isAuthenticated) {
    loginWithRedirect({ appState: { redirectUrl: pathname } });
  }

  return <Route path={path} {...props} />;
};

export default AuthenticatedRoute;
