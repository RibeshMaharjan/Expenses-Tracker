import {createContext, useContext, useState} from "react";
import axios from "axios";
import {toast} from "sonner";

const StockContext = createContext();

export const useStockContent = () =>  useContext(StockContext);

export const StockProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);

  const getStockAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/stock`,
        {
          withCredentials: true,
        }
      );

      const responseapi = await axios.get(`http://127.0.0.1:5000/today-price`);

      const updatedStocks = response.data.data.filter((stock) =>
      {
        return responseapi.data.data.content.find((stk) => {
          if(stk.symbol === stock.symbol) {
            stock.price = stk.lastUpdatedPrice;
            return true;
          }
          return false;
        })
      });
      setStocks(updatedStocks);
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const getStockTransactions = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/stocktransaction`, {
        withCredentials: true,
      });

      if(response.status !== 200) {
        toast.error(await response.data.message);
      }
      setStockTransactions(response.data.data);
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const updateStocks = ({ stocks }) => {
    setStocks(stocks);
  }

  const value = {
    loading,
    stocks,
    getStockAccounts,
    updateStocks,
    stockTransactions,
    getStockTransactions,
  }

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}