import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router"
import { useAuthStore } from '@/stores/authStore'
import { Window } from '@tauri-apps/api/window'

export const useDeepLinkAuth = () => {
    const navigate = useNavigate()
    const { handleAuthCallback } = useAuthStore()
    const [isHandlingAuth, setIsHandlingAuth] = useState(false)

    useEffect(() => {
        // Check URL parameters immediately for browser-based auth
        const urlObj = new URL(window.location.href)
        const searchParams = new URLSearchParams(urlObj.search)
        const code = searchParams.get('code')

        console.log('[DeepLinkAuth] Current URL:', window.location.href);
        console.log('[DeepLinkAuth] Has code in URL params:', !!code);

        if (code) {
            setIsHandlingAuth(true)
            console.log('[DeepLinkAuth] Processing auth code from URL params');
            handleAuthCallback(code)
                .then(() => {
                    console.log('[DeepLinkAuth] Auth successful from URL params, navigating to dashboard')
                    navigate('/dashboard', { replace: true })
                })
                .catch(err => {
                    console.error('[DeepLinkAuth] Auth error from URL params:', err)
                    if (err instanceof Error) {
                        console.error('[DeepLinkAuth] Error details:', {
                            message: err.message,
                            stack: err.stack
                        });
                    }
                    navigate('/login', { replace: true })
                })
                .finally(() => setIsHandlingAuth(false))
        }

        // Handle deep links for desktop app
        const handleUrl = async (urls: string[]) => {
            try {
                setIsHandlingAuth(true)
                const url = urls[0]
                console.log('[DeepLinkAuth] Received deep link:', url)

                // For deep links like wtftodaydev://auth-success?code=xyz
                const urlParts = url.split('?')
                let code = null
                
                if (urlParts.length > 1) {
                    const params = new URLSearchParams(urlParts[1])
                    code = params.get('code')
                    console.log('[DeepLinkAuth] Extracted code from deep link:', !!code);
                }
                
                if (code) {
                    console.log('[DeepLinkAuth] Processing auth code from deep link');
                    try {
                        // Focus the current window
                        const currentWindow = Window.getCurrent()
                        await currentWindow.setFocus()
                        await currentWindow.show()
                        
                        // Process the auth code
                        await handleAuthCallback(code)
                        console.log('[DeepLinkAuth] Auth successful from deep link, navigating to dashboard')
                        
                        navigate('/dashboard', { replace: true })
                    } catch (error) {
                        console.error('[DeepLinkAuth] Failed to process auth code from deep link:', error)
                        if (error instanceof Error) {
                            console.error('[DeepLinkAuth] Error details:', {
                                message: error.message,
                                stack: error.stack
                            });
                        }
                        navigate('/login', { replace: true })
                    }
                } else {
                    console.error('[DeepLinkAuth] No code found in deep link')
                    navigate('/login', { replace: true })
                }
            } catch (err) {
                console.error('[DeepLinkAuth] Error handling deep link:', err)
                if (err instanceof Error) {
                    console.error('[DeepLinkAuth] Error details:', {
                        message: err.message,
                        stack: err.stack
                    });
                }
                navigate('/login', { replace: true })
            } finally {
                setIsHandlingAuth(false)
            }
        }

        console.log('[DeepLinkAuth] Setting up deep link handler');
        onOpenUrl(handleUrl)

        // Cleanup function
        return () => {
            // Any cleanup if needed
        }
    }, [navigate, handleAuthCallback])

    return isHandlingAuth
}