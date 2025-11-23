/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/check`,
                    { withCredentials: true }
                );

                if (res.data.auth === true) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (err) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    return authenticated ? children : <Navigate to="/" replace />;
}
