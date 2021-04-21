import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

const TestAuth = () => {
  const { user, logout } = useAuth0();

  console.log(user);

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <Button onClick={() => logout()}>Log Out</Button>
    </div>
  )
};

export default TestAuth;
