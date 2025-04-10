import React from 'react';
import AuthForm from '../components/AuthForm/AuthForm';
import styles from './AuthPage.module.css';
import { Navigate } from 'react-router-dom';

const AuthPage = ({ onLogin, isAuthenticated }) => {
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <h1>Войдите в аккаунт</h1>
                <AuthForm onLogin={onLogin} />
            </div>
        </div>
    );
};

export default AuthPage;
