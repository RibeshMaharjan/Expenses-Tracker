import {createContext, useContext, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import {Navigate, useNavigate} from "react-router-dom";
import {useUserContext} from "@/context/UserContext.jsx";

const StockContext = createContext();

export const useStockContent = () =>  useContext(StockContext);

export const StockProvider = ({ children }) => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);
  const [stockError, setStockError] = useState([]);

  const getStockAccountsAndTransactions = async () => {
    setLoading(true);
    setStockError([]);
    try {
      const response = await axios.get(`/api/stock`,
        {
          withCredentials: true,
        }
      );
      
      // if(response.data.data.length == 0) {
      //   return false;
      // }

      const responseapi = await axios.get(`http://127.0.0.1:5000/today-price`);

      const transactionResponse = await axios.get(`/api/stocktransaction`, {
        withCredentials: true,
      });

      const updatedStocks = response?.data?.data?.filter((stock) =>
      {
        return responseapi.data.data.content.find((stk) => {
          if(stk.symbol === stock.symbol) {
            stock.price = stk.lastUpdatedPrice;
            stock.openPrice = stk.openPrice;
            stock.closePrice = stk.previousDayClosePrice;
            return true;
          }
          return false;
        })
      });
      setStockTransactions(transactionResponse.data.data);
      setStocks(updatedStocks);
    } catch (error) {
      console.log(error);
      if(error.status === 401) {
        setLoading(true);
        const refrehToken = await axios.post(
          `/api/auth/token`,
          {
            "id": user.id
          },
          {
            withCredentials: true,
          });
        if(refrehToken.status !== 200) return (
          <Navigate to="sign-in" />
        );
      }
      setStockError([
        {
          status: error?.status,
          message: error?.response?.data?.message,
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const updateStocks = ({ stocks }) => {
    setStocks(stocks);
  }

  const value = {
    loading,
    stockError,
    stocks,
    stockTransactions,
    updateStocks,
    getStockAccountsAndTransactions,
  }

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}