import React from "react";
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'? checked : value,
        }));

        if (name === 'inn') {
            setErrors(prev => ({
                ...prev,
                inn: value && !/^\d{10,12}$/.test(value) ? 'ИНН должен быть 10 или 12 цифр' : '',
            }));
        }
    };

    const validateForm = () => {
        const isInnValid = /^\d{10,12}$/.test(formData.inn);
        const today = new Date();
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate)
        const areDatesValid = startDate <= endDate && endDate <= today;

        setErrors({
            inn: isInnValid? '' : 'ИНН должен быть 10 или 12 цифрами',
            date: areDatesValid ? '' : 'Укажите корректный диапозон дат (не будущие)',
        });
        
        return isInnValid && areDatesValid && formData.startDate && formData.endDate;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSearch(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.formGroup}>
                <label htmlFor="inn">
                    ИНН компании *
                    {errors.inn && <span className={styles.error}>{errors.inn}</span>}
                </label>
                <input
                    type="text"
                    id="inn"
                    name="inn"
                    value={formData.inn}
                    onChange={handleChange}
                    placeholder="10 или 12 цифр"
                    className={errors.inn ? styles.inputError : ''}
                />
            </div>

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

            <div className={styles.formGroup}>
                <label>Тональность *</label>
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

            <div className={styles.formGroup}>
                <label htmlFor="limit">Колличество докуиентов в выдаче *</label>
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
                {errors.date && <span className={styles.error}>{errors.date}</span>}
                <div className={styles.dateInputs}>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={errors.date ? styles.inputError : ''}
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={errors.date ? styles.inputError : ''}
                    />
                </div>
            </div>

            <button 
                type="submit"
                className={styles.submitButton}
                disabled={!formData.inn || !formData.startDate || !formData.endDate || errors.inn || errors.date}
            >
                Поиск
            </button>
        </form>
    );
};

export default SearchForm;
