
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Vendors from "@/pages/Vendors";
import Expenses from "@/pages/Expenses";
import Payments from "@/pages/Payments";
import NotFound from "@/pages/NotFound";
import CustomerView from "@/pages/CustomerView";
import Auth from "@/pages/Auth";
import Layout from "@/components/layout/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/customer-view" element={<CustomerView />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/payments" element={<Payments />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
