/* eslint-disable no-param-reassign */
import { useEffect } from "react";
import { toast } from "react-toastify";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (auth.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status } = error.response;
        if (status === 500 || !error?.response) {
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
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth.token]);

  return axiosPrivate;
};

export default useAxiosPrivate;
