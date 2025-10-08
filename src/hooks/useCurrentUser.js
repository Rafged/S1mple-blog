import { useState, useEffect } from "react";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const savedToken = localStorage.getItem("token");

    if (username) {
      setCurrentUser({ username, email });
    }
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return { currentUser, token };
}