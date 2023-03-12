import { useEffect, useState, useCallback } from "react";

export const SESSION_STORAGE_KEY = "AUTH_USER";

export const useSessionStorage = () => {
  const [sessionStorage, setSessionStorage] = useState(getSessionStorage());

  const addSessionStorage = useCallback((item: string) => {
    setSessionStorage(item);
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, item);
  }, []);

  return { sessionStorage, setSessionStorage: addSessionStorage };
};

const getSessionStorage = () => {
  const sessionStorageValue =
    window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionStorageValue) {
    return undefined;
  }

  return sessionStorageValue;
};
