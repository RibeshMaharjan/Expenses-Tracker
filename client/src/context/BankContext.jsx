import {createContext, useContext, useState} from "react";
import axios from "axios";
import {toast} from "sonner";

const BankContext = createContext();

export const useBankContent = () =>  useContext(BankContext);

export const BankProvider = ({ children }) => {

  const [banks, setBanks] = useState([]);

  const getBankAccounts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/bankaccount`,
      {
        withCredentials: true,
      }
    );

    const transactionResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/transaction/`,
      {
        withCredentials: true,
      });

    if(response.status !== 200) {
      toast.error(await response.data.message);
    }

    const bankAndTransactions = await response.data.data.map(bank => {
      return {
        ...bank,
        transactions: transactionResponse.data.data.filter(transaction => transaction.bank_account_id == bank.id),
      }
    })
    setBanks(bankAndTransactions);
  }

  const setBankAccounts = ({ banks }) => {
    setBanks(banks);
  }

  const value = {
    banks,
    getBankAccounts,
    setBankAccounts,
  }

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>
}