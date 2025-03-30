import Panel from "../components/panel/Panel.jsx";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import BankInfoCard from "../components/banktransaction/BankInfoCard.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import PageLoader from "../components/ui/PageLoader.jsx";
import Dropdown from "../components/ui/Dropdown.jsx";
import {BankActiveTabProvider} from "../context/ActiveBankTabContext.jsx";
import BankTransactionTable from "../components/banktransaction/BankTransactionTable.jsx";


const BankTransaction = () => {
  const { loading, banks } = useBankContent();

  if(loading) return (
    <div className={`mx-auto`}>
      <PageLoader />
    </div>
  );

  const bankName = banks.map(
    bank => bank?.bank_name
  )

  return (
    <>
      <Panel>
        <BankActiveTabProvider>
          <div className={`flex`}>
            <PanelHeader>
              <MainHeaderContent>
                Transaction History
              </MainHeaderContent>
              <SubHeaderContent>
                <p className="text-gray-600">
                  Gain insight of your transaction log.
                </p>
              </SubHeaderContent>
            </PanelHeader>
            <div className={`ms-auto`}>
              <Dropdown menuitems={bankName}  />
            </div>
            {/*<Button className={`h-fit ms-auto px-3 py-2 border float-end border-1 border-gray-300 rounded-md shadow-sm text-lg font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3`}>
              Select Account
            </Button>*/}
          </div>
            <section className="w-full" id="bank-cards-section">
            <BankInfoCard banks={banks} />
            <div
              className="flex justify-between mb-4"
              id="transaction-section-header"
            >
              <h1 className="text-2xl font-bold">Banks</h1>
            </div>
            <BankTransactionTable banks={banks} />
          </section>
        </BankActiveTabProvider>
      </Panel>
    </>
  );
};

export default BankTransaction;
