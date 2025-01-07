import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import DeliveryDashboard from "./components/DeliveryDashboard";
import PantryDashboard from "./components/PantryDashboard";
import { ChakraProvider } from "@chakra-ui/react";
import Register from "./components/Register";
import LoginRegister from "./components/LoginRegister";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          <Route path="/pantry-dashboard" element={<PantryDashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
