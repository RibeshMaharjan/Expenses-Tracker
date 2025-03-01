import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { createContext, useContext, useState } from "react";
import BankTransactionTable from "../components/banktransactiontable";
import Button from "../components/button";
import Layout from "../components/Layout";
import RightSidebar from "../components/RightSidebar";

const activeTabContext = createContext();

const Dashboard = () => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const banks = [
    {
      id: 1,
      name: "Bank Account 1",
      balance: 20000,
      type: "saving",
    },
    {
      id: 2,
      name: "Bank Account 2",
      balance: 40000,
      type: "current",
    },
  ];

  return (
    <>
      {/* <Layout> */}
      <div className="h-full w-full px-4 py-6 lg:px-6 lg:py-8">
        <div className="mb-4" id="dashboard-header">
          <h1 className="medi text-3xl lg:text-4xl font-bold">
            Welcome, <span className="text-green-600">Username</span>
          </h1>
          <p className="text-sm text-gray-600">
            Access & manage your account and transaction from single place.
          </p>
        </div>
        <BankAccountOverview totalbanks={4} totalbalance={200000} />
        <section className="w-full" id="transaction-section">
          <div
            className="flex justify-between mb-2"
            id="transaction-section-header"
          >
            <h1 className="text-2xl font-bold">Recent Transactions</h1>
            <Button
              className="border border-1 border-gray-300 rounded-md shadow-sm px-2 py-1 font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3"
              onClick=""
            >
              View All
            </Button>
          </div>
          <div className="" id="transaction-table-section">
            <ul
              className="flex gap-2 mb-4 text-base font-bold border-1 border-b  border-grey-300"
              id="bank-dropdown"
            >
              <activeTabContext.Provider value={{ toggleState, toggleTab }}>
                {banks?.length > 0 &&
                  banks.map((bank, index) => (
                    <BankTabs key={index} bank={bank}></BankTabs>
                  ))}
              </activeTabContext.Provider>
            </ul>
            <activeTabContext.Provider value={{ toggleState, toggleTab }}>
              {banks?.length > 0 &&
                banks.map((bank, index) => (
                  <BankContent key={index} bank={bank}></BankContent>
                ))}
            </activeTabContext.Provider>
          </div>
        </section>
      </div>
      <RightSidebar
        user={[
          {
            username: "Asura Maharjan",
            email: "example@gmail.com",
          },
        ]}
        banks={[
          {
            name: "Bank 1",
            balance: 20000,
          },
          {
            name: "Bank 2",
            balance: 200000,
          },
        ]}
        expenses={[
          {
            name: "Expense 1",
            amount: 2000,
          },
          {
            name: "Expense 1",
            amount: 10000,
          },
        ]}
      ></RightSidebar>
      {/* </Layout> */}
    </>
  );
};

export const BankAccountOverview = ({ totalbanks, totalbalance }) => {
  return (
    <div
      className="flex flex-col lg:flex-row mb-4 border border-1 rounded-md shadow-sm px-3 py-3"
      id="bank-account-overview-section"
    >
      <div className="w-full lg:w-32 mb-4 lg:mb-0" id="balance-graph">
        <span className="text-center">Circle Graph</span>
      </div>
      <div className="flex ml-0 lg:ml-4 w-full" id="bank-account-overview">
        <div className="flex-grow text-lg font-bold" id="bank-account-counts">
          <span>{totalbanks} Bank Accounts</span>
          <div className="mt-auto" id="bank-account-total-amount">
            <span className="text-base text-gray-600">Total Balance</span>
            <div className="text-3xl font-extrabold" id="bank-account-balance">
              Rs. {totalbalance}
            </div>
          </div>
        </div>

        <button className="h-fit px-1 py-1.5 text-green-600 text-base/6 font-bold rounded-md hover:bg-green-200">
          <AddOutlinedIcon sx={{ fontSize: 20 }} />
          <span className="ms-1">Add Bank</span>
        </button>
      </div>
    </div>
  );
};

export const BankTabs = ({ bank }) => {
  const { toggleState, toggleTab } = useContext(activeTabContext);
  return (
    <li
      className={`py-1 px-1 border-b-2  cursor-pointer ${
        toggleState === bank.id
          ? "active-tab"
          : "text-gray-600 border-transparent"
      }`}
      onClick={() => toggleTab(bank.id)}
    >
      {bank.name}
    </li>
  );
};

export const BankContent = ({ bank }) => {
  const { toggleState, toggleTab } = useContext(activeTabContext);

  return (
    <div className={`${toggleState === bank.id ? "active-content" : "hidden"}`}>
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
              {bank.name}
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

export default Dashboard;
