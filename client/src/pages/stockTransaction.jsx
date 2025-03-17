import {useEffect, useState} from "react";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";
import axios from "axios";
import {toast} from "sonner";
import StockTransactionTable from "../components/stockTransaction/StockTransactionTable.jsx";

const StockTransaction = () => {
  const [stockTransactions, setStockTransactions] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getStockTransactions = async () => {
      try {
        // setLoading(true);

        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/stocktransaction`, {
          withCredentials: true,
        });

        setStockTransactions(response.data.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        // setLoading(false);
      }
    }
      getStockTransactions();
  }, []);

  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            <span>Stock Transaction History</span>
          </MainHeaderContent>
          <SubHeaderContent>
            <p className="text-gray-600">
              Gain insight of your stocks transaction log.
            </p>
          </SubHeaderContent>
        </PanelHeader>
        <section className="w-full" id="transaction-table-section">
          <div
            className="flex justify-between mb-2"
            id="transaction-table-section-header"
          >
            <h1 className="text-2xl font-bold">Transactions</h1>
            {/*<Button
              className="border border-1 border-gray-300 rounded-md shadow-sm px-2 py-1 font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3"
              onClick=""
            >
              View All
            </Button>*/}
          </div>
          <StockTransactionTable stockTransactions={stockTransactions} />
        </section>
      </Panel>
    </>
  );
};

export default StockTransaction;
