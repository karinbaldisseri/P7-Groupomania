import { useEffect } from "react";
import { toast } from "react-toastify";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const authToken = auth.token;

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (authToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status /* , data, config */ } = error.response;
        if (status === 500 || !error?.response) {
          toast.error("Erreur interne du serveur");
        } else if (status === 400) {
          //  == error?.response?.status === 400
          toast.error("Erreur de saisie, vérifiez tous les champs requis");
        } else if (status === 401) {
          toast.error("Erreur de saisie et/ou accès non autorisé");
        } else if (status === 403) {
          toast.error(
            "Compte désactivé, merci de contacter votre administrateur"
          );
        } else if (status === 404) {
          toast.error("Erreur 404 - Not found");
        }
        /* else (
          status === 400 &&
          config.method === "get" &&
          // eslint-disable-next-line no-prototype-builtins
          data.errors.hasOwnProperty("id")
        ) {
          toast.error("Autre erreur");
        } */
        return Promise.reject(error);
      }
    );
    // cleanup
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [authToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
