import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ đúng với ESM và Vite
 // ✅ sửa đúng

import AdminInventory from "./AdminInventory";
import UserManagement from "./UserManagement";
import DashBoard from "./DashBoard";

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState("products");
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token); // ✅ decode đúng
      console.log("decoded token:", decoded);

      // ✅ kiểm tra đúng Role
      if (
        decoded.Role === "admin" ||
        (decoded.roles && decoded.roles.includes("admin"))
      ) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Token decode failed:", error);
      setIsAuthorized(false);
      navigate("/login");
    }
  }, [navigate]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white flex flex-col">
        <h2 className="text-2xl font-bold p-4 border-b border-gray-700">
          Admin Panel
        </h2>
        <nav className="flex flex-col flex-grow">
          <button
            className={`p-4 text-left hover:bg-gray-700 ${
              activeTab === "products" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            Quản lý sản phẩm
          </button>
          <button
            className={`p-4 text-left hover:bg-gray-700 ${
              activeTab === "users" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            Quản lý người dùng
          </button>
          <button
            className={`p-4 text-left hover:bg-gray-700 ${
              activeTab === "dashboard" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
        </nav>
      </div>

      {/* Content area */}
      <div className="flex-grow overflow-auto">
        {activeTab === "products" && <AdminInventory />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "dashboard" && <DashBoard />}
      </div>
    </div>
  );
}
