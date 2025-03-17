import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import BankCard from "../components/mybanks/BankCard.jsx";
import Panel from "../components/panel/Panel.jsx";
import StockTable from "../components/stock/StockTable.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import Loader from "../components/ui/loader.jsx";
import {set} from "react-hook-form";

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getStock = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/stock`,
          {
            withCredentials: true,
          });
        const responseapi = await axios.get(`http://127.0.0.1:5000/today-price`);

        setStocks(response.data.data.filter((stock) =>
        {
          return responseapi.data.data.content.find((stk) => {
            if(stk.symbol === stock.symbol) {
              stock.price = stk.lastUpdatedPrice;
              return true;
            }
            return false;
          })
        }));
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      } finally {
        setLoading(false);
      }
    }
    getStock();
  }, []);


  if(loading) return (
    <div className={`mx-auto`}>
      <Loader />
    </div>
  );

  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            <span>My Stocks</span>
          </MainHeaderContent>
          <SubHeaderContent>
            <p className="text-gray-600">
              Effortlessly manager your stocks.
            </p>
          </SubHeaderContent>
        </PanelHeader>
        <section className="w-full" id="stock-section">
          <div
            className="flex justify-between mb-2"
            id="transaction-section-header"
          >
            <h1 className="text-2xl font-bold">Stocks</h1>
            {/*<Button
              className="border border-1 border-gray-300 rounded-md shadow-sm px-2 py-1 font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3"
              onClick=""
            >
              View All
            </Button>*/}
          </div>
          <StockTable stocks={stocks} />
        </section>
      </Panel>
    </>
  );
};

export default Stock;
