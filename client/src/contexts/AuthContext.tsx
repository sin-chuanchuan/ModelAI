import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

interface User {
    id: string;
    phone: string;
    contact_name?: string;
    company_name?: string;
    balance?: number;
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If token exists, fetch user profile
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                logout(); // Token invalid
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // User will be fetched by effect
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
