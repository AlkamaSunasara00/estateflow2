import { createContext, useContext, useState, useEffect } from "react";

const ActiveUserContext = createContext(null);

export const ActiveUserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    return sessionStorage.getItem("activeUserId");
  });

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem("activeUserId", userId);
    } else {
      sessionStorage.removeItem("activeUserId");
    }
  }, [userId]);

  return (
    <ActiveUserContext.Provider value={{ userId, setUserId }}>
      {children}
    </ActiveUserContext.Provider>
  );
};

export const useActiveUser = () => useContext(ActiveUserContext);
