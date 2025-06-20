import RightSidebar from "../components/RightSidebar";
import {useUserContext} from "../context/UserContext.jsx";
import PageLoader from "../components/ui/PageLoader.jsx";
import BankSection from "../components/home/Bank.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";

const Dashboard = () => {
  const { banks, loading, bankTransaction } = useBankContent();
  const {user} = useUserContext();

  if (loading) {
    return <PageLoader/>
  }

  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            Welcome, <span className="text-green-600 capitalize">{ user?.username }</span>
          </MainHeaderContent>
          <SubHeaderContent>
            <p className="text-gray-600">
              Access & manage your account and transaction from single place.
            </p>
          </SubHeaderContent>
        </PanelHeader>
        <BankSection />
      </Panel>
      <RightSidebar
        banks={ banks?.slice(0, 3) }
        transactions={ bankTransaction }
      ></RightSidebar>
    </>
  );
};

export default Dashboard;
