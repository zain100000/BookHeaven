import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const bookRoutes = [
      "/admin/books/add-book",
      "/admin/books/manage-books",
      "/admin/books/book-details",
      "/admin/books/edit-book",

      "/admin/stocks/manage-stock",
    ];

    const isBookRoute = bookRoutes.some((route) =>
      location.pathname.startsWith(route)
    );    
  }, [location]);

  return (
    <section id="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-container">
          <NavLink
            to="/admin/dashboard"
            className={`sidebar-link ${
              activeLink === "/admin/dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveLink("/admin/dashboard")}
          >
            <div className="sidebar-icon">
              <i className="fas fa-home"></i>
            </div>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/books/manage-books"
            className={`sidebar-link ${
              activeLink === "/admin/books/manage-books" ? "active" : ""
            }`}
            onClick={() => setActiveLink("/admin/books/manage-books")}
          >
            <div className="sidebar-icon">
              <i className="fas fa-book"></i>
            </div>
            <span>Manage Books</span>
          </NavLink>

          <NavLink
            to="/admin/stocks/manage-stock"
            className={`sidebar-link ${
              activeLink === "/admin/stocks/manage-stock" ? "active" : ""
            }`}
            onClick={() => setActiveLink("/admin/stocks/manage-stock")}
          >
            <div className="sidebar-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <span>Manage Stock</span>
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
