import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const useMe = () => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/me")
      .then(res => setMe(res.data.user))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return { me, loading };
};

export default useMe;
