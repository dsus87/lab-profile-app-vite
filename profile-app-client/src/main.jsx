import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import { AuthProviderWrapper } from "./context/auth.context";


import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Router>
  <AuthProviderWrapper>
        <App />
  </AuthProviderWrapper>
    </Router>
  </React.StrictMode>,
)
