import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Login/Login";
import Layout from "../Layout/Layout";

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/layout" element={<Layout />}></Route>
        <Route path="/" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
