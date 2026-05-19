import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

// Layout compartido del módulo (Header + Footer de core)
import Header from "../../core/layout/Header";
import Footer from "../../core/layout/Footer";

export default function HomeRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<HomePage />} />
        {/* <Route path="" element={} /> */} 
      </Routes>
      <Footer />
    </>
  );
}
