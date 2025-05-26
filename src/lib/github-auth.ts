import { invoke } from '@tauri-apps/api/core';

interface GitHubAuthConfig {
    clientId: string;
    redirectUri: string;
}

export class GitHubAuth {
    private clientId: string;
    private redirectUri: string;

    constructor(config: GitHubAuthConfig) {
        this.clientId = config.clientId;
        this.redirectUri = config.redirectUri;
    }

    getAuthUrl(): string {
        const scope = 'user:email,read:user';
        return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${scope}`;
    }

    async exchangeCodeForToken(code: string): Promise<string> {
        // This should be handled server-side or in a Tauri command to protect client secret
        // For self-hosting, we'll implement a Tauri command that securely handles this exchange
        return await invoke('exchange_github_code', { code }) as string;
    }

    async fetchUserData(token: string): Promise<any> {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${token}`,
            }
        });
        return response.json();
    }
}

// Create a configurable instance that can be used throughout the app
export const createGitHubAuth = (config: GitHubAuthConfig) => new GitHubAuth(config);