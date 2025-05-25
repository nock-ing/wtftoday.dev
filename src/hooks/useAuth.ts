import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

export const useAuth = () => {
    const {
        user,
        session,
        loading,
        error,
        login,
        logout,
        checkSession,
        clearError
    } = useAuthStore()

    // Check session on component mount
    useEffect(() => {
        if (!user && !loading) {
            checkSession()
        }
    }, [user, loading, checkSession])

    return {
        user,
        session,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        clearError
    }
}