import {useActiveBankContext} from "../../context/ActiveBankTabContext.jsx";
import { transactionCategoryStyles } from "@/constants";
import {formatDateTime} from "@/libs/utils.jsx";
import {useEffect, useState} from "react";
import {Pagination} from "@/components/ui/Pagination.jsx";

const CategoryBadge = ({ category }) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category.id] ||
  transactionCategoryStyles.default;

  return (
    <div className={`flex items-center truncate w-fit gap-1 rounded-full border-[2px] pl-1.5 pr-2 ${borderColor} ${chipBackgroundColor}`}>
      <div className={`size-2 rounded-full ${backgroundColor}`} />
      <p className={`text-[14px] font-bold ${textColor}`}>{category.category}</p>
    </div>
  )
}

const BankTransactionTable = ({ banks }) => {
  const { activeBank } = useActiveBankContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);
  const lastTransactionIndex = currentPage * transactionsPerPage;
  const firstTransactionIndex = lastTransactionIndex - transactionsPerPage;
  const currentTransaction = banks && banks[activeBank]?.transactions?.slice(firstTransactionIndex, lastTransactionIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeBank]);

  return (
    <div className="" id="table-container">
      <table className="w-full text-lg rounded-md">
        <thead className="bg-gray-100 text-left text-gray-600 border-b-2">
        <tr>
          <th className="py-2 px-4">Amount</th>
          <th className="px-4">Category</th>
          <th className="px-4">Date</th>
          <th className="px-4">Description</th>
        </tr>
        </thead>
        <tbody className="">
        {
          currentTransaction?.length <= 0 ? (
            <tr className='text-lg bg-gray-300'>
              <td colSpan={4} className={`text-center px-2 py-4 min-w-24 font-semibold tracking-tight`}>
                <span>No Transaction</span>
              </td>
            </tr>
          ) : (
            currentTransaction?.map((val, key) => {
              return (
                <tr key={key} className={`text-lg ${
                  val.transaction_type === "income" ? "bg-green-50" : "bg-red-50"
                }`}>
                  <td className="px-4 py-4 min-w-24 font-bold tracking-tighter">
                    <span
                      className={
                        val.transaction_type === "income" ? "text-green-700" : "text-red-700"
                      }
                    >
                      <span className="me-1 font-extrabold text-lg">
                        {val.transaction_type === "income" ? "+" : "-"}
                      </span>
                      Rs. {val.transaction_amount}
                    </span>
                  </td>
                  <td className="pl-2 pr-10">
                    <CategoryBadge category={{id: val.category_id , category: val.category}} />
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {formatDateTime(val.transaction_date, (val.transaction_time || ""))}
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.description}
                  </td>
                </tr>
              );
            })
          )
        }
        </tbody>
      </table>
      {
        (banks && banks[activeBank]?.transactions?.length >= transactionsPerPage) &&
          <Pagination
            totalItems={banks[activeBank]?.transactions.length}
            itemPerPage={transactionsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
      }
    </div>
  );
};

export default BankTransactionTable;
