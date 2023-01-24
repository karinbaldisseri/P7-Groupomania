import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const useAxiosFetch = (configObj) => {
  const { /* axiosInstance, */ method, url, requestConfig = {} } = configObj;
  const navigate = useNavigate();
  const [response, setResponse] = useState(null); // was []
  const [fetchError, setFetchError] = useState(null); // was ""
  const [loading, setLoading] = useState(true);

  // to retrigger & refetch the data / update the data after changes have been made to database for example
  const [reload, setReload] = useState(0);
  const refetch = () => setReload((prev) => prev + 1);

  useEffect(() => {
    const controller = new AbortController(); // instead of let isMounted = true / false

    const fetchData = async () => {
      try {
        const res = await axios[method.toLowerCase()](url, {
          ...requestConfig,
          signal: controller.signal,
        });
        setResponse(res.data);
        setFetchError(null); // was "" // is necessary in react 18 !!! otherwise will create a "cancelled error"
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
          navigate("/error");
        } else {
          setFetchError(
            "Erreur de chargement et/ou d'envoi des données, veuillez réessayer !"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // useEffect cleanup
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return [response, fetchError, loading, refetch];
};

export default useAxiosFetch;
