import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check token and user from localStorage when app loads
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("AuthProvider.js: useEffect triggered.");
        console.log("AuthProvider.js: Token in localStorage:", token);
        console.log("AuthProvider.js: User in localStorage:", storedUser);

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("AuthProvider.js: Decoded token:", decodedToken);

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("AuthProvider.js: Token expired. Logging out...");
                    handleLogout();  // Log out if token is expired
                } else {
                    if (storedUser) {
                        console.log("AuthProvider.js: Using stored user from localStorage.");
                        setUser(JSON.parse(storedUser));  // Use user from localStorage
                    } else {
                        const role = decodedToken.role || "Student"; // Default fallback if no role
                        const newUser = {
                            id: decodedToken.id,
                            name: decodedToken.name,
                            role: role,
                        };
                        console.log("AuthProvider.js: Setting new user:", newUser);
                        setUser(newUser); // Set the user from the decoded token
                        localStorage.setItem("user", JSON.stringify(newUser));  // Save user in localStorage
                    }
                }
            } catch (error) {
                console.error("AuthProvider.js: Invalid token. Logging out...");
                handleLogout();
            }
        } else {
            console.log("AuthProvider.js: No token found. Setting user to null.");
            setUser(null);  // No token means no user logged in
        }
        setIsLoading(false);  // Done loading user state
    }, []);

    const login = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const role = decodedToken.role || "Student"; // Fallback to "Student" if no role is found
            const userData = {
                id: decodedToken.id,
                name: decodedToken.name,
                role: role,
            };
            console.log("AuthProvider.js: Login - Decoded user:", userData);

             // Dynamically set allowedRoles based on user role
        let allowedRoles = [];
        if (role === "Teacher") {
            allowedRoles = ["Teacher"];
        } else if (role === "Admin") {
            allowedRoles = ["Admin"];  // Allow Admin and Teacher roles (or based on your use case)
        } else {
            allowedRoles = ["Student"];  // Default to Student
        }
    
            localStorage.setItem("token", token);  // Save token in localStorage
            localStorage.setItem("user", JSON.stringify(userData));  // Save user in localStorage
            // Store allowed roles in localStorage
        localStorage.setItem("allowedRoles", JSON.stringify(allowedRoles));
            setUser(userData);  // Set user in state
        } catch (error) {
            console.error("AuthProvider.js: Invalid token provided during login.");
        }
    };

    const handleLogout = () => {
        console.log("AuthProvider.js: Logging out...");
        localStorage.removeItem("token");  // Remove token from localStorage
        localStorage.removeItem("user");   // Remove user from localStorage
        localStorage.removeItem("allowedRoles"); // Remove allowed roles as well
        setUser(null);  // Clear user from state
        window.location.href = "/signin";  // Redirect to sign-in page after logout
    };

    if (isLoading) return <div>Loading...</div>;  // Show loading indicator while checking login state

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;




