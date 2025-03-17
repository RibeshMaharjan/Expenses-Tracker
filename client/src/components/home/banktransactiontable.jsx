const BankTransactionTable = ({ transactions }) => {
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
          transactions.length <= 0 ? (
            <tr className='text-lg bg-gray-300'>
              <td colspan={4} className={`text-center px-2 py-4 min-w-24 font-semibold tracking-tight`}>
                <span>No Transaction</span>
              </td>
            </tr>
          ) : (
            transactions.map((val, key) => {
              return (
                <tr key={key} className={`text-lg ${
                  val.transaction_type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <td className="px-4 py-4 min-w-24 font-semibold tracking-tight">
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
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    <span className=
                            {`px-3 border-2 border-green-700 text-green-700 tracking-tight rounded-full before:content-['•'] before:mr-1.5 before:text-green-700 before:text-lg capitalize 
                              ${val.transaction_type === "income" ? "border-green-700 text-green-700 before:text-green-700" : "border-red-700 text-red-700 before:text-red-700"}`}>
                      {val.category}
                    </span>
                  </td>
                  <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                    {val.transaction_date}
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
    </div>
  );
};

export default BankTransactionTable;
