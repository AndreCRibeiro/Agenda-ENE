import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
    token: string;
    user: object;
}

interface SignInCredentials {
    email: string;
    password: string;
}

/*interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}*/

interface AuthContextData {
    user: object;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    // signUp(credentials: SignUpCredentials): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@AgendaENE: token');
        const user = localStorage.getItem('@AgendaENE: user');

        if (token && user) {
            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });

    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', {
            email,
            password,
        });

        const { token, user } = response.data;

        localStorage.setItem('@AgendaENE: token', token);
        localStorage.setItem('@AgendaENE: user', JSON.stringify(user));

        setData({ token, user });
    }, []);

    const signOut = useCallback(async () => {
        localStorage.removeItem('@AgendaENE: token');
        localStorage.removeItem('@AgendaENE: user');

        setData({} as AuthState);
    }, [])

    /*const signUp = useCallback(async ({ name, email, password }) => {
        const response = await api.post('sessions', {
            name,
            email,
            password,
        });

        console.log({ response });
    }, []);*/

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}