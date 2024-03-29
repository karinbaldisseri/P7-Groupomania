import { createContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // wrap object passed in value in a useMemo in order to avoid unnecessary rerenders
  const values = useMemo(
    () => ({
      auth,
      setAuth,
      persist,
      setPersist,
    }),
    [auth, persist]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
  // children = the components nested inside the AuthProvider in app.jsx
}

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthContext;
