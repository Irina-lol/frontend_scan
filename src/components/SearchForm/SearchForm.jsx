import React, { useState, useEffect } from "react";
import styles from "./SearchForm.module.css";

const SearchForm = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        inn: '',
        maxFullness: false,
        inBusinessNews: false,
        onlyMainRole: false,
        tonality: 'any',
        onlyWithRiskFactors: false,
        excludeTechNews: false,
        excludeAnnouncements: false,
        excludeDigests: false,
        limit: 1000,
        startDate: '',
        endDate: '',
    });

    const [errors, setErrors] = useState({
        inn: '',
        date: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const isInnValid = /^\d{10,12}$/.test(formData.inn);
        const today = new Date();
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const areDatesValid = !formData.startDate || !formData.endDate || (startDate <= endDate && endDate <= today);

        setErrors({
            inn: formData.inn && !isInnValid ? 'ИНН должен быть 10 или 12 цифр' : '',
            date: !areDatesValid ? 'Укажите корректный диапазон дат (не будущие)' : '',
        });

        return isInnValid && areDatesValid && formData.inn && formData.startDate && formData.endDate;
    };

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onSearch(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.formSection}>
                <div className={styles.formGroup}>
                    <label htmlFor="inn">ИНН компании *</label>
                    <input
                        type="text"
                        id="inn"
                        name="inn"
                        value={formData.inn}
                        onChange={handleChange}
                        placeholder="10 или 12 цифр"
                        className={errors.inn ? styles.inputError : ''}
                        required
                    />
                    {errors.inn && <span className={styles.error}>{errors.inn}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>Тональность</label>
                    <select
                        name="tonality"
                        value={formData.tonality}
                        onChange={handleChange}
                    >
                        <option value="any">Любая</option>
                        <option value="positive">Позитивная</option>
                        <option value="negative">Негативная</option>
                    </select>  
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="limit">Количество документов в выдаче</label>
                    <input
                        type="number"
                        id="limit"
                        name="limit"
                        min="1"
                        max="1000"
                        value={formData.limit}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.dateRange}>
                    <label>Диапазон дат *</label>
                    <div className={styles.dateInputs}>
                        <input
                            type="date"
                            name="startDate"
                            max={new Date().toISOString().split('T')[0]}
                            value={formData.startDate}
                            onChange={handleChange}
                            className={errors.date ? styles.inputError : ''}
                            required
                        />
                        <input
                            type="date"
                            name="endDate"
                            max={new Date().toISOString().split('T')[0]}
                            value={formData.endDate}
                            onChange={handleChange}
                            className={errors.date ? styles.inputError : ''}
                            required
                        />
                    </div>
                    {errors.date && <span className={styles.error}>{errors.date}</span>}
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.checkboxGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="maxFullness"
                            checked={formData.maxFullness}
                            onChange={handleChange}
                        />
                        Признак максимальной полноты
                    </label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="inBusinessNews"
                            checked={formData.inBusinessNews}
                            onChange={handleChange}
                        />
                        Упоминания в бизнес контексте
                    </label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="onlyMainRole"
                            checked={formData.onlyMainRole}
                            onChange={handleChange}
                        />
                        Главная роль публикации
                    </label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="onlyWithRiskFactors"
                            checked={formData.onlyWithRiskFactors}
                            onChange={handleChange}
                        />
                        Только с риск-факторами
                    </label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="excludeTechNews"
                            checked={formData.excludeTechNews}
                            onChange={handleChange}
                        />
                        Исключать технические новости
                    </label>
                </div>

                <div className={styles.submitArea}>
                    <button 
                        type="submit"
                        className={styles.submitButton}
                        disabled={!isFormValid}
                    >
                        Поиск
                    </button>
                    <p className={styles.description}>* Обязательные к заполнению поля</p>
                </div>
            </div>
        </form>
    );
};

export default SearchForm;
