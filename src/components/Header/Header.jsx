import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';

const Header = ({ isAuthenticated, useData, onLogout }) => {
    return (
        <header className={styles.header}>
            <div className={styles.conteiner}>
                <div className={styles.logoConteiner}>
                    <img src={logo} alt="СКАН" className={styles.logo} />
                </div>
            

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li><a href="/"></a>Главная</li>
                        <li><a href="/tariffs">Тарифы</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </nav>

                {isAuthenticated ? (
                    <div className={styles.userPanel}>
                        <div className={styles.limitInfo}>
                            <span>Использовано компаний: {userData.usedCompanyCount}</span>
                            <span>Лимит по компаниям: {userData.companyLimit}</span>
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{userData.name}</span>
                            <button className={styles.logoutBotton} onClick={onLogout}>Выйти</button>
                     </div>
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <a href="/register" className={styles.registrLink}>Зарегистрироваться</a>
                        <a href="/login" className={styles.loginButton}>Выйти</a>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
