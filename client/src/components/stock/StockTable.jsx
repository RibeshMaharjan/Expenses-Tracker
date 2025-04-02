import {useStockContent} from "../../context/StockContext.jsx";
import Loader from "../ui/loader.jsx";
import {Pagination} from "@/components/ui/Pagination.jsx";
import {useEffect, useState} from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StockTable = () => {
  const { loading, stocks } = useStockContent();
  const [currentPage, setCurrentPage] = useState(1);
  const [stockPerPage, setStockPerPage] = useState(10);
  const lastStockIndex = currentPage * stockPerPage;
  const firstStockIndex = lastStockIndex - stockPerPage;
  const currentStocks = stocks.slice(firstStockIndex, lastStockIndex);

  if(loading) return (
    <div className={`mx-auto`}>
      <Loader />
    </div>
  );

  return (
    <div className="" id="table-container">
      <table className="w-full text-lg rounded-md">
        <thead className="bg-gray-100 text-left text-gray-600 border-b-2">
          <tr>
            <th className="py-2 px-4">Scrip</th>
            <th className="px-4">Current Balance</th>
            <th className="px-4">Previous Closing Price</th>
            <th className="px-4">Value as of Previous Closing</th>
            <th className="px-4">Last Transaction Price(LTP)</th>
            <th className="px-4">Value as of LTP</th>
          </tr>
        </thead>
        <tbody className="">
        {
          stocks?.length <= 0 ? (
            <tr className='text-lg bg-gray-300'>
              <td colSpan={4} className={`text-center px-2 py-4 min-w-24 font-semibold tracking-tight`}>
                <span>No Transaction</span>
              </td>
            </tr>
          ) : (
            currentStocks?.map((val, key) => {
              const isProfit = (parseFloat(val.closePrice) * parseFloat(val.quantity) <= parseFloat(val.price) * parseFloat(val.quantity));
              return (
                <tr
                  key={key}
                  className={`
                    text-lg
                    ${isProfit ? "bg-green-50" : "bg-red-50"}
                  `}
                >
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                      {val.symbol}
                  </td>
                  <td className="px-4 py-3 min-w-24 font-semibold tracking-tight">
                      {val.quantity}
                  </td>
                  <td className="px-4 py-3 min-w-24 font-semibold tracking-tight">
                    {val.closePrice}
                  </td>
                  <td className="px-4 py-3 min-w-24 font-semibold tracking-tight">
                    {
                      new Intl.NumberFormat("en-IN").format(
                        parseFloat(val.closePrice) * parseFloat(val.quantity),
                      )
                    }
                  </td>
                  <td className="px-4 py-3 min-w-24 font-semibold tracking-tight">
                    {val.price}
                  </td>
                  <td className={`px-4 py-3 min-w-24 font-bold tracking-tight ${isProfit ? "text-green-600" : "text-red-600"}`}>
                    {
                      new Intl.NumberFormat("en-IN").format(
                        parseFloat(val.price) * parseFloat(val.quantity)
                      )
                    }
                    {isProfit ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  </td>
                </tr>
              );
            })
          )
        }
        </tbody>
      </table>
      {
        (stocks.length >= stockPerPage) &&
        <Pagination
          totalItems={stocks.length}
          itemPerPage={stockPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      }
    </div>
  );
};

export default StockTable;
