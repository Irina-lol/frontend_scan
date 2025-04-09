import { tr } from "date-fns/locale";
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (token, expire) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpire', expire);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpire');
        setIsAuthenticated(false);
        setUserData(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const expire = localStorage.getItem('tokenExpire');

        if (token && expire && new Date(expire) > new Date()) {
            setIsAuthenticated(true);
        } else {
            logout();
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout, loadding }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
