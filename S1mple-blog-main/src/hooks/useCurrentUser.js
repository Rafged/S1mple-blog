import { useState, useEffect } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (username) {
      setUser({ username, email });
    }
  }, []);

  return user;
}