import Panel from "../components/panel/Panel.jsx";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Button from "../components/button.jsx";
import BankCard from "../components/mybanks/BankCard.jsx";
import {useBankContent} from "../context/BankContext.jsx";

const Bank = () => {
  const { banks } = useBankContent();
  console.log(banks);
  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            <h1>My Bank Accounts</h1>
          </MainHeaderContent>
          <SubHeaderContent>
            <p className="text-gray-600">
              Effortlessly manager your banking activities.
            </p>
          </SubHeaderContent>
        </PanelHeader>
        <section className="w-full" id="bank-cards-section">
          <div
            className="flex justify-between mb-2"
            id="transaction-section-header"
          >
            <h1 className="text-2xl font-bold">Banks</h1>
            {/*<Button
              className="border border-1 border-gray-300 rounded-md shadow-sm px-2 py-1 font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3"
              onClick=""
            >
              View All
            </Button>*/}
          </div>
          {
            banks.length <= 0 ?
              (
              <div>
            <h1>No Banks</h1>
            </div>
            )
            : (
              <div className="py-2.5">
                {
                  banks.map((bank, index) => <BankCard key={index} bank={bank} />)
                }
              </div>
            )
          }

        </section>
      </Panel>
    </>
  );
};

export default Bank;