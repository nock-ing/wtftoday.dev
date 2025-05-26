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

// Debug environment variables
console.log('GitHub Auth Config:', {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID ? 'Set' : 'Not set',
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || 'Not set',
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
            console.log('Generated auth URL:', authUrl);
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
            console.log('[AuthStore] Starting auth callback process with code:', code.substring(0, 5) + '...');

            // Exchange code for token
            console.log('[AuthStore] Exchanging code for token...');
            const token = await githubAuth.exchangeCodeForToken(code);
            console.log('[AuthStore] Received token:', token ? 'Success' : 'Failed');

            if (!token) {
                throw new Error('Failed to obtain access token');
            }

            // Fetch user data
            console.log('[AuthStore] Fetching user data with token...');
            const userData = await githubAuth.fetchUserData(token);
            console.log('[AuthStore] User data received:', !!userData);

            if (!userData || !userData.id) {
                throw new Error('Failed to fetch user data');
            }

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

            console.log('[AuthStore] Setting user and session data');
            set({ user, session });

            // Persist token
            localStorage.setItem('github_auth_token', token);
            console.log('[AuthStore] Token stored in localStorage');

            return;
        } catch (error) {
            console.error('[AuthStore] Auth callback error:', error);
            if (error instanceof Error) {
                console.error('[AuthStore] Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                set({ error: `Authentication failed: ${error.message}` });
            } else {
                set({ error: 'Authentication failed' });
            }
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