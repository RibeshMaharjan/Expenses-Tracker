import {ActiveTabProvider, useActiveTabContext} from "../../context/ActiveTabContext.jsx";

const BankTabs = ({ bank }) => {
  const { tabs, toggleTab } = useActiveTabContext();
  return (
    <li
      className={`py-1 px-1 border-b-2  cursor-pointer ${
        tabs === bank.id
          ? "active-tab"
          : "text-gray-600 border-transparent"
      }`}
      onClick={() => toggleTab(bank.id)}
    >
      {bank.bank_name}
    </li>
  );
};

export default BankTabs;