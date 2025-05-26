import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export const AuthSuccess = () => {
    const navigate = useNavigate()
    const { handleAuthCallback } = useAuthStore()
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<{
        url: string;
        code: string | null;
        hasCode: boolean;
        stage: string;
    }>({
        url: window.location.href,
        code: null,
        hasCode: false,
        stage: 'initializing'
    })

    useEffect(() => {
        const processAuth = async () => {
            try {
                // Get the code from URL parameters
                const urlObj = new URL(window.location.href)
                const searchParams = new URLSearchParams(urlObj.search)
                const code = searchParams.get('code')

                setDebugInfo(prev => ({
                    ...prev,
                    code: code ? `${code.substring(0, 5)}...` : null,
                    hasCode: !!code,
                    stage: 'extracted code'
                }))

                if (!code) {
                    throw new Error('No authorization code found')
                }

                // Exchange code for token and update session
                setDebugInfo(prev => ({ ...prev, stage: 'calling handleAuthCallback' }))
                await handleAuthCallback(code)
                setDebugInfo(prev => ({ ...prev, stage: 'auth callback completed' }))

                // Redirect to the dashboard
                setDebugInfo(prev => ({ ...prev, stage: 'navigating to dashboard' }))
                navigate('/dashboard', { replace: true })
            } catch (err) {
                console.error('Auth callback error:', err)
                setDebugInfo(prev => ({ ...prev, stage: 'error occurred' }))
                setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
                navigate('/login', { replace: true })
            }
        }

        processAuth()
    }, [navigate, handleAuthCallback])

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4 text-center">{error}</div>
                
                <div className="bg-gray-100 p-4 rounded mb-4 w-full max-w-xl overflow-auto text-xs">
                    <h3 className="font-bold mb-2">Debug Information:</h3>
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
                
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
            <div className="mt-4 text-xs text-gray-500">
                Stage: {debugInfo.stage}
            </div>
        </div>
    )
}