import BankTransactionTable from "./banktransactiontable.jsx";
import {useActiveTabContext} from "../../context/ActiveTabContext.jsx";

const BankContent = ({ bank }) => {
  // const { toggleState, toggleTab } = useContext(activeTabContext);

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
            NB
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
        <div className="h-fit py-0.5 px-2 rounded-3xl text-base font-semibold text-green-700 bg-green-200">
          {bank.type}
        </div>
      </div>
      <div className="" id="bank-account-transaction-table">
        <BankTransactionTable></BankTransactionTable>
      </div>
    </div>
  );
};

export default BankContent;