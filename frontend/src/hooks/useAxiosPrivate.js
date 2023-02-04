/* eslint-disable no-param-reassign */
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      const requestIntercept = axiosPrivate.interceptors.request.use(
        (config) => {
          if (!config.headers.Authorization) {
            if (auth.token) {
              config.headers.Authorization = `Bearer ${auth.token}`;
            }
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      const responseIntercept = axiosPrivate.interceptors.response.use(
        (response) => response,
        // in async error handler for example if expired token
        async (error) => {
          // get the previous request in axios
          const prevRequest = error?.config;
          const { status } = error.response;
          if (
            // check if expired token
            error?.response?.data?.error?.message === "jwt expired" &&
            // and check custom property on request = if hasn't been sent to avoid endless loop of this error
            !prevRequest?.sent
          ) {
            prevRequest.sent = true;
            const newToken = await refresh();
            prevRequest.headers.Authorization = `Bearer ${newToken}`;
            // updating the request with new token and making the request again
            return axiosPrivate(prevRequest);
          }
          if (
            status === 401 &&
            error?.response?.data?.message ===
              "Unauthorized Expired RefreshToken !"
          ) {
            navigate("/login", { state: { from: location }, replace: true });
          } else if (status === 500 || !error?.response) {
            // possible d'envoyer un toast depuis intercepteur
            toast.error("Erreur interne du serveur");
          } else if (status === 400) {
            error.response.statusText =
              "Erreur de saisie, vérifiez tous les champs requis";
          } else if (status === 401) {
            error.response.statusText =
              "Erreur de saisie et/ou accès non autorisé";
          } else if (status === 403) {
            error.response.statusText =
              "Compte désactivé, merci de contacter votre administrateur";
          } else if (status === 404) {
            error.response.statusText = "Erreur, données non disponibles";
          } else {
            error.response.statusText = "Erreur... Veuillez réessayer svp !";
          }
          return Promise.reject(error);
        }
      );
      // cleanup
      return () => {
        ignore = true;
        axiosPrivate.interceptors.request.eject(requestIntercept);
        axiosPrivate.interceptors.response.eject(responseIntercept);
      };
    }
  }, [auth.token, location, navigate, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
