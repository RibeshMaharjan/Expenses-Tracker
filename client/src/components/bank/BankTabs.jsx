import {useActiveTabContext} from "../../context/ActiveTabContext.jsx";
import {useEffect} from "react";

const BankTabs = ({ bank, index }) => {
  const { tabs, toggleTab } = useActiveTabContext();

  useEffect(() => {
    if(index === 0) {
      toggleTab(bank.id);
    }
  }, [bank]);

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