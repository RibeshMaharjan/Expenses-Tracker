import {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../ui/loader.jsx";
import {toast} from "sonner";
import {useStockContent} from "../../context/StockContext.jsx";
import {formatDateTime} from "@/libs/utils.jsx";
import {Pagination} from "@/components/ui/Pagination.jsx";

const StockTransactionTable = () => {
  const { loading, stockTransactions } = useStockContent();
  const [currentPage, setCurrentPage] = useState(1);
  const [stockTransactionPerPage, setStockTransactionPerPage] = useState(10);
  const lastStockIndex = currentPage * stockTransactionPerPage;
  const firstStockIndex = lastStockIndex - stockTransactionPerPage;
  const currentStockTransactions = stockTransactions.slice(firstStockIndex, lastStockIndex);

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
          {/*<th className="px-4">Price</th>*/}
          <th className="px-4">Total Amount</th>
          <th className="px-4">Transaction Type</th>
          <th className="px-4">Broker Account No</th>
          <th className="px-4">Bank Name</th>
          <th className="px-4">Transaction Date</th>
        </tr>
        </thead>
        <tbody className="">
        {
          stockTransactions.length <= 0 ? (
            <tr className='text-lg bg-gray-300'>
              <td colSpan={4} className={`text-center px-2 py-4 min-w-24 font-semibold tracking-tight`}>
                <span>No Transaction</span>
              </td>
            </tr>
          ) : (
            currentStockTransactions.map((val, key) => {
              return (
                <tr key={key} className={`text-lg ${
                  val.transaction_type === "sell" ? "bg-green-50" : "bg-red-50"
                }`}>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                      {val.symbol}
                  </td>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                      {val.quantity}
                  </td>
                  {/*<td className={`px-4 py-4 min-w-24 font-bold tracking-tighter`}>
                    {val.stock_price}
                  </td>*/}
                  <td className={`px-4 py-4 min-w-24 font-bold tracking-tighter ${
                    val.transaction_type === "sell" ? "text-green-700" : "text-red-700"
                  }`}>
                    <span className="me-1 font-extrabold text-lg">
                      {val.transaction_type === "sell" ? "+" : "-"}
                    </span>
                    {val.transaction_amount}
                  </td>
                  <td className="px-4 py-4 min-w-24 font-bold uppercase">
                    {val.transaction_type}
                  </td>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                    {val.brokerage_account_no}
                  </td>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                    {val.bank_name}
                  </td>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                    {formatDateTime(val.transaction_date, (val.transaction_time || ""))}
                  </td>
                </tr>
              );
            })
          )
        }
        </tbody>
      </table>
      {
        (stockTransactions.length >= stockTransactionPerPage) &&
        <Pagination
          totalItems={stockTransactions.length}
          itemPerPage={stockTransactionPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      }
    </div>
  );
};

export default StockTransactionTable;
