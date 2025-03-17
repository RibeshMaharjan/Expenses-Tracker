import Button from "../button.jsx";

const BankCard = ({ bank }) => {
  return (
    <>
      <div className={`w-full h-56 mb-4 rounded-xl flex`}>
        <div className={`h-full p-3 xl:p-5 min-w-96 w-auto rounded-md border shadow-lg`}>
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
                <p className={`font-bold text-green-600 text-lg`}>Rs. {bank.balance}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`ml-5 h-full flex-1 p-3 xl:p-5 rounded-md border shadow-lg`}>
          <div className={`text-xl mb-6`}>
            <span>Income and Expense in last 30 days</span>
            <Button
              className={`ml-auto border float-end border-1 border-gray-300 rounded-md shadow-sm px-2 py-1 text-lg font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3`}
            >View Transactions</Button>
          </div>
          <div className={`flex`}>
            <div className={`w-1/2`}>
              Receive:
              <p>Rs 7000</p>
            </div>
            <div className={`w-1/2`}>
              Spend:
              <p>Rs 4000</p>
            </div>
          </div>
          <div className={``}>
            Graphs
          </div>
        </div>
      </div>
      <hr className={`mb-4`}/>
    </>
  )

}

export default BankCard;