import { useState, useCallback, useEffect } from "react";
import { useRef } from "react";

const useHttp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const abortCrtl = new AbortController();
      activeHttpRequest.current.push(abortCrtl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: abortCrtl.signal,
        });
        const data = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (req) => req !== abortCrtl
        );

        if (!response.ok) {
          throw new Error(data.message);
        }
        setIsLoading(false);
        return data;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  const clearError = () => {
    setError(false);
  };

  return { isLoading, error, sendRequest, clearError };
};
export default useHttp;
