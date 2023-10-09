import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialAuth = JSON.parse(localStorage.getItem('auth')) || {};
    const [auth, setAuth] = useState(initialAuth);

    const updateAuth = (newAuth) => {
        setAuth(newAuth);
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;