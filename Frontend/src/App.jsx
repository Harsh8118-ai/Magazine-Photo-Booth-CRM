import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { ClipboardList, LayoutGrid, Pencil, Filter, ShoppingCart, DollarSign, HelpCircle } from "lucide-react";

import ClientDashboard from "./ClientDashboard";
import EditClientDashboard from "./EditClientDashboard";
import Features from "./Features";
import Orders from "./Orders";
import FinancePage from "./Finance";


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 px-36">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-3 bg-white border-b shadow-sm">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2">
            <ClipboardList className="text-purple-600 w-6 h-6" />
            <h1 className="text-lg font-bold">Event CRM</h1>
            <HelpCircle className="text-gray-400 w-4 h-4" />
          </div>

          {/* Right: Nav Links */}
          <nav className="flex items-center gap-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
                  isActive ? "bg-emerald-700 text-white" : "text-gray-600 hover:text-black"
                }`
              }
            >
              <LayoutGrid className="w-4 h-4" /> Dashboard
            </NavLink>

            <NavLink
              to="/edit-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1 rounded-lg ${
                  isActive ? "bg-emerald-700 text-white" : "text-gray-600 hover:text-black"
                }`
              }
            >
              <Pencil className="w-4 h-4" /> Edit Dashboard
            </NavLink>

            <NavLink
              to="/features"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1 rounded-lg ${
                  isActive ? "bg-emerald-700 text-white" : "text-gray-600 hover:text-black"
                }`
              }
            >
              <Filter className="w-4 h-4" /> Features
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1 rounded-lg ${
                  isActive ? "bg-emerald-700 text-white" : "text-gray-600 hover:text-black"
                }`
              }
            >
              <ShoppingCart className="w-4 h-4" /> Orders
            </NavLink>

            <NavLink
              to="/finance"
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1 rounded-lg ${
                  isActive ? "bg-emerald-700 text-white" : "text-gray-600 hover:text-black"
                }`
              }
            >
              <DollarSign className="w-4 h-4" /> Finance
            </NavLink>
          </nav>
        </header>

        {/* Routes */}
        <main className="container mx-auto px-4 py-6 max-w-8xl">
          <Routes>
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/edit-dashboard" element={<EditClientDashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/finance" element={<FinancePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
