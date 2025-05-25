interface AppConfig {
    github: {
        clientId: string;
        redirectUri: string;
    }
}

// Default values that can be overridden in .env files
export const config: AppConfig = {
    github: {
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
        redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || 'wtftodaydev://auth-success',
    }
};