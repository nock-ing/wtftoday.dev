import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export const AuthSuccess = () => {
    const navigate = useNavigate()
    const { checkSession } = useAuthStore()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Supabase automatically handles the auth callback
                // with the configuration set in supabase.ts (detectSessionInUrl: true)

                // Check and update our session state
                await checkSession()

                // Redirect to the dashboard or home page
                navigate('/dashboard')
            } catch (err) {
                console.error('Auth callback error:', err)
                setError('Authentication failed. Please try again.')
            }
        }

        handleAuthCallback()
    }, [navigate, checkSession])

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