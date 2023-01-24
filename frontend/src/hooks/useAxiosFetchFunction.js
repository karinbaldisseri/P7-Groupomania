import { useState, useEffect } from "react";
// import axios from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate";

const useAxiosFetchFunction = () => {
  const axiosPrivate = useAxiosPrivate();
  const [response, setResponse] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState();

  const axiosFetch = async (configObj) => {
    const { /* axiosInstance, */ url, method, requestConfig = {} } = configObj;

    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);
      // const res = await axios({
      const res = await axiosPrivate({
        // axiosInstance,
        url,
        method: method.toLowerCase(),
        ...requestConfig,
        signal: ctrl.signal,
      });
      // console.log("RES", res);
      // console.log("RES.DATA", res.data);
      setResponse(res.data);
      setFetchError("");
    } catch (err) {
      if (!err?.response || err.response.status === 500) {
        setFetchError("Erreur interne du serveur");
      } else if (err.response.status === 400) {
        setFetchError("Erreur de saisie, vérifiez tous les champs requis");
      } else if (err.response.status === 401) {
        setFetchError("Erreur de saisie et/ou accès non autorisé");
      } else if (err.response.status === 403) {
        setFetchError(
          "Compte désactivé, merci de contacter votre administrateur"
        );
      } else if (err.response.status === 404) {
        // navigate("/error");
        setFetchError("Erreur 404 - Les données n'ont pas été trouvées"); // and redirect in component ??
      } else {
        setFetchError(
          "Erreur de chargement et/ou d'envoi des données, veuillez réessayer !"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // useEffect cleanup
    return () => controller && controller.abort();
  }, [controller]);

  return [response, fetchError, loading, axiosFetch];
};

export default useAxiosFetchFunction;
