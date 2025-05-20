import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './HomePage.module.css';
import homePhoto from '../assets/home.jpg';
import footerLogo from '../assets/footer.png';
import timeIcon from '../assets/time.png';
import searchIcon from '../assets/search.png';
import shieldIcon from '../assets/shield.png';
import illustration from '../assets/people.png'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function SampleNextArrow(props) {
    const { className, style, onclick } = props;
    return (
        <div className={className} style={{ ...style, display: "block" }} onClick={onclick}></div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div className={className} style={{ ...style, display: "block" }} onClick={onClick}></div>
    )
}

const HomePage = ({ isAuthenticated, userData = {homePage}, onLogout }) => {
    const features = [
        {
            icon: timeIcon,
            description: "Высокая и оперативная скорость обработки заявки",
        },
        {
            icon: searchIcon,
            description: "Огромная комплексная база данных, обеспечивающая объуктивный ответ на запрос",
        },
        {
            icon: shieldIcon,
            description: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    dots: true,
                },
            },
        ],
    };

    const safeUserData = userData?.eventFiltersInfo || {};

    const tariffs = [
        {
            name: "Beginner",
            description: "Для небольшого иследования",
            price: "799 ₽",
            oldPrice: "1 200 ₽",
            features: ["Безлимитная история запросов", "Безопасная сделка", "Поддержка 24/7"],
            isCurrent: safeUserData?.companyLimit === 100,
            color: "var(--accent-orange)",
        },
        {
            name: "Pro",
            description: "Для HR и фрилансеров",
            price: "1 299 ₽",
            oldPrice: "2 600 ₽",
            features: ["Все пункты тарифа Beginner", "Экспорт истории", "Рекомендации по приоритетам"],
            isCurrent: safeUserData?.companyLimit === 1000,
            color: "var(--light-blue)",
        },
        {
            name: "Business",
            description: "Для корпоративных клиентов",
            price: "2 379 ₽",
            oldPrice: "3 700 ₽",
            features: ["Все пункты тарифа Pro", "Безлимитное количество запросов", "Приоритетная поддержка"],
            isCurrent: false,
            color: "var(--black)",
        }
    ];

    return (
        <div className={styles.homePage}>
            <Header isAuthenticated={isAuthenticated} userData={userData} onLogout={onLogout} />

            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}> 
                        <h1>Сервис по поиску публикаций о компании по его ИНН</h1>
                        <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту</p>

                        {isAuthenticated && (
                            <Link to="/search" className={styles.requestButton}>Запросить данные</Link>
                        )}
                    </div>

                    <img src={homePhoto} alt="Home" className={styles.homePhoto} />
                </section>

                <section className={styles.features}>
                    <h2>Почему именно мы</h2>
                    <Slider {...settings}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <img src={feature.icon} alt='Иконки' className={styles.featureIcon} />
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </Slider>
                </section>

                <section className={styles.illustrationSection}>
                    <div className={styles.illustrationContainer}>
                        <img src={illustration} alt="Человек" className={styles.illustration}  />
                    </div>
                </section>

                <section className={styles.tariffs}>
                    <h2>Наши тарифы</h2>
                    <div className={styles.tariffCards}>
                        {tariffs.map((tariff, index) => (
                            <div key={index} className={styles.tariffCard} style={{ borderTop: `4px solid ${tariff.color}` }}>
                                {tariff.isCurrent && <span className={styles.badge}>Текущий тариф</span>}
                                <h3>{tariff.name}</h3>
                                <p className={styles.price} data-old-price={tariff.oldPrice}>{tariff.price}</p>
                                <p className={styles.description} style={{ background: tariff.color }}>{tariff.description}</p>
                                <ul className={styles.featuresList}>
                                    {tariff.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <button className={styles.tariffButton} style={{ backgroundColor: tariff.color }}>
                                    {tariff.isCurrent ? "Перейти в личный кабинет" : "Подробнее"}
                                </button>
                            </div>
                        ))}    
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
