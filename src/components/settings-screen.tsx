"use client"

import React from "react"
import { Github, Mail, Calendar, Bell, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export function SettingsScreen() {
    const [githubToken, setGithubToken] = React.useState("")
    const [emailCredentials, setEmailCredentials] = React.useState({ email: "", password: "" })
    const [settings, setSettings] = React.useState({
        showPopups: true,
        prioritizeUrgent: true,
        autoRefresh: false,
        darkMode: true,
    })

    const handleSettingChange = (key: string, value: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="min-h-screen bg-background text-gray-100">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                        <p className="text-sm text-gray-400 mt-1">Configure your integrations and preferences</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <Tabs defaultValue="integrations" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800">
                        <TabsTrigger value="integrations" className="data-[state=active]:bg-gray-800">
                            Integrations
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="data-[state=active]:bg-gray-800">
                            Preferences
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="integrations" className="space-y-6">
                        {/* GitHub Integration */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Github className="w-5 h-5" />
                                    GitHub Integration
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Connect your GitHub account to track PRs and issues
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="github-token" className="text-gray-200">
                                        Personal Access Token
                                    </Label>
                                    <Input
                                        id="github-token"
                                        type="password"
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        value={githubToken}
                                        onChange={(e) => setGithubToken(e.target.value)}
                                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                                    />
                                    <p className="text-xs text-gray-500">Generate a token with 'repo' and 'notifications' scopes</p>
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!githubToken}>
                                    Connect GitHub
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Email Integration */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Mail className="w-5 h-5" />
                                    Email Integration
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Connect your email to track important messages
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-200">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@company.com"
                                            value={emailCredentials.email}
                                            onChange={(e) => setEmailCredentials((prev) => ({ ...prev, email: e.target.value }))}
                                            className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email-password" className="text-gray-200">
                                            App Password
                                        </Label>
                                        <Input
                                            id="email-password"
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={emailCredentials.password}
                                            onChange={(e) => setEmailCredentials((prev) => ({ ...prev, password: e.target.value }))}
                                            className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={!emailCredentials.email || !emailCredentials.password}
                                >
                                    Connect Email
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Calendar Integration */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Calendar className="w-5 h-5" />
                                    Calendar Integration
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Sync with your calendar to see today's events
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100">
                                    Connect Google Calendar
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preferences" className="space-y-6">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Bell className="w-5 h-5" />
                                    Notifications
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Control how and when you receive notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-gray-200">Show popup notifications</Label>
                                        <p className="text-sm text-gray-500">Get notified about urgent items</p>
                                    </div>
                                    <Switch
                                        checked={settings.showPopups}
                                        onCheckedChange={(checked) => handleSettingChange("showPopups", checked)}
                                    />
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-gray-200">Prioritize urgent tasks</Label>
                                        <p className="text-sm text-gray-500">Show urgent items at the top</p>
                                    </div>
                                    <Switch
                                        checked={settings.prioritizeUrgent}
                                        onCheckedChange={(checked) => handleSettingChange("prioritizeUrgent", checked)}
                                    />
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-gray-200">Auto-refresh brief</Label>
                                        <p className="text-sm text-gray-500">Automatically update every 15 minutes</p>
                                    </div>
                                    <Switch
                                        checked={settings.autoRefresh}
                                        onCheckedChange={(checked) => handleSettingChange("autoRefresh", checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-100">
                                    <Zap className="w-5 h-5" />
                                    Performance
                                </CardTitle>
                                <CardDescription className="text-gray-400">Optimize app performance and appearance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-gray-200">Dark mode</Label>
                                        <p className="text-sm text-gray-500">Use dark theme (recommended)</p>
                                    </div>
                                    <Switch
                                        checked={settings.darkMode}
                                        onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-gray-900/30 mt-12">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <p className="text-xs text-gray-500 text-center">
                        Made by <span className="text-gray-400 font-medium">nock.ing</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}
