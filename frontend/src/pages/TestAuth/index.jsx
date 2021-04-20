import { useAuth0 } from "@auth0/auth0-react";

const TestAuth = () => {
  const { user, logout } = useAuth0();

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  )
};

export default TestAuth;
