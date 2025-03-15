import {createContext, useContext, useState} from 'react';

const ActiveTabContext = createContext();

export const useActiveTabContext = () => useContext(ActiveTabContext);

export const ActiveTabProvider = ({ children }) => {
  const [tabs, setTabs] = useState(1);

  const toggleTab = (index) => {
    setTabs(index);
  };

  const value = {
    tabs,
    toggleTab,
  }

  return <ActiveTabContext.Provider value={value}>{children}</ActiveTabContext.Provider>
}