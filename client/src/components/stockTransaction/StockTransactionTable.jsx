import {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../ui/loader.jsx";
import {toast} from "sonner";
import {useStockContent} from "../../context/StockContext.jsx";

const StockTransactionTable = () => {
  const { loading, stockTransactions } = useStockContent();
  console.log(stockTransactions);

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
          <th className="px-4">Transaction Amount</th>
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
            stockTransactions.map((val, key) => {
              return (
                <tr key={key} className={`text-lg`}>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
                      {val.symbol}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                      {val.quantity}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.transaction_amount}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.transaction_type}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.brokerage_account_no}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.bank_name}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.transaction_date}
                  </td>
                </tr>
              );
            })
          )
        }
        </tbody>
      </table>
    </div>
  );
};

export default StockTransactionTable;
