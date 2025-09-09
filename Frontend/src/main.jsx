import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; 
import "./index.css";
import ClientDashboard from "./ClientDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ClientDashboard />
    </Router>
  </React.StrictMode>
);
