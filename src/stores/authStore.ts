import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;

    // Methods
    login: (provider: 'google') => Promise<string | undefined>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    error: null,

    login: async (provider) => {
        set({ loading: true, error: null });
        try {
            let result;

            if (provider === 'google') {

                const redirectUrl = import.meta.env.VITE_REDIRECT_URL;

                result = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        skipBrowserRedirect: true,
                        redirectTo: redirectUrl,
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent'
                        }
                    }
                });
            }

            if (!result?.data?.url) {
                throw new Error('No auth URL returned');
            }

            // Handle redirect - in actual login component
            // Redirecting happens outside the store
            return result.data.url;
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Authentication failed' });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await supabase.auth.signOut();
            set({ user: null, session: null });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Logout failed' });
        } finally {
            set({ loading: false });
        }
    },

    checkSession: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) throw error;

            set({
                session: data.session,
                user: data.session?.user || null
            });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Session check failed' });
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => set({ error: null })
}));