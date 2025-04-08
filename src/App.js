import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import './styles/global.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Иван Иванов',
        usedCompanyCount: 34,
        companyLimit: 100
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (token, expire) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpire', expire);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpire');
        setIsAuthenticated(false);
    };


    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <HomePage isAuthenticated={isAuthenticated} userData={userData} onLogout={handleLogout} /> 
                    } 
                />
                <Route path="/login" element={
                    <AuthPage onLogout={handleLogin} isAuthenticated={isAuthenticated} />
                    }
                />
                <Route path="/search" element={
                    <SearchPage isAuthenticated={isAuthenticated} userData={userData} onLogout={handleLogout} />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
