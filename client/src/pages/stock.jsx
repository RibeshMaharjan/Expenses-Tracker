import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";
import StockTable from "../components/stock/StockTable.jsx";

const Stock = () => {
  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            <span>My Stocks</span>
          </MainHeaderContent>
          <SubHeaderContent>
            <p className="text-gray-600">
              Effortlessly manager your stocks.
            </p>
          </SubHeaderContent>
        </PanelHeader>
        <section className="w-full" id="stock-section">
          <div
            className="flex justify-between mb-4"
            id="transaction-section-header"
          >
            <h1 className="text-2xl font-bold">Stocks</h1>
          </div>
            <StockTable />
        </section>
      </Panel>
    </>
  );
};

export default Stock;
