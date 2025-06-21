import {createContext, useContext, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import {Navigate} from "react-router-dom";
import {useUserContext} from "@/context/UserContext.jsx";

/*
* Context for Bank Accounts and Transactions
* Has State for Banks(with their respective transactions) & Transactions(contains all the transaction)
* has Function for retrieving banks and transactions
*/
const BankContext = createContext();

export const useBankContent = () =>  useContext(BankContext);

export const BankProvider = ({ children }) => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [bankTransaction, setBankTransaction] = useState([]);
  const [bankError, setBankError] = useState([]);

  const delay = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    })
  }

  const getBankAccountsAndTransactions = async () => {
    setLoading(true);
    setBankError([]);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/bankaccount`,
        {
          withCredentials: true,
        }
      );

      await delay();

      const transactionResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/transaction/`,
        {
          withCredentials: true,
        }
      );

      if(transactionResponse?.status !== 200) {
        toast.error(response?.data.message);
      }
      
      if(transactionResponse?.status === 204) {
        setBankTransaction([]);
      } else {
        setBankTransaction(transactionResponse?.data?.data);
      }

      if(response?.status !== 200) {
        toast.error(response?.data.message);
      }
      
      const bankAndTransactions = response?.data?.data?.map(bank => {
        return {
          ...bank,
          initials: bank?.bank_name.split(' ').map(init => init[0]).join(''),
          transactions: transactionResponse?.data?.data?.filter(transaction => transaction.bank_account_id == bank.id),
        }
      })

      setBanks(bankAndTransactions);
    } catch (error) {
      if(error.status === 401) {
        const refreshToken = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/token`,
          {
            "id": user.id
          },
          {
            withCredentials: true,
          });
        if(refreshToken.status !== 200) return (
          <Navigate to="sign-in" />
        );
      }
      console.log(error);
      toast.error(error.response.data.message);
      setBankError([
        {
          status: error.status,
          message: error.response.data.message,
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

   const setBankAccounts = ({ banks }) => {
    setBanks(banks);
    console.log(banks);
  }

  const value = {
    loading,
    bankError,
    banks,
    bankTransaction,
    setBankAccounts,
    getBankAccountsAndTransactions,
  }

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>
}