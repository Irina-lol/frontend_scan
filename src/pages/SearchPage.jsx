import React, { useState } from 'react';
import Header from '../components/Header/Header';
import SearchForm from '../components/SearchForm/SearchForm';
import Results from '../components/Results/Results';
import styles from './SearchPage.module.css';

const SearchPage = ({ isAuthenticated, userData, onLogout }) => {
    const [searchData, setSearchData] = useState(null);

    const handleSearch = (data) => {
        setSearchData(data);
    };

    return (
        <div className={styles.searchPage}>
            <Header isAuthenticated={isAuthenticated} userData={userData} onLogout={onLogout} />
      
            <main className={styles.main}>
                <h1>Поиск публикаций</h1>
                {!searchData ? (
                    <SearchForm onSearch={handleSearch} />
                ) : (
                    <Results searchData={searchData} />
                )}
            </main>
        </div>
    );
};

export default SearchPage;
