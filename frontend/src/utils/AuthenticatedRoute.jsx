import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Route, useLocation, useHistory } from "react-router-dom";
import { setAuthToken, isUserAlreadySignedUp } from "./api";

const AuthenticatedRoute = ({ path, skipSignupCheck, ...props}) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [tokenLoaded, setTokenLoaded] = useState(false);


  useEffect(() => {
    if (!isLoading && isAuthenticated && !tokenLoaded) {
      const authenticate = async () => {
        const token = await getAccessTokenSilently({ audience: 'cs411-jobtracker-api' });
        setAuthToken(token);

        const isUserNew = user['https://cs411-jobtracker/isNew'];
        if (!skipSignupCheck && isUserNew) {
          try {
            const alreadySignedUp = await isUserAlreadySignedUp();
            if (!alreadySignedUp) {
              history.push(`/signup?redirect_to=${pathname}`);
            }
          } catch (err) {
            alert(`Failed to check sign up status.\n\nError: ${err.message}`);
            history.push('/');
          }
        }

        setTokenLoaded(true);
      }
      authenticate();
    }
  }, [isAuthenticated, isLoading, tokenLoaded, getAccessTokenSilently, skipSignupCheck]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    loginWithRedirect({ appState: { redirectUrl: pathname } });
  }

  if (!tokenLoaded) {
    return <p>Loading...</p>;
  }

  return <Route path={path} {...props} />;
};

export default AuthenticatedRoute;
