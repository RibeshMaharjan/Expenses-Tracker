import {Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import Sidebar, { SidebarItem } from "../components/sidebar/sidebar";
import BankTransaction from "../pages/bankTransaction";
import Bank from "../pages/banks";
import Dashboard from "../pages/dashboard";
import Setting from "../pages/setting";
import Stock from "../pages/stock";
import StockTransaction from "../pages/stockTransaction";
import MobileNav from "./MobileNav";
import {useUserContext} from "../context/UserContext.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import {useEffect} from "react";
import {useStockContent} from "../context/StockContext.jsx";

/* icon imports */
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import axios from "axios";

const RootLayout = () => {
  const { user } = useUserContext();
  // user?.length > 0 && navigate("/dashboard");
// }
  return !user ? (
    <Navigate to="sign-in" />
  ) : (
    <>
      <div className="flex flex-col lg:flex-row w-full h-screen">
        <Sidebar>
          <SidebarItem
            title="Home"
            icon={<DashboardOutlinedIcon />}
            link="/dashboard"
            active
          ></SidebarItem>
          <SidebarItem
            title="My Banks"
            icon={<PaidOutlinedIcon />}
            link="/bankaccount"
          ></SidebarItem>
          <SidebarItem
            title="Bank Transaction"
            icon={<ReceiptOutlinedIcon />}
            link="/banktransaction"
          ></SidebarItem>
          <SidebarItem
            title="My Stocks"
            icon={<ShowChartOutlinedIcon />}
            link="/stock"
          ></SidebarItem>
          <SidebarItem
            title="Stock Transaction"
            icon={<ReceiptLongOutlinedIcon />}
            link="/stocktransaction"
          ></SidebarItem>
        </Sidebar>
        <div className="flex flex-col lg:hidden size-full">
          <div className="flex flex-col p-4 pb-2 mx-3 rounded-md shadow-lg bg-white">
            <MobileNav></MobileNav>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

const Layout = () => {
  const { user } = useUserContext();
  const { stockError, getStockAccountsAndTransactions } = useStockContent();
  const { bankError, getBankAccountsAndTransactions } = useBankContent();

  useEffect( () => {
    // setLoading(true);
      const getAll = async () => {
        try {
          await Promise.all([
            getBankAccountsAndTransactions(),
            getStockAccountsAndTransactions(),
          ]);
        } catch (error) {
          console.log(error)
          if(error.status === 401) {
            const refrehToken = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/auth/token`,
              {
                "id": user.id
              },
              {
                withCredentials: true,
              });
            if(refrehToken.status !== 200) return (
              <Navigate to="sign-in" />
            );
          }
        } finally {
          // setLoading(false);
        }
      }
      getAll();
  }, []);

  if(bankError[0]?.status === 401 || stockError[0]?.status === 401) {
    return (
      <Navigate to="sign-in" />
    );
  }

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/account-page" element={<Setting />}></Route>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/banktransaction" element={<BankTransaction />} />
          <Route path="/stocktransaction" element={<StockTransaction />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/bankaccount" element={<Bank />} />
        </Route>
      </Routes>
    </>
  );
};

export default Layout;
