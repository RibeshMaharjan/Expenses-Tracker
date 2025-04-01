import {useStockContent} from "../../context/StockContext.jsx";
import Loader from "../ui/loader.jsx";
import {Pagination} from "@/components/ui/Pagination.jsx";
import {useEffect, useState} from "react";

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
            <th className="py-2 px-4">Symbol</th>
            <th className="px-4">Quantity</th>
            <th className="px-4">Last Updated Price</th>
            <th className="px-4">Total Value</th>
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
              return (
                <tr key={key} className={`text-lg even:bg-gray-100`}>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                      {val.symbol}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                      {val.quantity}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.price || ''}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {(parseFloat(val.price) * parseFloat(val.quantity)) || ''}
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
