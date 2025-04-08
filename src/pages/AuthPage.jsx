import React from 'react';
import AuthForm from '../components/AuthForm/AuthForm';
import styles from './AuthPage.module.css';

const AuthPage = ({ onLogin, isAuthenticated }) => {
    if (isAuthenticated) {
        window.location.href = '/';
        return null;
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
