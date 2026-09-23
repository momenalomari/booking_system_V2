import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListUsers from "../../pages/listUsers.jsx";

export default function AdminNavbar() {
  const navigate = useNavigate();

  // 1. حالات (States) لمراقبة حجم الشاشة وفتح القائمة
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. مراقبة تغيير حجم الشاشة تلقائياً
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false); // إغلاق قائمة الموبايل تلقائياً عند تكبير الشاشة
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ستايل موحد للروابط يتناسب مع الموبايل والكمبيوتر
  const navLinkStyle = {
    color: "#E2E8F0",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    display: isMobile ? "block" : "inline-block",
    width: isMobile ? "100%" : "auto",
    textAlign: isMobile ? "center" : "left",
  };

  return (
    <nav
      style={{
        backgroundColor: "#1E293B",
        padding: isMobile ? "15px 20px" : "15px 40px", // تقليل المسافات على الموبايل
        width: "100%",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", // يسمح بنزول القائمة لأسفل في الشاشات الصغيرة
        }}
      >
        {/* القسم الأول: الشعار */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>⚽</span>
          <h2
            style={{
              margin: 0,
              color: "#4CAF50",
              fontWeight: "bold",
              letterSpacing: "1px",
              fontSize: isMobile ? "20px" : "24px", // تصغير الخط قليلاً على الموبايل
            }}
          >
            Admin Panel
          </h2>
        </div>

        {/* 3. زر الهامبرغر للموبايل (يظهر فقط في الشاشات الصغيرة) */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "5px",
            }}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        )}

        {/* القسم الثاني: الروابط وأزرار التحكم */}
        <div
          style={{
            // التحكم بإظهار وإخفاء القائمة بناءً على نوع الشاشة وحالة الزر
            display: isMobile ? (isMenuOpen ? "flex" : "none") : "flex",
            flexDirection: isMobile ? "column" : "row", // ترتيب عمودي للموبايل وأفقي للكمبيوتر
            gap: "15px",
            alignItems: "center",
            width: isMobile ? "100%" : "auto",
            marginTop: isMobile ? "15px" : "0",
            borderTop: isMobile ? "1px solid #334155" : "none", // خط فاصل علوي للموبايل
            paddingTop: isMobile ? "15px" : "0",
          }}
        >
          {/* عند الضغط على أي رابط يتم إغلاق القائمة تلقائياً */}
          <Link
            to="/admin/dashboard"
            style={navLinkStyle}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/fields"
            style={navLinkStyle}
            onClick={() => setIsMenuOpen(false)}
          >
            Manage Fields
          </Link>
          <Link
            to="/admin/users"
            style={navLinkStyle}
            onClick={() => setIsMenuOpen(false)}
          >
            Users
          </Link>
          <Link
            to="/admin/bookings"
            style={navLinkStyle}
            onClick={() => setIsMenuOpen(false)}
          >
            Bookings
          </Link>

          {/* خط فاصل عمودي (يختفي في شاشات الموبايل) */}
          {!isMobile && (
            <div
              style={{
                height: "24px",
                width: "1px",
                backgroundColor: "#475569",
                margin: "0 10px",
              }}
            ></div>
          )}

          {/* زر تسجيل الخروج */}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#EF4444",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              width: isMobile ? "100%" : "auto", // يأخذ العرض الكامل على الموبايل
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#DC2626")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#EF4444")}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
