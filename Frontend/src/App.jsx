import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import {
  ClipboardList,
  LayoutGrid,
  Pencil,
  Filter,
  ShoppingCart,
  DollarSign,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

import ClientDashboard from "./ClientDashboard";
import EditClientDashboard from "./EditClientDashboard";
import Features from "./Features";
import Orders from "./Orders";
import FinancePage from "./Finance";
import SendMessagePage from "./SendMessagePage";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <header className="flex justify-between items-center px-4 sm:px-8 py-3 bg-white border-b shadow-sm">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2">
            <ClipboardList className="text-purple-600 w-6 h-6" />
            <h1 className="text-lg font-bold">PhotoBooth CRM</h1>
            <HelpCircle className="text-gray-400 w-4 h-4" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Nav Links */}
          <nav
            className={`${
              menuOpen ? "flex" : "hidden"
            } absolute sm:static top-14 left-0 w-full sm:w-auto flex-col sm:flex-row sm:flex bg-white sm:bg-transparent border-t sm:border-none p-4 sm:p-0 shadow-md sm:shadow-none gap-3 sm:gap-6`}
          >
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/edit-dashboard" element={<EditClientDashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/send-message" element={<SendMessagePage /> } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
