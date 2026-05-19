import { Routes, Route } from "react-router-dom";

import Header from "../../core/layout/Header";

import Main from "./pages/main";

import Footer from "../../core/layout/Footer";

export default function UserRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Main />} />
      </Routes>
      <Footer />
    </>
  );
}
