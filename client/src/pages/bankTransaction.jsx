import React from "react";
import Panel from "../components/panel/Panel.jsx";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Button from "../components/button.jsx";
import BankInfoCard from "../components/banktransaction/BankInfoCard.jsx";
import BankTransactionTable from "../components/home/banktransactiontable.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import Loader from "../components/ui/loader.jsx";
import PageLoader from "../components/ui/PageLoader.jsx";
import dialog from "../components/ui/Dialog.jsx";

const BankTransaction = () => {
  const {banks} = useBankContent();
  return (
    <>
      <Panel>
        <div className={`flex`}>
          <PanelHeader>
            <MainHeaderContent>
              <h1>Transaction History</h1>
            </MainHeaderContent>
            <SubHeaderContent>
              <p className="text-gray-600">
                Gain insight of your transaction log.
              </p>
            </SubHeaderContent>
          </PanelHeader>
          <Button className={`h-fit ms-auto px-3 py-2 border float-end border-1 border-gray-300 rounded-md shadow-sm text-lg font-semibold tracking-tight hover:bg-green-500 hover:text-white lg:px-3`}>
            Select Account
          </Button>
        </div>
        <section className="w-full" id="bank-cards-section">
          <BankInfoCard />
          <div
            className="flex justify-between mb-4"
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
          <BankTransactionTable transactions={banks[0]?.transactions} />
        </section>
      </Panel>
    </>
  );
};

export default BankTransaction;
