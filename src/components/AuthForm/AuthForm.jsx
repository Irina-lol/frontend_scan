import React, { useState } from "react";
import styles from './AuthForm.module.css';
import { login } from '../../api';
import PropTypes from "prop-types";

const AuthForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [error, setError] = useState('');

    const handleChange =  (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.login || !formData.password) return;

        try {
            const data = await login(formData.login, formData.password);

            if (data.accessToken) {
                onLogin(data.accessToken, data.expire);
            } else {
                setError(data.message || 'Ошибка авторизации');
            }
        } catch (err) {
            setError('Произошла ошибка при подключении к серверу');
            console.error('Ошибка:', err);
        }
    };

    const isFormValid = formData.login && formData.password;

    return (
        <div className={styles.authForm}>
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${styles.active}`}>Войти</button>
                <button className={styles.tab}>Зарегистрироваться</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formGroup}>
                    <label htmlFor="login">Логин</label>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <a href="/forgot-password" className={styles.forgotPassword}>Восстановить пароль</a>

                <button type="submit" className={styles.submitButton} disabled={!isFormValid}>Войти</button>

                <div className={styles.socialAuth}>

                    <p>Войти через:</p>
                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.socialButton}>Google</button>
                        <button type="button" className={styles.socialButton}>Facebook</button>
                        <button type="button" className={styles.socialButton}>Яндекс</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

AuthForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default AuthForm;
