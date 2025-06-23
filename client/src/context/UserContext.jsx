import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const addUser = (userInfo) => {
    const info = {
      ...userInfo,
      initials: userInfo.name.split(' ').map(init => init[0]).join(''),
    }
    setUser(info);
    localStorage.setItem('user', JSON.stringify(info));
  };

  const removeUser = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      return true;
    } catch (error) {
      console.error("Error logging out user:", error);
      return false;
    }
  };

  const value = {
    user,
    addUser,
    removeUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
