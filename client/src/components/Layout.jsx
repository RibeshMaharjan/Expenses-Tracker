import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Sidebar, { SidebarItem } from "../components/sidebar/sidebar";
import BankTransaction from "../pages/bankTransaction";
import Bank from "../pages/banks";
import Dashboard from "../pages/dashboard";
import Setting from "../pages/setting";
import Stock from "../pages/stock";
import StockTransaction from "../pages/stockTransaction";
import MobileNav from "./MobileNav";

/* icon imports */
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import { useUserContext } from "../context/userContext";

const RootLayout = () => {
  const { user } = useUserContext();
  // const [isLoggedIn, setIsLoggedIn] = useState(CookieExist("authToken"));

  return !user ? (
    <Navigate to="sign-in" />
  ) : (
    <>
      <div className="flex flex-col md:flex-row w-full h-screen">
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
        <div className="flex flex-col md:hidden size-full">
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
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/account-page" element={<Setting />}></Route>
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

export const BankAccountOverview = () => {
  return (
    <div
      className="flex flex-col lg:flex-row mb-4 border border-1 rounded-md shadow-sm px-3 py-3"
      id="bank-account-overview-section"
    >
      <div className="w-full lg:w-32 mb-4 lg:mb-0" id="balance-graph">
        Circle Graph
      </div>
      <div className="flex ml-0 lg:ml-4 w-full" id="bank-account-overview">
        <div className="flex-grow text-lg font-bold" id="bank-account-counts">
          <span>{"3"} Bank Accounts</span>
          <div className="mt-auto" id="bank-account-total-amount">
            <span className="text-base text-gray-600">Total Balance</span>
            <div className="text-2xl font-extrabold" id="bank-account-balance">
              Rs. {"20,000"}
            </div>
          </div>
        </div>

        <button className="h-fit px-1 py-1.5 text-green-600 text-base/6 font-bold rounded-md hover:bg-green-200">
          <AddOutlinedIcon sx={{ fontSize: 20 }} />
          <span className="ms-1">Add Bank</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
