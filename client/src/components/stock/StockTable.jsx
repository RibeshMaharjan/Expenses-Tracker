import {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../ui/loader.jsx";
import {toast} from "sonner";

const StockTable = ({ stocks }) => {
  console.log(stocks);

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
          stocks.length <= 0 ? (
            <tr className='text-lg bg-gray-300'>
              <td colSpan={4} className={`text-center px-2 py-4 min-w-24 font-semibold tracking-tight`}>
                <span>No Transaction</span>
              </td>
            </tr>
          ) : (
            stocks.map((val, key) => {
              return (
                <tr key={key} className={`text-lg`}>
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
    </div>
  );
};

export default StockTable;
