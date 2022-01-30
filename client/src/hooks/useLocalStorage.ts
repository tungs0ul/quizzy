import { useState, useEffect } from "react";

const PREFIX = "quizzy-";

export default function useLocalStorage(key: String, initialValue: any) {
  const prefixedKey = `${PREFIX}${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
  }, [storedValue, prefixedKey]);

  return [storedValue, setStoredValue];
}
