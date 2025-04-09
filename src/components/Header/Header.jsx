import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';
import { getAccountInfo } from '../../api';

const Header = ({ isAuthenticated, onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            getAccountInfo(token)
                .then(data => setUserData(data.eventFiltersInfo))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isAuthenticated])

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logoContainer}>
                    <img src={logo} alt="СКАН" className={styles.logo} />
                </Link>
            

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/tariffs">Тарифы</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </nav>

                {isAuthenticated ? (
                    <div className={styles.userPanel}>
                        {loading ? (
                            <div className={styles.loader}>Загрузка...</div>
                        ) : (
                            <>
                                <div className={styles.limitInfo}>
                                    <span>Использовано компаний: {userData?.usedCompanyCount || 0}</span>
                                    <span>Лимит по компаниям: {userData?.companyLimit || 0}</span>
                                </div>
                                <div className={styles.userInfo}>
                                    <button className={styles.logoutButton} onClick={onLogout}>Выйти</button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <Link to="/register" className={styles.registerLink}>Зарегистрироваться</Link>
                        <Link to="/login" className={styles.loginButton}>Войти</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
