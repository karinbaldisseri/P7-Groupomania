import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function RequireAuth() {
  const { auth } = useAuth();
  console.log(auth);
  const location = useLocation();

  return (
    // check if we have a logged in user
    auth.token ? (
      <Outlet /> // represents any child components of RequireAuth component and protect them
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
      // sends the user to the page they initially wanted to go to but needed to sign up / login first
      // sends them to login but we replace the navigation history with the location they came from
    )
  );
}

export default RequireAuth;
