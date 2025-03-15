import { useEffect, useState} from "react";
import RightSidebar from "../components/RightSidebar";
import axios from "axios";
import {useUserContext} from "../context/UserContext.jsx";
import { toast } from "sonner";
import PageLoader from "../components/ui/PageLoader.jsx";
import BankSection from "../components/bank/Bank.jsx";
import { useActiveTabContext} from "../context/ActiveTabContext.jsx";
import Model from "../components/ui/Model.jsx";

const Dashboard = () => {
  const [loading, setLoading] = useState('');
  const [banks, setBanks] = useState([]);
  const { user } = useUserContext();
  const { toggleTab } = useActiveTabContext();
  useEffect(() => {
    setLoading(true);
    const getBanks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/bankaccount`,
          {
            withCredentials: true,
          });

        if(response.data.status !== 200) {
          toast.error(await response.data.message);
        }

        setBanks(await response.data.data);
        toggleTab(await response.data.data[0].id);
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    getBanks();
  }, []);

  if(loading) {
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
        <BankSection banks={ banks } />
      </div>
      <RightSidebar
        banks={ banks }
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
      {/* </Layout> */}
    </>
  );
};

export default Dashboard;
