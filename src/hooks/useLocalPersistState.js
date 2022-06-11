import { useState, useEffect } from "react";

const useLocalPersistState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const persistValue = window.localStorage.getItem(key);
    return persistValue !== null ? JSON.parse(persistValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalPersistState;
