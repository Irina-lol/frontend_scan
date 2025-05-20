import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import foot from '../../assets/footer.png';
import logo from '../../assets/logo.png'
import { getAccountInfo } from '../../api';

const Header = ({ isAuthenticated, onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            getAccountInfo(token)
                .then(data => setUserData(data.eventFiltersInfo))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isAuthenticated]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
                    <>
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

                        <div className={styles.burgerContainer}>
                            <button 
                                className={`${styles.burgerButton} ${isMenuOpen ? styles.open : ''}`} 
                                onClick={toggleMenu}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.authButtons}>
                            <Link to="/register" className={styles.registerLink}>Зарегистрироваться</Link>
                            <span className={styles.separator}>|</span>
                            <Link to="/login" className={styles.loginButton}>Войти</Link>
                        </div>

                        <div className={styles.burgerContainer}>
                            <button 
                                className={`${styles.burgerButton} ${isMenuOpen ? styles.open : ''}`} 
                                onClick={toggleMenu}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </>
                )}

                <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                    <div className={styles.mobileMenuHeader}>
                        <Link to="/" className={styles.mobileLogoContainer} onClick={() => setIsMenuOpen(false)}>
                            <div className={styles.mobileLogoWrapper}>
                                <img src={foot} alt='СКАН' className={styles.mobileLogo} />
                            </div>
                        </Link>
                        <button 
                            className={`${styles.burgerButton} ${styles.mobileCloseButton} ${isMenuOpen ? styles.open : ''}`} 
                            onClick={toggleMenu}
                        >
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                    <nav className={styles.mobileNav}>
                        <ul className={styles.mobileNavList}>
                            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link></li>
                            <li><Link to="/tariffs" onClick={() => setIsMenuOpen(false)}>Тарифы</Link></li>
                            <li><Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link></li>
                        </ul>
                    </nav>

                    {isAuthenticated ? (
                        <div className={styles.mobileAuthSection}>
                            <div className={styles.mobileLimitInfo}>
                                <span>Использовано компаний: {userData?.usedCompanyCount || 0}</span>
                                <span>Лимит по компаниям: {userData?.companyLimit || 0}</span>
                            </div>
                            <button 
                                className={styles.mobileLogoutButton} 
                                onClick={() => {
                                    onLogout();
                                    setIsMenuOpen(false);
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <div className={styles.mobileAuthSection}>
                            <Link 
                                to="/register" 
                                className={styles.mobileRegisterLink} 
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Зарегистрироваться
                            </Link>
                            <Link 
                                to="/login" 
                                className={styles.mobileLoginButton} 
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Войти
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
