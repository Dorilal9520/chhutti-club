import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('access');
        const username = localStorage.getItem('username');
        return token && username ? { username } : null;
    });

    const login = async (username, password) => {
        const res = await api.post('/auth/login/', { username, password });
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('username', username);
        setUser({ username });
    };

    const register = async (username, email, password) => {
        await api.post('/auth/register/', { username, email, password });
        await login(username, password);
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}