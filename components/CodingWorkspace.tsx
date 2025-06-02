"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { CodeEditor } from "@/components/CodeEditor"
import { PreviewPane } from "@/components/PreviewPane"
import { Terminal } from "@/components/Terminal"
import { Code, Eye, Play, X, Plus, Monitor, Smartphone, Tablet } from "lucide-react"

interface CodingWorkspaceProps {
  theme: "dark" | "light"
  activeFile: string
  setActiveFile: (file: string) => void
}

export function CodingWorkspace({ theme, activeFile, setActiveFile }: CodingWorkspaceProps) {
  const [mode, setMode] = useState<"code" | "preview">("code")
  const [openTabs, setOpenTabs] = useState([
    { name: "App.js", language: "javascript", unsaved: false },
    { name: "Header.jsx", language: "javascript", unsaved: true },
    { name: "styles.css", language: "css", unsaved: false },
  ])
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const closeTab = (tabName: string) => {
    setOpenTabs(openTabs.filter((tab) => tab.name !== tabName))
    if (activeFile === tabName && openTabs.length > 1) {
      const remainingTabs = openTabs.filter((tab) => tab.name !== tabName)
      setActiveFile(remainingTabs[0].name)
    }
  }

  const addNewTab = () => {
    const newTabName = `Untitled-${openTabs.length + 1}.js`
    setOpenTabs([...openTabs, { name: newTabName, language: "javascript", unsaved: true }])
    setActiveFile(newTabName)
  }

  return (
    <div className="h-full bg-gray-900 dark:bg-gray-900 light:bg-white flex flex-col">
      {/* Top Bar */}
      <div className="h-8 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border-b border-gray-700 dark:border-gray-700 light:border-gray-200 flex items-center px-3">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 mr-4">
          <Button
            size="sm"
            variant={mode === "code" ? "default" : "ghost"}
            onClick={() => setMode("code")}
            className={`h-6 px-3 ${mode === "code" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Code className="w-3 h-3 mr-1" />
            Code
          </Button>
          <Button
            size="sm"
            variant={mode === "preview" ? "default" : "ghost"}
            onClick={() => setMode("preview")}
            className={`h-6 px-3 ${mode === "preview" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {openTabs.map((tab) => (
            <div
              key={tab.name}
              className={`flex items-center gap-2 px-3 py-1 rounded-t border-b-2 cursor-pointer transition-all duration-200 ${
                activeFile === tab.name
                  ? "bg-gray-700 dark:bg-gray-700 light:bg-white border-blue-500 text-white dark:text-white light:text-gray-900"
                  : "bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border-transparent text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setActiveFile(tab.name)}
            >
              <span className="text-xs truncate max-w-32" title={tab.name}>
                {tab.name}
                {tab.unsaved && "*"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.name)
                }}
                className="p-0 h-4 w-4 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={addNewTab} className="p-1 h-6 w-6 text-gray-400 hover:text-white">
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Language Selector & Run Button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-700 dark:bg-gray-700 light:bg-gray-200 border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-xs rounded px-2 py-1"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>

          {mode === "preview" && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={previewDevice === "desktop" ? "default" : "ghost"}
                onClick={() => setPreviewDevice("desktop")}
                className="p-1 h-6 w-6"
              >
                <Monitor className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === "tablet" ? "default" : "ghost"}
                onClick={() => setPreviewDevice("tablet")}
                className="p-1 h-6 w-6"
              >
                <Tablet className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant={previewDevice === "mobile" ? "default" : "ghost"}
                onClick={() => setPreviewDevice("mobile")}
                className="p-1 h-6 w-6"
              >
                <Smartphone className="w-3 h-3" />
              </Button>
            </div>
          )}

          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-6 px-3">
            <Play className="w-3 h-3 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Editor/Preview Area */}
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="h-full">
            {mode === "code" ? (
              <CodeEditor theme={theme} activeFile={activeFile} language={selectedLanguage} />
            ) : (
              <PreviewPane theme={theme} device={previewDevice} />
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Terminal */}
        <ResizablePanel defaultSize={30} minSize={10} maxSize={50}>
          <Terminal theme={theme} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
