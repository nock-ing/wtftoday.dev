import { create } from 'zustand';
import { createGitHubAuth } from '@/lib/github-auth';

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

interface Session {
    accessToken: string;
    user: User;
}

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;

    // Methods
    login: () => Promise<string | undefined>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    clearError: () => void;
    handleAuthCallback: (code: string) => Promise<void>;
}

// Create GitHub auth instance with config that can be set during app initialization
const githubAuth = createGitHubAuth({
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || '',
});

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: false,
    error: null,

    login: async () => {
        try {
            set({ loading: true, error: null });
            const authUrl = githubAuth.getAuthUrl();
            return authUrl;
        } catch (error) {
            console.error('Login error:', error);
            set({ error: 'Failed to initiate GitHub login' });
            return undefined;
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ user: null, session: null });
        // Clear persisted token from localStorage
        localStorage.removeItem('github_auth_token');
    },

    handleAuthCallback: async (code: string) => {
        try {
            set({ loading: true, error: null });

            // Exchange code for token
            const token = await githubAuth.exchangeCodeForToken(code);

            // Fetch user data
            const userData = await githubAuth.fetchUserData(token);

            const user: User = {
                id: userData.id.toString(),
                name: userData.name || userData.login,
                email: userData.email || '',
                avatarUrl: userData.avatar_url,
            };

            const session: Session = {
                accessToken: token,
                user,
            };

            set({ user, session });

            // Persist token
            localStorage.setItem('github_auth_token', token);

            return;
        } catch (error) {
            console.error('Auth callback error:', error);
            set({ error: 'Authentication failed' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    checkSession: async () => {
        try {
            set({ loading: true });
            const token = localStorage.getItem('github_auth_token');

            if (!token) {
                set({ user: null, session: null });
                return;
            }

            // Validate token and get user data
            const userData = await githubAuth.fetchUserData(token);

            const user: User = {
                id: userData.id.toString(),
                name: userData.name || userData.login,
                email: userData.email || '',
                avatarUrl: userData.avatar_url,
            };

            const session: Session = {
                accessToken: token,
                user,
            };

            set({ user, session });
        } catch (error) {
            console.error('Session check error:', error);
            // Token might be invalid
            localStorage.removeItem('github_auth_token');
            set({ user: null, session: null, error: 'Session expired' });
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => set({ error: null }),
}));