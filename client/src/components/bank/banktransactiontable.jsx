const data = [
  {
    type: "income",
    amount: "5600",
    category: "salery",
    date: "2024-02-14",
    description: "Salery received",
  },
  {
    type: "expense",
    amount: "1500",
    category: "salery",
    date: "2024-02-14",
    description: "Salery received",
  },
  {
    type: "income",
    amount: "2000",
    category: "salery",
    date: "2024-02-14",
    description: "Salery received",
  },
];

const BankTransactionTable = () => {
  return (
    <div className="" id="table-container">
      <table className="w-full text-lg rounded-md">
        <thead className=" bg-gray-100 text-left text-gray-600 border-b-2">
          <tr>
            <th className="py-2 px-2">Amount</th>
            <th className="px-2">Category</th>
            <th className="px-2">Date</th>
            <th className="px-2">Description</th>
          </tr>
        </thead>
        <tbody className="">
          {data.map((val, key) => {
            return (
              <tr key={key} className="text-lg even:bg-green-100">
                <td className="px-2 py-4 min-w-24 font-semibold tracking-tight">
                  <span
                    className={
                      val.type === "income" ? "text-green-700" : "text-red-700"
                    }
                  >
                    <span className="me-1 font-extrabold text-lg">
                      {val.type === "income" ? "+" : "-"}
                    </span>
                    Rs. {val.amount}
                  </span>
                </td>
                <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                  <span className="px-3 border-2 border-green-700 text-green-700 tracking-tight rounded-full before:content-['•'] before:mr-1.5 before:text-green-700 before:text-lg capitalize">
                    {val.category}
                  </span>
                </td>
                <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                  {val.date}
                </td>
                <td className="px-2 py-3 min-w-24 font-semibold tracking-tight">
                  {val.description}
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* <tfoot>
          <tr>
            <td>Sum</td>
            <td>$180</td>
          </tr>
        </tfoot> */}
      </table>
    </div>
  );
};

export default BankTransactionTable;
