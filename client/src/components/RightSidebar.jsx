import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import React, { use } from "react";
import Button from "./button";

const RightSidebar = ({ user, banks, expenses }) => {
  /*  const bankItems = React.Children.toArray(children).filter(
    (child) => child.props.type === "bank"
  );
  const expenseItems = React.Children.toArray(children).filter(
    (child) => child.props.type === "expense"
  ); */

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <aside className="right-sidebar no-scrollbar">
      <section className="flex flex-col">
        <div className="profile-banner"></div>
        <div className="profile">
          <div className="profile-img">
            <span>AM</span>
          </div>
          <div className="profile-details">
            <h1 className="text-2xl font-bold">{user[0].username}</h1>
            <p className="text-gray-600">{user[0].email}</p>
          </div>
        </div>
      </section>

      <section className="banks border-b-2">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="header-2">
            <PaidOutlinedIcon className="mr-2" />
            My Banks
          </h2>
          <Button
            className="px-1 float-end text-green-600 text-sm/6 font-bold rounded-md hover:bg-green-200"
            onClick={handleClick}
          >
            <AddOutlinedIcon sx={{ fontSize: 18 }} />
            <span className="ms-1">Add Bank</span>
          </Button>
        </div>
        {banks?.length > 0 && (
          <div className="w-full">
            <ul className="">
              {banks.map((bank, index) => (
                <BankItem key={index} name={bank.name} balance={bank.balance} />
              ))}
            </ul>
          </div>
        )}
      </section>
      <section className="expense">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="header-2">
            <MoneyOffIcon className="mr-2" />
            My Expenses
          </h2>
        </div>
        {expenses?.length > 0 && (
          <div className="w-full">
            <ul className="">
              {expenses.map((expense, index) => (
                <ExpenseItem
                  key={index}
                  name={expense.name}
                  balance={expense.amount}
                />
              ))}
            </ul>
          </div>
        )}
      </section>
    </aside>
  );
};

export const BankItem = ({ name, balance }) => {
  return (
    <li className="flex px-4 py-3 bg-green-100 mb-3 text-base/8 rounded-md font-semibold text-green-800">
      <span className="flex-grow">{name}</span>
      <span>{balance}</span>
    </li>
  );
};

export const ExpenseItem = ({ name, expense }) => {
  return (
    <li className="flex px-4 py-3 items-center bg-green-100 mb-3 text-base/8 rounded-md font-semibold text-green-800">
      <div
        className="w-12 h-12 rounded-full bg-green-400 flex justify-center items-center"
        id="expense-percent"
      >
        40%
      </div>
      <div className="ml-3 flex-grow flex flex-col" id="expense-info">
        <div className="text-sm flex justify-between" id="expense-text">
          <span className="">{name}</span>
          <span>{expense} Spend</span>
        </div>
        <div id="graph">line</div>
      </div>
    </li>
  );
};

export default RightSidebar;
