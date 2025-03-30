import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Button from "./button";
import {useUserContext} from "../context/UserContext.jsx";
import { Progress } from "@/components/ui/progress"
import { topCategoryStyles } from "@/constants";

const RightSidebar = ({ banks, transactions }) => {
  const { user } = useUserContext();
  let wholeSpending = 0;

  const getExpenses = (transactions) => {
    const categoryBalance = transactions.reduce((newArray, transaction) => {
      if(transaction.transaction_type !== 'expense') {
        return newArray;
      }
      wholeSpending += parseFloat(transaction.transaction_amount);
      const categoryExist = newArray.find(item => item.name === transaction.category);

      if(categoryExist) {
        categoryExist.totalExpenses += parseFloat(transaction.transaction_amount);
      } else {
        newArray.push({
          id: transaction.category_id,
          name: transaction.category,
          totalExpenses: parseFloat(transaction.transaction_amount),
        })
      }
      return newArray;
    }, [])

    return categoryBalance;
  }

  const expenses = getExpenses(transactions);
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <aside className="right-sidebar no-scrollbar">
      <section className="flex flex-col">
        <div className="profile-banner"></div>
        <div className="profile">
          <div className="profile-img">
            <span>{ user.initials }</span>
          </div>
          <div className="profile-details">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
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
                <BankItem key={index} bank={bank} />
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
                  category={expense}
                  allExpenses={wholeSpending}
                />
              ))}
            </ul>
          </div>
        )}
      </section>
    </aside>
  );
};

export const BankItem = ({ bank }) => {
  console.log(bank)
  return (
    <li className="flex px-4 py-3 bg-green-100 mb-3 text-base/8 rounded-md font-semibold text-green-800">
      <div
        className="bg-green-500 w-12 h-12 me-4 rounded-full flex justify-center items-center text-white text-base font-extrabold"
        id="bank-account-profile"
      >
        {bank.initials}
      </div>
      <span className="flex-grow">{bank.bank_name}</span>
      <span>{bank.balance}</span>
    </li>
  );
};

export const ExpenseItem = ({ category, allExpenses }) => {
  const spend = Math.round((category.totalExpenses/allExpenses) * 100);

  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
  } = topCategoryStyles[category.id] ||
  topCategoryStyles.default;

  return (
    <li className={`flex px-4 py-3 items-center ${bg} mb-3 text-base/8 rounded-md font-semibold text-green-800`}>
      <div
        className={`w-12 h-12 rounded-full ${circleBg} flex justify-center items-center ${count}`}
        id="expense-percent"
      >
        {spend}%
      </div>
      <div className="ml-3 flex-grow flex flex-col" id="expense-info">
        <div className="text-sm flex justify-between" id="expense-text">
          <span className={`${main}`}>{category.name}</span>
          <span className={`${count}`}>Rs. {category.totalExpenses} Spend</span>
        </div>
        <div className={`mt-2`}>
          <Progress
            className={progressBg}
            indicatorClassName={indicator}
            value={spend}
          />
        </div>
      </div>
    </li>
  );
};

export default RightSidebar;
