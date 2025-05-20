import React from "react";
import styles from './Footer.module.css';
import logo from '../../assets/footer.png';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerLogoContainer}>
                    <img src={logo} alt="Логотип" className={styles.footerLogo} />
                </div>
                <div className={styles.footerRightSection}>
                    <div className={styles.footerInfo}>
                        <p>г. Москва, Цветной б-р, 40</p>
                        <p>Телефон: +7 (123) 456-78-90</p>
                        <p>Email: info@example.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
