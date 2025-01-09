import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import DeliveryDashboard from "./components/DeliveryDashboard";
import PantryDashboard from "./components/PantryDashboard";
import { ChakraProvider } from "@chakra-ui/react";
import LoginRegister from "./components/LoginRegister";
import UsersPage from "./components/admin/UsersPage";
import OrdersPage from "./components/admin/OrdersPage";
import StaffPage from "./components/pantry/StaffPage";
import AllOrders from "./components/pantry/PendingOrders";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          <Route path="/pantry-dashboard" element={<PantryDashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/pantry-staff" element={<StaffPage />} />
          <Route path="/orders" element={<OrdersPage /> } />
          <Route path="/all-orders" element={<AllOrders />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
