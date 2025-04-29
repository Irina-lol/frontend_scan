import React, { useState } from 'react';
import Header from '../components/Header/Header';
import SearchForm from '../components/SearchForm/SearchForm';
import Results from '../components/Results/Results';
import Footer from '../components/Footer/Footer';
import styles from './SearchPage.module.css';
import { Navigate } from 'react-router-dom';
import illustration1 from '../assets/doc.png';
import illustration2 from '../assets/humans.png';
import footerLogo from '../assets/footer.png';

const SearchPage = ({ userData, onLogout, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    const [searchData, setSearchData] = useState(null);

    const handleSearch = (data) => {
        setSearchData(data);
    };

    const handleNewSearch = () => {
        setSearchData(null);
    }

    return (
        <div className={styles.searchPage}>
            <Header isAuthenticated={isAuthenticated} userData={userData} onLogout={onLogout} />
      
            <main className={styles.main}>
                {!searchData ? (
                    <div className={styles.serachContainer}>
                        <div className={styles.textContent}>
                            <h1>Найдите необходимые данные в пару кликов.</h1>
                            <p>Задайте параметры поиска. Чем больше заполните, тем точнее поиск</p>
                            <SearchForm onSearch={handleSearch} />
                        </div>
                        <div className={styles.illustrations}>
                            <img src={illustration1} alt="Иллюстрация документы" className={styles.illustration} />
                            <img src={illustration2} alt="Иллюстрация человек" className={styles.illustration} />
                        </div>
                    </div>
                ) : (
                    <>
                        <Results searchData={searchData} />
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default SearchPage;
