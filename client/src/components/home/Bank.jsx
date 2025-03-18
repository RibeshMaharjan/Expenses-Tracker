import BankAccountOverview from "./BankAccountOverview.jsx";
import Button from "../button.jsx";
import {ActiveTabProvider} from "../../context/ActiveTabContext.jsx";
import BankTabs from "./BankTabs.jsx";
import BankContent from "./BankContent.jsx";
import {useBankContent} from "../../context/BankContext.jsx";

const BankSection = () => {
  const { banks } = useBankContent();

  return (
    <>
      <BankAccountOverview />
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
          <ActiveTabProvider>
            {
              banks.length === 0 ?
              (<h1 className='text-2xl text-black'>No Banks Accounts</h1>) :
              ( <>
                  <ul
                    className="flex gap-2 mb-4 text-base font-bold border-1 border-b  border-grey-300"
                    id="bank-dropdown"
                  >
                    {banks?.length > 0 &&
                      banks.map((bank, index) => (
                        <BankTabs key={index} bank={bank} index={index}></BankTabs>
                      ))}
                  </ul>
                  {banks?.length > 0 &&
                    banks.map((bank, index) => (
                      <BankContent key={index} bank={bank}></BankContent>
                    ))}
                </>
              )
            }
          </ActiveTabProvider>
        </div>
      </section>
    </>
  )
}

export default BankSection;