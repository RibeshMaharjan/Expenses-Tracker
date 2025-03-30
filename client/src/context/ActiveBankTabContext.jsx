import {createContext, useContext, useState} from 'react';

const ActiveBankContext = createContext();

export const useActiveBankContext = () => useContext(ActiveBankContext);

export const BankActiveTabProvider = ({ children }) => {
  const [activeBank, setActiveBank] = useState(0);

  const toggleBankTab = (index) => {
    setActiveBank(index);
  };

  const value = {
    activeBank,
    toggleBankTab,
  }

  return <ActiveBankContext.Provider value={value}>{children}</ActiveBankContext.Provider>
}