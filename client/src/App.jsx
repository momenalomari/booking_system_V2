import "./App.css";
import React from "react";
// 1. دمجنا كل أدوات الراوتر بسطر واحد أنظف
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// استدعاء أدوات التوست
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Hero from "./componant/Landing/landing.jsx";
import Navbar from "./componant/layout/Navbar/navbar.jsx";
// 2. كبرنا أول حرف (AdminNavbar) عشان React يفهمه صح
import AdminNavbar from "./componant/layout/Navbar/adminNavbar.jsx";
import Footer from "./componant/layout/Footer/footer.jsx";
import AdminFooter from "./componant/layout/Footer/adminFooter.jsx";
import FieldsList from "./componant/pages/FieldsList.jsx";
import Register from "./componant/Auth/Register.jsx";
import Login from "./componant/Auth/Login.jsx";
import AdminDashboard from "./componant/admin/admin.dashboard.jsx";
import UserDashboard from "./componant/user/user.dashboard.jsx";
import ManageUser from "./componant/admin/ManageUser.jsx";


// 3. عملنا هذا الكومبوننت الداخلي عشان الـ useLocation تكون جوا الراوتر وتشتغل صح
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* الشرط تبعنا صار شغال 100% هسا */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/fields" element={<FieldsList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/users" element={<ManageUser />} />
      </Routes>

      {isAdminRoute ? <AdminFooter /> : <Footer />}
      {/* حاوية التوست */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

// الكومبوننت الرئيسي اللي بيغلف كل إشي
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;