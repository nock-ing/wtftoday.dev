"use client"

import React from "react"
import { RefreshCw, GitPullRequest, MessageSquare, Calendar, Mail, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BriefItem {
    id: string
    title: string
    subtitle?: string
    status: "unread" | "urgent" | "blocked" | "normal"
    time?: string
    url?: string
}

interface BriefSection {
    title: string
    icon: React.ReactNode
    items: BriefItem[]
    count: number
}

const mockData: BriefSection[] = [
    {
        title: "Assigned PRs",
        icon: <GitPullRequest className="w-4 h-4" />,
        count: 3,
        items: [
            {
                id: "1",
                title: "Fix authentication bug in login flow",
                subtitle: "user-service",
                status: "urgent",
                time: "2h ago",
            },
            {
                id: "2",
                title: "Add TypeScript support to config parser",
                subtitle: "core-lib",
                status: "normal",
                time: "1d ago",
            },
            { id: "3", title: "Update documentation for API endpoints", subtitle: "docs", status: "blocked", time: "3d ago" },
        ],
    },
    {
        title: "Mentioned Issues",
        icon: <MessageSquare className="w-4 h-4" />,
        count: 2,
        items: [
            {
                id: "4",
                title: "Performance regression in data processing",
                subtitle: "#1247 • high priority",
                status: "urgent",
                time: "4h ago",
            },
            {
                id: "5",
                title: "Feature request: Dark mode toggle",
                subtitle: "#1251 • enhancement",
                status: "unread",
                time: "1d ago",
            },
        ],
    },
    {
        title: "Today's Calendar",
        icon: <Calendar className="w-4 h-4" />,
        count: 4,
        items: [
            { id: "6", title: "Sprint Planning", subtitle: "10:00 AM - 11:00 AM", status: "normal", time: "in 2h" },
            { id: "7", title: "Code Review Session", subtitle: "2:00 PM - 3:00 PM", status: "normal", time: "in 6h" },
            { id: "8", title: "Team Standup", subtitle: "9:00 AM - 9:30 AM", status: "normal", time: "in 1h" },
            { id: "9", title: "1:1 with Sarah", subtitle: "4:00 PM - 4:30 PM", status: "normal", time: "in 8h" },
        ],
    },
    {
        title: "Important Emails",
        icon: <Mail className="w-4 h-4" />,
        count: 1,
        items: [
            {
                id: "10",
                title: "Security update required for production",
                subtitle: "DevOps Team",
                status: "urgent",
                time: "1h ago",
            },
        ],
    },
]

const StatusIndicator = ({ status }: { status: BriefItem["status"] }) => {
    switch (status) {
        case "urgent":
            return <div className="w-2 h-2 bg-red-500 rounded-full" />
        case "unread":
            return <div className="w-2 h-2 bg-blue-500 rounded-full" />
        case "blocked":
            return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        default:
            return <div className="w-2 h-2 bg-gray-600 rounded-full" />
    }
}

const BriefCard = ({ item }: { item: BriefItem }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer group">
        <StatusIndicator status={item.status} />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-100 truncate group-hover:text-white">{item.title}</p>
            {item.subtitle && <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>}
        </div>
        {item.time && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
        <Clock className="w-3 h-3" />
                {item.time}
      </span>
        )}
    </div>
)

export function DailyBriefDashboard() {
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background text-gray-100">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">WTF Today</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            variant="outline"
                            size="sm"
                            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh Brief
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockData.map((section) => (
                        <Card key={section.title} className="bg-gray-900 border-gray-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-lg">
                                    <div className="flex items-center gap-2 text-gray-100">
                                        {section.icon}
                                        {section.title}
                                    </div>
                                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                                        {section.count}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-1">
                                    {section.items.length > 0 ? (
                                        section.items.map((item) => <BriefCard key={item.id} item={item} />)
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-sm">All caught up!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-gray-900/30 mt-12">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <p className="text-xs text-gray-500 text-center">
                        Made by <span className="text-gray-400 font-medium">nock.ing</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}
