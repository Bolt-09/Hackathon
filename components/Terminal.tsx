"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TerminalIcon, Plus, X, Copy, Trash2 } from "lucide-react"

interface TerminalProps {
  theme: "dark" | "light"
}

interface TerminalOutput {
  id: string
  type: "command" | "output" | "error"
  content: string
  timestamp: Date
}

export function Terminal({ theme }: TerminalProps) {
  const [activeTab, setActiveTab] = useState("terminal-1")
  const [tabs, setTabs] = useState([
    { id: "terminal-1", name: "Terminal 1" },
    { id: "terminal-2", name: "Terminal 2" },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      id: "1",
      type: "output",
      content: "Welcome to CollabCodeAI Terminal\nNode.js v20.0.0\nType 'help' for available commands",
      timestamp: new Date(),
    },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = () => {
    if (!currentCommand.trim()) return

    const newCommand: TerminalOutput = {
      id: Date.now().toString(),
      type: "command",
      content: `$ ${currentCommand}`,
      timestamp: new Date(),
    }

    setHistory((prev) => [...prev, newCommand])

    // Simulate command execution
    setTimeout(() => {
      let output: TerminalOutput

      switch (currentCommand.toLowerCase().trim()) {
        case "help":
          output = {
            id: (Date.now() + 1).toString(),
            type: "output",
            content: `Available commands:
  npm install    - Install dependencies
  npm start      - Start development server
  npm run build  - Build for production
  git status     - Check git status
  git add .      - Stage all changes
  git commit     - Commit changes
  python app.py  - Run Python script
  clear          - Clear terminal
  help           - Show this help`,
            timestamp: new Date(),
          }
          break

        case "npm install":
          output = {
            id: (Date.now() + 1).toString(),
            type: "output",
            content: `Installing dependencies...
✓ react@18.2.0
✓ react-dom@18.2.0
✓ @types/react@18.0.0
✓ tailwindcss@3.3.0
✓ typescript@5.0.0

Dependencies installed successfully!`,
            timestamp: new Date(),
          }
          break

        case "npm start":
          output = {
            id: (Date.now() + 1).toString(),
            type: "output",
            content: `Starting development server...
Local:    http://localhost:3000
Network:  http://192.168.1.100:3000

✓ Ready in 1.2s`,
            timestamp: new Date(),
          }
          break

        case "git status":
          output = {
            id: (Date.now() + 1).toString(),
            type: "output",
            content: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/App.js
  modified:   src/components/Header.jsx
  
Untracked files:
  src/components/NewComponent.jsx`,
            timestamp: new Date(),
          }
          break

        case "clear":
          setHistory([])
          setCurrentCommand("")
          return

        default:
          if (currentCommand.startsWith("python ")) {
            output = {
              id: (Date.now() + 1).toString(),
              type: "output",
              content: `Running ${currentCommand}...
Hello, World!
Process finished with exit code 0`,
              timestamp: new Date(),
            }
          } else {
            output = {
              id: (Date.now() + 1).toString(),
              type: "error",
              content: `Command not found: ${currentCommand}
Type 'help' for available commands`,
              timestamp: new Date(),
            }
          }
      }

      setHistory((prev) => [...prev, output])
    }, 500)

    setCurrentCommand("")
  }

  const addNewTab = () => {
    const newTabId = `terminal-${tabs.length + 1}`
    const newTab = { id: newTabId, name: `Terminal ${tabs.length + 1}` }
    setTabs([...tabs, newTab])
    setActiveTab(newTabId)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return

    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)

    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id)
    }
  }

  const clearTerminal = () => {
    setHistory([])
  }

  const copyOutput = () => {
    const output = history.map((item) => item.content).join("\n")
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="h-full bg-gray-900 dark:bg-gray-900 light:bg-white flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="flex items-center justify-between">
            <TabsList className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative data-[state=active]:bg-gray-700 dark:data-[state=active]:bg-gray-700 light:data-[state=active]:bg-white text-white dark:text-white light:text-gray-900"
                >
                  <TerminalIcon className="w-3 h-3 mr-1" />
                  {tab.name}
                  {tabs.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                      className="ml-1 p-0 h-4 w-4 text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </TabsTrigger>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={addNewTab}
                className="p-1 h-6 w-6 text-gray-400 hover:text-white ml-1"
                disabled={tabs.length >= 5}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </TabsList>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={copyOutput}
                className="text-gray-400 hover:text-white p-1"
                title="Copy output"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearTerminal}
                className="text-gray-400 hover:text-white p-1"
                title="Clear terminal"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          <div className="space-y-1 font-mono text-sm">
            {history.map((item) => (
              <div
                key={item.id}
                className={`leading-relaxed whitespace-pre-wrap ${
                  item.type === "command"
                    ? "text-green-400"
                    : item.type === "error"
                      ? "text-red-400"
                      : "text-white dark:text-white light:text-gray-900"
                }`}
              >
                {item.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Command Input */}
        <div className="border-t border-gray-700 dark:border-gray-700 light:border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono">$</span>
            <Input
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && executeCommand()}
              placeholder="Type a command..."
              className="bg-transparent border-0 text-white dark:text-white light:text-gray-900 font-mono focus:ring-0 p-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
