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
      setResponse(res.data);
      setFetchError("");
      return res;
    } catch (err) {
      if (!err?.response || err.response.status === 500) {
        setFetchError("Erreur interne du serveur");
      }
      setFetchError(err.response.statusText);
      return err;
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
