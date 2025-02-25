import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/auth/sigin-up";
import SignIn from "./pages/auth/sign-in";
import Dashboard from "./pages/dashboard";
import Setting from "./pages/setting";
import Transaction from "./pages/transaction";

function App() {
  return (
    <main>
      <div>
        <Routes>
          {/* <Route path="/" element={} /> */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/account-page" element={<Setting />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
