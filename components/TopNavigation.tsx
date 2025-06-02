"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Github,
  Figma,
  Rocket,
  Plus,
  FolderPlus,
  Save,
  Undo,
  Redo,
  Share,
  Search,
  Bell,
  Settings,
  Sun,
  Moon,
  Users,
  LogOut,
  User,
  Keyboard,
  Code,
} from "lucide-react"

interface TopNavigationProps {
  theme: "dark" | "light"
  toggleTheme: () => void
  workspaceName: string
  setWorkspaceName: (name: string) => void
  notifications: any[]
  setNotifications: (notifications: any[]) => void
}

export function TopNavigation({
  theme,
  toggleTheme,
  workspaceName,
  setWorkspaceName,
  notifications,
  setNotifications,
}: TopNavigationProps) {
  const [githubConnected, setGithubConnected] = useState(false)
  const [figmaConnected, setFigmaConnected] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <nav className="h-12 bg-black/85 dark:bg-black/85 light:bg-white border-b border-gray-700 dark:border-gray-700 light:border-gray-200 flex items-center px-4 backdrop-blur-sm">
      {/* Left Section - Logo & Workspace Name */}
      <div className="flex items-center gap-4 w-1/5">
        <div className="flex items-center gap-2">
          <Code className="w-8 h-8 text-blue-500" />
          <span className="font-bold text-white dark:text-white light:text-gray-900 text-lg">CollabCodeAI</span>
        </div>
        <Input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm max-w-48"
          maxLength={50}
        />
      </div>

      {/* Center Section - Integrations & Actions */}
      <div className="flex items-center justify-center gap-2 w-3/5">
        {/* GitHub Integration */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
              <div className={`w-2 h-2 rounded-full ml-2 ${githubConnected ? "bg-green-500" : "bg-red-500"}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200">
            <DropdownMenuItem
              onClick={() => setGithubConnected(!githubConnected)}
              className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20"
            >
              {githubConnected ? "Disconnect" : "Connect"} GitHub
            </DropdownMenuItem>
            {githubConnected && (
              <>
                <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                  Select Repository
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                  View on GitHub
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Figma Integration */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
            >
              <Figma className="w-5 h-5 mr-2" />
              Figma
              <div className={`w-2 h-2 rounded-full ml-2 ${figmaConnected ? "bg-green-500" : "bg-red-500"}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200">
            <DropdownMenuItem
              onClick={() => setFigmaConnected(!figmaConnected)}
              className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20"
            >
              {figmaConnected ? "Disconnect" : "Link"} Figma Project
            </DropdownMenuItem>
            {figmaConnected && (
              <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                View Linked Designs
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Publish */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Publish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-white dark:text-white light:text-gray-900">Deploy Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600">Platform</label>
                <select className="w-full mt-1 bg-gray-700 dark:bg-gray-700 light:bg-gray-100 border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-900 rounded px-3 py-2">
                  <option>Vercel</option>
                  <option>Netlify</option>
                </select>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Deploy Now</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Workspace Actions */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20 ${autoSave ? "bg-green-500/20" : ""}`}
            onClick={() => setAutoSave(!autoSave)}
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Section - Search, Notifications, User */}
      <div className="flex items-center gap-3 w-1/5 justify-end">
        {/* Search */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20"
            >
              <Search className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-white dark:text-white light:text-gray-900">Search Workspace</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Search files, commits, chats..."
              className="bg-gray-700 dark:bg-gray-700 light:bg-gray-100 border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-900"
            />
          </DialogContent>
        </Dialog>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20 relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200 w-80">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white dark:text-white light:text-gray-900 font-medium">Notifications</span>
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-blue-400 hover:text-blue-300">
                  Mark all read
                </Button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-2 rounded ${notification.read ? "opacity-60" : ""}`}>
                    <p className="text-white dark:text-white light:text-gray-900 text-sm">{notification.message}</p>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs">
                      {notification.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200">
            <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={toggleTheme}
              className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {theme === "dark" ? "Light" : "Dark"} Theme
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
              <Keyboard className="w-4 h-4 mr-2" />
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
              <Users className="w-4 h-4 mr-2" />
              Invite Team
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600 dark:bg-gray-600 light:bg-gray-200" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
