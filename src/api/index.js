import { asyncThunkCreator } from "@reduxjs/toolkit";

const API_URL = 'https://gateway.scan-interfax.ru/api/v1';

export const login = async (login, password) => {
    const response = await fetch(`${API_URL}/account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
    });
    return response.json();
};

export const getAccountInfo = async (token) => {
    const response = await fetch(`${API_URL}/account/info`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
};

export const searchHistograms = async (token, params) => {
    const response = await fetch(`${API_URL}/objectsearch/histograms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    });
    return response.json();
};

export const searchPublications = async (token, params) => {
    const response = await fetch(`${API_URL}/objectsearch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    });
    return response.json();
};

export const getDocuments = async (token, ids) => {
    const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
    });
};
