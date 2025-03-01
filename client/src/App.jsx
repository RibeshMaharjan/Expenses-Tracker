import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import "./global.css";
import SignUp from "./pages/auth/sigin-up";
import SignIn from "./pages/auth/sign-in";

function App() {
  return (
    <main className="w-full h-screen font-sans">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <Layout />
    </main>
  );
}

export default App;
