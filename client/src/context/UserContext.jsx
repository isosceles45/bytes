import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/confirm")
      .then((response) => {
        setId(response.data.userId);
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error(`Request failed with status: ${error.status}`);
      });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
