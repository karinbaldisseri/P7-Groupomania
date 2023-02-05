import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosPrivate.get("/api/auth/refreshtoken");
    setAuth((prev) => {
      return { ...prev, token: response.data.token };
    });
    return response.data.token;
  };
  return refresh;
};

export default useRefreshToken;
