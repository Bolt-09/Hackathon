"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { File, Save, Download, Code, Github, Figma, Moon, Sun, Settings, GitBranch } from "lucide-react"

interface HeaderProps {
  activeFile: string
  setActiveFile: (file: string) => void
  language: string
  setLanguage: (lang: string) => void
  gitStatus: string
}

export function Header({ activeFile, setActiveFile, language, setLanguage, gitStatus }: HeaderProps) {
  const [projectName, setProjectName] = useState("My Awesome App")
  const [isGitHubConnected, setIsGitHubConnected] = useState(false)
  const [userRole, setUserRole] = useState<"Editor" | "Viewer">("Editor")
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <header className="h-15 bg-black border-b border-gray-700 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">CollabCode</h1>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            Beta
          </Badge>
        </div>

        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-48 bg-gray-800 border-gray-600 text-white"
          placeholder="Project name"
        />
      </div>

      {/* Center Section - Menus */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500">
              <File className="w-4 h-4 mr-2" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600">
            <DropdownMenuItem className="text-white hover:bg-blue-500">
              <File className="w-4 h-4 mr-2" />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-blue-500">
              <Save className="w-4 h-4 mr-2" />
              Save
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-blue-500">
              <Download className="w-4 h-4 mr-2" />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500">
              <Code className="w-4 h-4 mr-2" />
              {language}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600">
            <DropdownMenuItem className="text-white hover:bg-blue-500" onClick={() => setLanguage("javascript")}>
              JavaScript
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-blue-500" onClick={() => setLanguage("python")}>
              Python
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-blue-500" onClick={() => setLanguage("html")}>
              HTML/CSS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500">
              <Settings className="w-4 h-4 mr-2" />
              Integrations
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600">
            <DropdownMenuItem className="text-white hover:bg-blue-500">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-blue-500">
              <Figma className="w-4 h-4 mr-2" />
              Figma
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <GitBranch className="w-4 h-4" />
          <span>{gitStatus}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${userRole === "Editor" ? "bg-purple-500 border-purple-500" : "bg-gray-600 border-gray-600"} text-white`}
            >
              {userRole}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600">
            <DropdownMenuItem className="text-white hover:bg-purple-500" onClick={() => setUserRole("Editor")}>
              Editor
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-purple-500" onClick={() => setUserRole("Viewer")}>
              Viewer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-white hover:bg-blue-500"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {!isGitHubConnected ? (
          <Button onClick={() => setIsGitHubConnected(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Github className="w-4 h-4 mr-2" />
            Sign in with GitHub
          </Button>
        ) : (
          <Avatar className="w-8 h-8 border-2 border-blue-500">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  )
}
