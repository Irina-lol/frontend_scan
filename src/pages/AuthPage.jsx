import React from 'react';
import AuthForm from '../components/AuthForm/AuthForm';
import styles from './AuthPage.module.css';
import { Navigate } from 'react-router-dom';
import authImage from '../assets/auth.png';
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer';

const AuthPage = ({ onLogin, isAuthenticated, onLogout }) => {
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
            <div className={styles.authPage}>
                <div className={styles.authContent}>
                    <h1 className={styles.authTitle}>
                        Для оформления подписки на тариф, необходимо авторизоваться.
                    </h1>
                    <img src={authImage} alt="Авторизация" className={styles.authImage} />
                </div>

                <div className={styles.authFormContainer}>
                    <AuthForm onLogin={onLogin} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AuthPage;
