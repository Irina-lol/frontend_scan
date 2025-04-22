import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import './styles/global.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const expire = localStorage.getItem('tokenExpire');

        if (token && expire) {
            const isTokenExpired = new Date(expire) < new Date();
            if (isTokenExpired) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('tokenExpire');
                setIsAuthenticated(false);
            } else {
                fetchUserData(token);
            }
        }
        setLoading(false);
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/info', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Ошибка авторизации')

            const data = await response.json();
            setUserData(data.eventFiltersInfo || {});
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            localStorage.removeItem('accessToken');
            setUserData({});
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (token, expire) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpire', expire);
        fetchUserData(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpire');
        setIsAuthenticated(false);
        setUserData({});
    };

    if (loading) {
        return <div className="loader">Загрузка...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <HomePage isAuthenticated={isAuthenticated} userData={userData} onLogout={handleLogout} /> 
                    } 
                />
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />
                    }
                />
                <Route path="/search" element={
                    isAuthenticated ? <SearchPage userData={userData} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
                    : <Navigate to="/login" />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
