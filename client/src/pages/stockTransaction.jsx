import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";
import StockTransactionTable from "../components/stockTransaction/StockTransactionTable.jsx";

const StockTransaction = () => {
  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            <span>Stock Transaction History</span>
          </MainHeaderContent>
          <SubHeaderContent>
            <p className="text-gray-600">
              Gain insight of your stocks transaction log.
            </p>
          </SubHeaderContent>
        </PanelHeader>
        <section className="w-full" id="transaction-table-section">
          <div
            className="flex justify-between mb-2"
            id="transaction-table-section-header"
          >
            <h1 className="text-2xl font-bold">Transactions</h1>
          </div>
            <StockTransactionTable />
        </section>
      </Panel>
    </>
  );
};

export default StockTransaction;
