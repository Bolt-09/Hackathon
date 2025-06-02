"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Folder, FolderOpen, Plus, GitCommit, Download, GitBranch, History, Trash2 } from "lucide-react"

interface FileExplorerProps {
  activeFile: string
  setActiveFile: (file: string) => void
  onFileCreate: (name: string) => void
  onFileDelete: (name: string) => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  extension?: string
}

export function FileExplorer({ activeFile, setActiveFile, onFileCreate, onFileDelete }: FileExplorerProps) {
  const [files] = useState<FileNode[]>([
    {
      name: "src",
      type: "folder",
      children: [
        { name: "app.js", type: "file", extension: "js" },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "TodoList.jsx", type: "file", extension: "jsx" },
            { name: "Button.jsx", type: "file", extension: "jsx" },
          ],
        },
        { name: "styles.css", type: "file", extension: "css" },
      ],
    },
    { name: "package.json", type: "file", extension: "json" },
    { name: "README.md", type: "file", extension: "md" },
  ])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]))
  const [newFileName, setNewFileName] = useState("")
  const [showNewFileInput, setShowNewFileInput] = useState(false)
  const [commitHistory] = useState([
    { id: "1", message: "Initial commit", time: "2 min ago", author: "John Doe" },
    { id: "2", message: "Add todo functionality", time: "5 min ago", author: "Jane Smith" },
    { id: "3", message: "Update styling", time: "10 min ago", author: "John Doe" },
  ])

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName)
    } else {
      newExpanded.add(folderName)
    }
    setExpandedFolders(newExpanded)
  }

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case "js":
      case "jsx":
        return "🟨"
      case "css":
        return "🎨"
      case "json":
        return "⚙️"
      case "md":
        return "📝"
      default:
        return "📄"
    }
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.name} style={{ marginLeft: `${depth * 16}px` }}>
        {node.type === "folder" ? (
          <div>
            <div
              className="flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer rounded"
              onClick={() => toggleFolder(node.name)}
            >
              {expandedFolders.has(node.name) ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-sm text-white">{node.name}</span>
            </div>
            {expandedFolders.has(node.name) && node.children && <div>{renderFileTree(node.children, depth + 1)}</div>}
          </div>
        ) : (
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer rounded ${
                  activeFile === node.name ? "bg-blue-500 border-l-2 border-blue-400" : ""
                }`}
                onClick={() => setActiveFile(node.name)}
              >
                <span className="text-sm">{getFileIcon(node.extension)}</span>
                <span className="text-sm text-white">{node.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-gray-800 border-gray-600">
              <ContextMenuItem className="text-white hover:bg-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
      </div>
    ))
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName)
      setNewFileName("")
      setShowNewFileInput(false)
    }
  }

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* File Operations */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            onClick={() => setShowNewFileInput(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-blue-500">
            <GitCommit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-blue-500">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {showNewFileInput && (
          <div className="flex gap-2 mb-2">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.js"
              className="bg-gray-700 border-gray-600 text-white text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleCreateFile()}
            />
            <Button size="sm" onClick={handleCreateFile} className="bg-green-500 hover:bg-green-600">
              ✓
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <select className="bg-gray-700 border-gray-600 text-white text-sm rounded px-2 py-1 flex-1">
            <option>main</option>
            <option>develop</option>
            <option>feature/new-ui</option>
          </select>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">{renderFileTree(files)}</div>
      </ScrollArea>

      {/* Commit History */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Recent Commits</span>
        </div>
        <ScrollArea className="max-h-32">
          <div className="space-y-1">
            {commitHistory.map((commit) => (
              <div key={commit.id} className="text-xs text-gray-300 p-1 hover:bg-gray-700 rounded">
                <div className="font-medium truncate">{commit.message}</div>
                <div className="text-gray-500">
                  {commit.time} • {commit.author}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
