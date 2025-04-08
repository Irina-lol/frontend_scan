import React from "react";
import Slider from "react-slick";
import Header from '../components/Header/Header';
import styles from './HomePage.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = ({ isAuthenticated, userData, onLogout }) => {
    const features = [
        {
            title: "Мониторинг СМИ",
            description: "Автоматический сбор публикаций о компании из всех значимых источников.",
        },
        {
            title: "Анализ тональности",
            description: "Определяем позитивные, негативные и нейтральные упоминания.",
        },
        {
            title: "Риск-факторы",
            description: "Выявляем потенциальные угрозы для репутации компании.",
        },
        {
            title: "Гибкие тарифы",
            description: "Подписка на нужное колличество компаний и ключевых персон",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const tariffs = [
        {
            name: "Beginner",
            price: "799 p",
            description: "Для малого бизнеса",
            features: ["До 10 компаний", "До 1000 публикаций"],
            isCurrent: userData?.companyLimit === 100,
            color: "var(--light-blue)",
        },
        {
            name: "Pro",
            price: "1 299 p",
            description: "Для среднего бизнеса",
            features: ["До 50 компаний", "До 5000 публикаций"],
            isCurrent: userData?.companyLimit === 1000,
            color: "var(--accent-blue)",
        },
        {
            name: "Business",
            price: "2 499 p",
            description: "Для корпораций",
            features: ["Неограниченное колличество", "Приоритетная поддержка"],
            isCurrent: false,
            color: "var(--primary-color)",
        }
    ];

    return (
        <div className={styles.homePage}>
            <Header isAuthenticated={isAuthenticated} userData={userData} onLogout={onLogout} />

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1>Сервис поиска публикаций о компании по её ИНН</h1>
                    <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту</p>

                    {isAuthenticated && (
                        <button className={styles.requestButton}>Запросить данные</button>
                    )}
                </section>

                <section className={styles.features}>
                    <h2>Почему именно мы</h2>
                    <Slider {...settings}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </Slider>
                </section>

                <section className={styles.tariffs}>
                    <h2>Наши тарифы</h2>
                    <div className={styles.tariffCards}>
                        {tariffs.map((tariff, index) => (
                            <div key={index} className={styles.tariffCard} style={{ borderTop: `4px solid ${tariff.color}` }}>
                                {tariff.isCurrent && <span className={styles.badge}>Текущий тариф</span>}
                                <h3>{tariff.name}</h3>
                                <p className={styles.price}>{tariff.price}</p>
                                <p className={styles.description}>{tariff.description}</p>
                                <ul className={styles.features}>
                                    {tariff.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
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

            <footer className={styles.footer}>
                <p>© 2023 СКАН. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default HomePage;
