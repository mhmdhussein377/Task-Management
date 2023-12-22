import {createContext, useContext, useState} from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({children}) => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null
    const [user,
        setUser] = useState(storedUser);

    console.log(user, "useeer")

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem("authToken", token)
    };

    const logout = () => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
            user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context
}
