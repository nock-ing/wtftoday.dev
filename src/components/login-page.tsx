import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from "@/stores/authStore.ts";
import { Github } from 'lucide-react'
import { open } from '@tauri-apps/plugin-shell';

export const LoginPage = () => {
    const { login, error: storeError, clearError } = useAuthStore()
    const [error, setError] = useState('')


    const handleGitHubLogin = async () => {
        try {
            clearError();
            const url = await login();

            if (!url) throw new Error('No auth URL returned');

            // Open URL in default browser
            await open(url);
        } catch (err) {
            setError('Failed to login with GitHub.');
            console.error(err);
        }
    };

    const displayError = error || storeError;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="mb-8">
                <img src="/logo_no_bg.png" alt="Logo" className="w-32 h-32" />
            </div>
            <p className="text-lg mb-8 text-muted-foreground">Focus starts here.</p>
            {displayError && <p className="text-sm text-destructive mb-4">{displayError}</p>}
            <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-2 min-w-[240px]"
                onClick={handleGitHubLogin}
            >
                <Github className="h-5 w-5" />
                Continue with GitHub
            </Button>
            <div className="mt-6 max-w-[240px] w-full">
                <div className="h-px bg-border mb-6" />
                <p className="text-xs text-muted-foreground/80 text-center">
                    Data is stored locally on your computer. Read more in our{' '}
                    <a
                        className="text-primary underline"
                        href="https://github.com/JohnKrampe/wtf-today/blob/main/README.md">
                        README
                    </a>
                </p>
            </div>
        </div>
    )
}