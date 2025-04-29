import React from "react";
import styles from './Footer.module.css';
import logo from '../../assets/footer.png';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <img src={logo} alt="СКАН" className={styles.footerLogo} />
            <div className={styles.footerInfo}>
                <p>г. Москва, Цветной б-р, 40</p>
                <p>+7 495 771 21 11</p>
                <p>info@scan.ru</p>
            </div>
        </footer>
    );
};

export default Footer;
