import React from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import "./App.css";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
// import authService from "../services/auth.service";



function App() {
  return (
  
      <Routes>
        <Route path="/" element={<HomePage />} />  
        <Route exact path="/auth/signup" element={<SignupPage />} /> 
        <Route exact path="/auth/login" element={<LoginPage />} /> 
      </Routes>

  );
}

export default App;