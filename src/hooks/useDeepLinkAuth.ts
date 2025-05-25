import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router"
import { useAuthStore } from '@/stores/authStore'

export const useDeepLinkAuth = () => {
    const navigate = useNavigate()
    const { handleAuthCallback } = useAuthStore()
    const [isHandlingAuth, setIsHandlingAuth] = useState(false)

    useEffect(() => {
        // Check URL parameters immediately for browser-based auth
        const urlObj = new URL(window.location.href)
        const searchParams = new URLSearchParams(urlObj.search)
        const code = searchParams.get('code')

        if (code) {
            setIsHandlingAuth(true)
            handleAuthCallback(code)
                .then(() => {
                    console.log('Auth successful, navigating to dashboard')
                    navigate('/dashboard', { replace: true })
                })
                .catch(err => console.error('Auth error:', err))
                .finally(() => setIsHandlingAuth(false))
        }

        // Handle deep links for desktop app
        const handleUrl = async (urls: string[]) => {
            try {
                setIsHandlingAuth(true)
                const url = urls[0]
                console.log('Received deep link:', url)

                const urlObj = new URL(url)
                const searchParams = new URLSearchParams(urlObj.search.substring(1))

                const code = searchParams.get('code')
                if (code) {
                    console.log('Found code in deep link, processing auth')
                    await handleAuthCallback(code)
                    console.log('Auth successful via deep link, navigating to dashboard')
                    navigate('/dashboard', { replace: true })
                    return
                }
            } catch (err) {
                console.error('Error handling deep link:', err)
            } finally {
                setIsHandlingAuth(false)
            }
        }

        onOpenUrl(handleUrl)
    }, [navigate, handleAuthCallback])

    return isHandlingAuth
}