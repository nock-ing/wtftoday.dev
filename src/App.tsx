import { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { LoginPage } from '@/components/login-page'
import { AuthSuccess } from '@/components/auth-success'
import { DailyBriefDashboard } from '@/components/daily-brief-dashboard'
import { SettingsScreen } from '@/components/settings-screen'
import { WelcomeOnboarding } from '@/components/welcome-onboarding'
import './App.css'

function App() {
    const { user, loading, checkSession } = useAuthStore()

    useEffect(() => {
        // Check for existing session on app startup
        checkSession()
    }, [checkSession])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/onboarding" element={user ? <WelcomeOnboarding /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <DailyBriefDashboard /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <SettingsScreen /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<div>Page not found. <a href="/">Go home</a></div>} />
        </Routes>
    )
}

export default App