import { useEffect, useState} from "react";
import RightSidebar from "../components/RightSidebar";
import {useUserContext} from "../context/UserContext.jsx";
import { toast } from "sonner";
import PageLoader from "../components/ui/PageLoader.jsx";
import BankSection from "../components/bank/Bank.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import {ActiveTabProvider} from "../context/ActiveTabContext.jsx";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { banks, getBankAccounts } = useBankContent();
  const {user} = useUserContext();
  useEffect(() => {
    setLoading(true);
    const getBanks = async () => {
      try {
        await getBankAccounts();
      } catch (err) {
        console.log(err);
        toast.error(err.message);
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
      <div className="h-full w-full px-4 py-6 lg:px-6 lg:py-8">
        <div className="mb-4" id="dashboard-header">
          <h1 className="medi text-3xl lg:text-4xl font-bold">
            Welcome, <span className="text-green-600 capitalize">{ user.username }</span>
          </h1>
          <p className="text-sm text-gray-600">
            Access & manage your account and transaction from single place.
          </p>
        </div>
        <BankSection />
      </div>
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
