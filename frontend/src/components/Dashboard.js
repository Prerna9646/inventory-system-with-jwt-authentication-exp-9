import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ProductManager from "./ProductManager";
import UserManager from "./UserManager";

function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">📦</span>
          <span className="brand-name">StockManager</span>
        </div>

        <nav className="navbar-tabs">
          <button
            className={`nav-tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          {isAdmin && (
            <button
              className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
          )}
        </nav>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</span>
            <div className="user-details">
              <span className="user-email">{user?.email}</span>
              <span className={`user-role ${isAdmin ? "role-admin" : "role-user"}`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "products" && <ProductManager />}
        {activeTab === "users" && isAdmin && <UserManager />}
        {activeTab === "users" && !isAdmin && (
          <div className="alert alert-error">
            🚫 You don't have permission to view this section.
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;