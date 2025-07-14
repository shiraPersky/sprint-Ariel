import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Users</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.skills.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
