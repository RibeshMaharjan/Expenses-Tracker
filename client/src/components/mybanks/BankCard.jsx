import Button from "../button.jsx";
import {useEffect, useState} from "react";
import Barchart from "@/components/ui/Barchart.jsx";
import { transactionCategoryStyles } from '../../constants/index.jsx';

const BankCard = ({ index, bank }) => {
  const [expenseTransaction, setExpenseTransaction] = useState(0);
  const [incomeTransaction, setIncomeTransaction] = useState(0);
  let borderColor = "border-pink-600";
  let backgroundColor = "bg-pink-500";
  let textColor = "text-pink-700";
  let chipBackgroundColor = "bg-pink-50";
  
  for(let key in transactionCategoryStyles) {
    if(key == index) {
      borderColor = transactionCategoryStyles[key].borderColor;
      backgroundColor = transactionCategoryStyles[key].backgroundColor;
      textColor = transactionCategoryStyles[key].textColor;
      chipBackgroundColor = transactionCategoryStyles[key].chipBackgroundColor;
    }
  }
  useEffect(() => {
      bank?.transactions?.map(transaction => {
        if(transaction.transaction_type === 'income') {
          setIncomeTransaction(prevState => prevState + parseFloat(transaction.transaction_amount));
        } else {
          setExpenseTransaction(prevState => prevState + parseFloat(transaction.transaction_amount));
        }
      });
  }, [bank.transactions]);

  return (
    <>
      <div className={`w-full h-56 mb-4 rounded-xl flex`}>
        <div className={`h-full p-3 xl:p-5 ${chipBackgroundColor} ${textColor} min-w-96 w-auto rounded-md border shadow-lg`}>
          <div className={`flex flex-col justify-between h-full`}>
            <div className={`w-full`}>
              <h1 className={`text-lg font-bold mb-3`}>{ bank.bank_name }</h1>
              <p className={`text-xl`}>{  bank.type }</p>
              <p className={`tracking-wide font-bold`}>
                {bank.account_no}
              </p>
            </div>
            <div className={`flex items-end justify-between`}>
              <div className={``}>
                <p className={`2xl:text-xl font-semibold`}>
                  {  bank.account_holder_name }
                </p>
              </div>
              <div className={``}>
                <h3 className={``}>Avaibale balance</h3>
                <p className={`font-bold text-lg`}>Rs. {bank.balance}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`ml-5 h-full flex-1 p-3 xl:p-5 rounded-md border-2 ${borderColor} shadow-lg`}>
          <div className={`text-xl mb-6`}>
            <span>Income and Expense in last 30 days</span>
            <Button
              className={`ml-auto border float-end border-1 ${borderColor} rounded-md shadow-sm px-2 py-1 text-lg font-semibold tracking-tight hover:${backgroundColor} hover:text-white lg:px-3`}
            >View Transactions</Button>
          </div>
          <div className={`flex`}>
            <div className={`w-1/2`}>
              <span className={`text-[#4CAF50] font-bold`}>Income</span>
              <p>Rs {incomeTransaction}</p>
            </div>
            <div className={`w-1/2`}>
              <span className={`text-[#757575] font-bold`}>Expense</span>
              <p>Rs {expenseTransaction}</p>
            </div>
          </div>
          <div className={`mt-2 h-20`}>
            <Barchart data={{incomeTransaction, expenseTransaction}} />
          </div>
        </div>
      </div>
      <hr className={`mb-4`}/>
    </>
  )

}

export default BankCard;