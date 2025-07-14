// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = {
    display: "block",
    padding: "10px 20px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold",
  };
  const activeStyle = {
    backgroundColor: "#ddd",
  };

  return (
    <nav
      style={{
        width: 200,
        borderRight: "1px solid #ccc",
        paddingTop: 20,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h3 style={{ paddingLeft: 20 }}>Members</h3>
        <NavLink
          to="/members"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Users
        </NavLink>
      </div>
      <div>
        <h3 style={{ paddingLeft: 20 }}>Events</h3>
        <NavLink
          to="/events"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Events
        </NavLink>
      </div>
      <div>
        <h3 style={{ paddingLeft: 20 }}>Groups</h3>
        <NavLink
          to="/groups"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Groups
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
