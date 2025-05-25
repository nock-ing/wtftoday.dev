"use client"

import React from "react"
import { ArrowRight, Github, Mail, Calendar, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    completed: boolean
}

export function WelcomeOnboarding() {
    const [currentStep, setCurrentStep] = React.useState(0)
    const [githubToken, setGithubToken] = React.useState("")
    const [email, setEmail] = React.useState("")

    const [steps, setSteps] = React.useState<OnboardingStep[]>([
        {
            id: "github",
            title: "Connect GitHub",
            description: "Track your PRs and issues",
            icon: <Github className="w-5 h-5" />,
            completed: false,
        },
        {
            id: "email",
            title: "Connect Email",
            description: "Monitor important messages",
            icon: <Mail className="w-5 h-5" />,
            completed: false,
        },
        {
            id: "calendar",
            title: "Connect Calendar",
            description: "See today's meetings",
            icon: <Calendar className="w-5 h-5" />,
            completed: false,
        },
    ])

    const completeStep = (stepId: string) => {
        setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, completed: true } : step)))
    }

    //const allStepsCompleted = steps.every((step) => step.completed)

    return (
        <div className="min-h-screen bg-background text-gray-100 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8">
                {/* Welcome Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <h1 className="text-4xl font-bold text-white">WTF Today</h1>
                    </div>
                    <p className="text-xl text-gray-300">Welcome to your daily dev sanity check</p>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Get a clean, distraction-free briefing of what you need to focus on each morning. Let's set up your
                        integrations to get started.
                    </p>
                </div>

                {/* Setup Steps */}
                <div className="space-y-6">
                    {currentStep === 0 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Github className="w-5 h-5" />
                                    Connect GitHub
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Add your GitHub personal access token to track PRs and issues
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="github-setup" className="text-gray-200">
                                        Personal Access Token
                                    </Label>
                                    <Input
                                        id="github-setup"
                                        type="password"
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        value={githubToken}
                                        onChange={(e) => setGithubToken(e.target.value)}
                                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Generate a token with 'repo' and 'notifications' scopes at{" "}
                                        <span className="text-blue-400">github.com/settings/tokens</span>
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            completeStep("github")
                                            setCurrentStep(1)
                                        }}
                                        disabled={!githubToken}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Connect GitHub
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
                                    >
                                        Skip for now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 1 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Mail className="w-5 h-5" />
                                    Connect Email
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Monitor important emails in your daily brief
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-setup" className="text-gray-200">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email-setup"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            completeStep("email")
                                            setCurrentStep(2)
                                        }}
                                        disabled={!email}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Connect Email
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(2)}
                                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
                                    >
                                        Skip for now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 2 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Calendar className="w-5 h-5" />
                                    Connect Calendar
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    See today's meetings and events in your brief
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            completeStep("calendar")
                                            setCurrentStep(3)
                                        }}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Connect Google Calendar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(3)}
                                        className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
                                    >
                                        Skip for now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 3 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <CardTitle className="text-2xl text-gray-100">You're all set!</CardTitle>
                                <CardDescription className="text-gray-400">Ready to get your first daily briefing</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    Get My Briefing
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center space-x-4">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                step.completed
                                    ? "bg-green-900/30 text-green-400"
                                    : index === currentStep
                                        ? "bg-blue-900/30 text-blue-400"
                                        : "bg-gray-800 text-gray-500"
                            }`}
                        >
                            {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                            <span className="text-sm font-medium">{step.title}</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="text-center pt-8">
                    <p className="text-xs text-gray-500">
                        Made by <span className="text-gray-400 font-medium">nock.ing</span>
                    </p>
                </footer>
            </div>
        </div>
    )
}
