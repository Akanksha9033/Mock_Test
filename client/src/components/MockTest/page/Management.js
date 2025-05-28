import React, { useEffect, useState } from "react";
import axios from "axios";

const Management = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // ✅ Fetch Management Users
    const fetchManagementUsers = async () => {
        try {
            const token = localStorage.getItem("token"); // ✅ Get JWT token from localStorage
            if (!token) {
                setError("Unauthorized: No token found.");
                return;
            }

            const response = await axios.get("http://localhost:5000/management", {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Include token in headers
                },
            });

            setUsers(response.data); // ✅ Set fetched users in state
        } catch (error) {
            console.error("Error fetching management users:", error);
            setError(error.response?.data?.message || "Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchManagementUsers(); // ✅ Fetch users when component mounts
    }, []);

    return (
        <div>
            <h2>Management Users</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>
                            {user.name} - {user.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No management users found.</p>
            )}
        </div>
    );
};

export default Management;
