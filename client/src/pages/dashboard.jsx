import { useEffect, useState} from "react";
import RightSidebar from "../components/RightSidebar";
import {useUserContext} from "../context/UserContext.jsx";
import { toast } from "sonner";
import PageLoader from "../components/ui/PageLoader.jsx";
import BankSection from "../components/home/Bank.jsx";
import { useNavigate } from "react-router-dom";
import {useBankContent} from "../context/BankContext.jsx";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { banks, getBankAccounts } = useBankContent();
  const {user} = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const getBanks = async () => {
      try {
        await getBankAccounts();
      } catch (err) {
        console.log(err);
        if(err.response.status === 401) {
          navigate('/sign-in');
        }
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    }
    getBanks();
  }, []);

  if (loading) {
    return <PageLoader/>
  }

  return (
    <>
      <Panel>
        <PanelHeader>
          <MainHeaderContent>
            <h1>Welcome, <span className="text-green-600 capitalize">{ user?.username }</span></h1>
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
        banks={ banks.slice(0, 3) }
        expenses={[
          {
            name: "Expense 1",
            amount: 2000,
          },
          {
            name: "Expense 1",
            amount: 10000,
          },
        ]}
      ></RightSidebar>
    </>
  );
};

export default Dashboard;
