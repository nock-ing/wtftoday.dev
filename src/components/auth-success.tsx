import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export const AuthSuccess = () => {
    const navigate = useNavigate()
    const { handleAuthCallback } = useAuthStore()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const processAuth = async () => {
            try {
                // Get the code from URL parameters
                const urlObj = new URL(window.location.href)
                const searchParams = new URLSearchParams(urlObj.search)
                const code = searchParams.get('code')

                if (!code) {
                    throw new Error('No authorization code found')
                }

                // Exchange code for token and update session
                await handleAuthCallback(code)

                // Redirect to the dashboard
                navigate('/dashboard', { replace: true })
            } catch (err) {
                console.error('Auth callback error:', err)
                setError('Authentication failed. Please try again.')
            }
        }

        processAuth()
    }, [navigate, handleAuthCallback])


    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-primary text-white rounded"
                >
                    Return to Login
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4">Completing login...</p>
        </div>
    )
}