import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import Planner from './Planner';
import Saved from './Saved';
import Home from './home'; 
import Result from './Result';

import './index.css'; // Tailwind CSS (if you're using it)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
       <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="planner" element={<Planner />} />
        <Route path="saved" element={<Saved />} />
        <Route path="/result" element={<Result />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
