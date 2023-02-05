/* eslint-disable no-nested-ternary */
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    // if memoryleak add isMounted
    // let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        toast.error("Accès invalide, veuillez vous reconnecter svp !");
      } finally {
        /* isMounted && */ setIsLoading(false);
      }
    };
    // eslint-disable-next-line no-unused-expressions
    !auth?.token ? verifyRefreshToken() : setIsLoading(false);

    // return () => isMounted = false; // clean up

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <p>En cours de chargement ...</p>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default PersistLogin;
