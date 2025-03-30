import BankTransactionsTable from "./BankTransactionsTable.jsx";
import {useActiveTabContext} from "../../context/ActiveTabContext.jsx";

const BankContent = ({ bank }) => {
  const { tabs } = useActiveTabContext();

  return (
    <div className={`${tabs === bank.id ? "active-content" : "hidden"}`}>
      <div
        className="flex items-center py-2 px-4 mb-4 bg-green-50 rounded-md"
        id="bank-account-overview"
      >
        <div className="flex flex-grow items-center" id="bank-account-info">
          <div
            className="bg-blue-500 w-12 h-12 me-4 rounded-full flex justify-center items-center text-white text-base font-extrabold"
            id="bank-account-profile"
          >
            {bank.initials}
          </div>
          <div className="flex-grow text-lg" id="bank-account-profile-text">
            <div className="mb-1 font-bold" id="bank-account-name">
              {bank.bank_name}
            </div>
            <div className="text-green-600 font-bold" id="bank-account-balance">
              Rs. {bank.balance}
            </div>
          </div>
        </div>
        <div className="h-fit py-1 px-3 rounded-3xl text-sm font-semibold text-green-700 bg-green-200">
          {bank.bank_account_type}
        </div>
      </div>
      <div className="" id="bank-account-transaction-table">
        <BankTransactionsTable transactions={ bank.transactions } />
      </div>
    </div>
  );
};

export default BankContent;