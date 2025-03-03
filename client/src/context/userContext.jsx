import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);

  const addUser = (userInfo) => {
    setUser(userInfo);
  };

  const removeUser = () => {
    setUser(null);
  };

  const value = {
    user,
    addUser,
    removeUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
