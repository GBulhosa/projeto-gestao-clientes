import { createContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import type { Session, User, AuthResponse } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => listener?.subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
