import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Layout from "./components/Layout";
import { UserProvider } from "./context/userContext";
import "./global.css";
import SignUp from "./pages/auth/sigin-up";
import SignIn from "./pages/auth/sign-in";

function App() {
  return (
    <main className="w-full h-screen font-sans">
      <Toaster richColors position="top-center" />

      <UserProvider>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
        <Layout />
      </UserProvider>
    </main>
  );
}

export default App;
