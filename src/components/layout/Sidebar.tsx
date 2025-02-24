
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Receipt,
  CreditCard,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Package, label: "Inventory", to: "/inventory" },
  { icon: ShoppingCart, label: "Orders", to: "/orders" },
  { icon: Users, label: "Customers", to: "/customers" },
  { icon: Store, label: "Vendors", to: "/vendors" },
  { icon: Receipt, label: "Expenses", to: "/expenses" },
  { icon: CreditCard, label: "Payments", to: "/payments" },
];

const Sidebar = () => {
  return (
    <div className="w-64 border-r bg-card p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold"></h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent/50"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
