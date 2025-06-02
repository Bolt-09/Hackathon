"use client"

import { useState, useEffect } from "react"
import { TopNavigation } from "@/components/TopNavigation"
import { DirectoriesPanel } from "@/components/DirectoriesPanel"
import { CodingWorkspace } from "@/components/CodingWorkspace"
import { ChatMeetingPanel } from "@/components/ChatMeetingPanel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function CollabCodeAI() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [workspaceName, setWorkspaceName] = useState("My Awesome Project")
  const [activeFile, setActiveFile] = useState("src/App.js")
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: "1", type: "commit", message: "John pushed to main branch", timestamp: "2m ago", read: false },
    { id: "2", type: "pr", message: "PR #123 approved by Sarah", timestamp: "5m ago", read: false },
  ])

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("collabcode-theme") as "dark" | "light"
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("collabcode-theme", newTheme)
  }

  return (
    <div
      className={`${theme} h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 light:from-gray-50 light:to-gray-100`}
    >
      {/* Top Navigation Bar */}
      <TopNavigation
        theme={theme}
        toggleTheme={toggleTheme}
        workspaceName={workspaceName}
        setWorkspaceName={setWorkspaceName}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Section A: Directories and Files */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <DirectoriesPanel
              theme={theme}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Section B: Coding, Preview, and Terminal */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <CodingWorkspace theme={theme} activeFile={activeFile} setActiveFile={setActiveFile} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Section C: Chat and Meetings */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            <ChatMeetingPanel theme={theme} isInMeeting={isInMeeting} setIsInMeeting={setIsInMeeting} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
