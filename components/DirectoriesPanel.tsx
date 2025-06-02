"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import {
  Folder,
  FolderOpen,
  Search,
  GitCommit,
  GitPullRequestIcon as GitPush,
  GitPullRequestIcon as GitPull,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
} from "lucide-react"

interface DirectoriesPanelProps {
  theme: "dark" | "light"
  activeFile: string
  setActiveFile: (file: string) => void
  notifications: any[]
  setNotifications: (notifications: any[]) => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  extension?: string
}

export function DirectoriesPanel({
  theme,
  activeFile,
  setActiveFile,
  notifications,
  setNotifications,
}: DirectoriesPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "components"]))
  const [currentBranch, setCurrentBranch] = useState("main")
  const [notificationsCollapsed, setNotificationsCollapsed] = useState(false)

  const [fileTree] = useState<FileNode[]>([
    {
      name: "src",
      type: "folder",
      children: [
        { name: "App.js", type: "file", extension: "js" },
        { name: "index.js", type: "file", extension: "js" },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "Header.jsx", type: "file", extension: "jsx" },
            { name: "Sidebar.jsx", type: "file", extension: "jsx" },
            { name: "Button.jsx", type: "file", extension: "jsx" },
          ],
        },
        {
          name: "styles",
          type: "folder",
          children: [
            { name: "globals.css", type: "file", extension: "css" },
            { name: "components.css", type: "file", extension: "css" },
          ],
        },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "index.html", type: "file", extension: "html" },
        { name: "favicon.ico", type: "file", extension: "ico" },
      ],
    },
    { name: "package.json", type: "file", extension: "json" },
    { name: "README.md", type: "file", extension: "md" },
    { name: ".gitignore", type: "file", extension: "gitignore" },
  ])

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case "js":
      case "jsx":
        return "🟨"
      case "css":
        return "🎨"
      case "html":
        return "🌐"
      case "json":
        return "⚙️"
      case "md":
        return "📝"
      case "ico":
        return "🖼️"
      default:
        return "📄"
    }
  }

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName)
    } else {
      newExpanded.add(folderName)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes
      .filter((node) => searchTerm === "" || node.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((node) => (
        <div key={node.name} style={{ marginLeft: `${depth * 16}px` }}>
          {node.type === "folder" ? (
            <div>
              <div
                className="flex items-center gap-2 py-1 px-2 hover:bg-blue-500/20 cursor-pointer rounded transition-all duration-200 hover:translate-x-0.5"
                onClick={() => toggleFolder(node.name)}
              >
                {expandedFolders.has(node.name) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                {expandedFolders.has(node.name) ? (
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-sm text-white dark:text-white light:text-gray-900 truncate" title={node.name}>
                  {node.name.length > 20 ? `${node.name.substring(0, 20)}...` : node.name}
                </span>
              </div>
              {expandedFolders.has(node.name) && node.children && <div>{renderFileTree(node.children, depth + 1)}</div>}
            </div>
          ) : (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={`flex items-center gap-2 py-1 px-2 hover:bg-blue-500/20 cursor-pointer rounded transition-all duration-200 hover:translate-x-0.5 ${
                    activeFile === node.name ? "bg-blue-500/30 border-l-2 border-blue-400" : ""
                  }`}
                  onClick={() => setActiveFile(node.name)}
                >
                  <span className="text-sm">{getFileIcon(node.extension)}</span>
                  <span className="text-sm text-white dark:text-white light:text-gray-900 truncate" title={node.name}>
                    {node.name.length > 25 ? `${node.name.substring(0, 25)}...` : node.name}
                  </span>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-200">
                <ContextMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </ContextMenuItem>
                <ContextMenuItem className="text-white dark:text-white light:text-gray-900 hover:bg-blue-500/20">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </ContextMenuItem>
                <ContextMenuItem className="text-red-400 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )}
        </div>
      ))
  }

  return (
    <div className="h-full bg-gray-800 dark:bg-gray-800 light:bg-gray-50 border-r border-gray-700 dark:border-gray-700 light:border-gray-200 flex flex-col">
      {/* File Explorer */}
      <div className={`${notificationsCollapsed ? "h-full" : "h-3/5"} flex flex-col`}>
        <div className="p-3 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="pl-8 bg-gray-700 dark:bg-gray-700 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm h-8"
            />
          </div>

          {/* GitHub Toolbar */}
          <div className="flex items-center gap-1 mb-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20 p-1"
            >
              <GitCommit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20 p-1"
            >
              <GitPush className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white dark:text-white light:text-gray-700 hover:bg-blue-500/20 p-1"
            >
              <GitPull className="w-4 h-4" />
            </Button>
            <select
              value={currentBranch}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="ml-auto bg-gray-700 dark:bg-gray-700 light:bg-white border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-xs rounded px-2 py-1"
            >
              <option value="main">main</option>
              <option value="develop">develop</option>
              <option value="feature/ui-update">feature/ui-update</option>
            </select>
          </div>

          {/* Status Bar */}
          <div className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
            <div className="flex items-center justify-between">
              <span>Branch: {currentBranch}</span>
              <span className="text-green-400">Synced 2s ago</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>2 uncommitted changes</span>
              <GitBranch className="w-3 h-3" />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">{renderFileTree(fileTree)}</div>
        </ScrollArea>
      </div>

      {/* Notifications Panel */}
      <div
        className={`${notificationsCollapsed ? "h-0" : "h-2/5"} border-t border-gray-700 dark:border-gray-700 light:border-gray-200 transition-all duration-200`}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white dark:text-white light:text-gray-900">GitHub Activity</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setNotificationsCollapsed(!notificationsCollapsed)}
              className="text-gray-400 hover:text-white p-1"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${notificationsCollapsed ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {!notificationsCollapsed && (
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-2 bg-gray-700/50 dark:bg-gray-700/50 light:bg-gray-100 rounded text-xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <GitCommit className="w-3 h-3 text-blue-400" />
                      <span className="text-white dark:text-white light:text-gray-900 font-medium truncate">
                        {notification.message.length > 50
                          ? `${notification.message.substring(0, 50)}...`
                          : notification.message}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                        {notification.timestamp}
                      </span>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                        View Diff
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
