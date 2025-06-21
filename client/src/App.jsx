import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Layout from "./components/Layout";
import { UserProvider } from "./context/UserContext.jsx";
import SignUp from "./pages/auth/sigin-up";
import SignIn from "./pages/auth/sign-in";
import {StockProvider} from "./context/StockContext.jsx";
import {BankProvider} from "./context/BankContext.jsx";
import BankTransaction from "./pages/bankTransaction";
import Bank from "./pages/banks";
import Dashboard from "./pages/dashboard";
import Setting from "./pages/setting";
import Stock from "./pages/stock";
import StockTransaction from "./pages/stockTransaction";

function App() {
  return (
    <main className="w-full h-screen font-sans">
      <Toaster richColors position="top-center" />

      <UserProvider>
        <BankProvider>
          <StockProvider>
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              
              {/* All authenticated routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bankaccount" element={<Bank />} />
                <Route path="/banktransaction" element={<BankTransaction />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/stocktransaction" element={<StockTransaction />} />
                <Route path="/account-page" element={<Setting />} />
              </Route>
            </Routes>
          </StockProvider>
        </BankProvider>
      </UserProvider>
    </main>
  );
}

export default App;
