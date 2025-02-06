import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => 
        sessionStorage.getItem("token") || localStorage.getItem("token")
    );
    const [current_user, setCurrentUser] = useState(null);

    console.log("Auth Token:", authToken);
    console.log("Current user:", current_user);

    // FETCH CURRENT USER
    const fetchCurrentUser = async () => {
        if (!authToken) {
            console.log("No auth token, skipping fetch.");
            return;
        }

        try {
            const response = await fetch("https://project-phase-4-1.onrender.com/api/current_user", {  // Ensure API URL is correct
                method: "GET",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${authToken}` 
                },
            });

            const data = await response.json();
            console.log("Fetch current user response:", data); // Debugging

            if (response.ok) {
                setCurrentUser(data);
            } else {
                console.error("Error fetching user:", data);
                setCurrentUser(null);
                sessionStorage.removeItem("token");
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Fetch user error:", error);
            setCurrentUser(null);
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
        }
    };

    // Ensure fetchCurrentUser runs when authToken changes
    useEffect(() => {
        if (authToken) {
            fetchCurrentUser();
        }
    }, [authToken]);

    // LOGIN
    const login = async (email, password) => {
        toast.loading("Logging you in...");
        try {
            const response = await fetch("https://project-phase-4-1.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login response:", data); // Debugging

            toast.dismiss();
            if (response.ok && data.access_token) {
                sessionStorage.setItem("token", data.access_token);
                localStorage.setItem("token", data.access_token);
                setAuthToken(data.access_token);
                await fetchCurrentUser();  // Ensure we fetch the user after login
                toast.success("Successfully Logged in!");
                return true;
            } else {
                toast.error(data.error || "Login failed");
                return false;
            }
        } catch (error) {
            toast.dismiss();
            console.error("Login error:", error);
            toast.error("An error occurred. Please try again.");
            return false;
        }
    };

    // LOGOUT
    const logout = async () => {
        toast.loading("Logging out...");
        try {
            const response = await fetch("https://project-phase-4-1.onrender.com/api/logout", {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
            });

            const data = await response.json();
            toast.dismiss();

            if (response.ok) {
                sessionStorage.removeItem("token");
                localStorage.removeItem("token");
                setAuthToken(null);
                setCurrentUser(null);
                toast.success("Successfully Logged out!");
                navigate("/login");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <UserContext.Provider value={{ authToken, login, current_user, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
