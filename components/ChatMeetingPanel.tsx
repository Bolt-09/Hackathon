"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import {
  Send,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  Calendar,
  Paperclip,
  Smile,
  AtSign,
  Pin,
  Search,
} from "lucide-react"

interface ChatMeetingPanelProps {
  theme: "dark" | "light"
  isInMeeting: boolean
  setIsInMeeting: (inMeeting: boolean) => void
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  avatar: string
  type: "message" | "ai" | "system"
  pinned?: boolean
  reactions?: string[]
  attachments?: string[]
}

interface Participant {
  id: string
  name: string
  avatar: string
  isVideoOn: boolean
  isAudioOn: boolean
  isScreenSharing: boolean
}

export function ChatMeetingPanel({ theme, isInMeeting, setIsInMeeting }: ChatMeetingPanelProps) {
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Sarah Wilson",
      message: "Hey team! I've just pushed the new UI components to the main branch. Can everyone take a look?",
      timestamp: new Date(Date.now() - 300000),
      avatar: "SW",
      type: "message",
    },
    {
      id: "2",
      user: "Mike Chen",
      message: "Looks great! I love the new color scheme. The dark theme is much easier on the eyes.",
      timestamp: new Date(Date.now() - 240000),
      avatar: "MC",
      type: "message",
    },
    {
      id: "3",
      user: "AI Assistant",
      message:
        "I've analyzed the code and found a few optimization opportunities. Would you like me to suggest improvements?",
      timestamp: new Date(Date.now() - 180000),
      avatar: "AI",
      type: "ai",
    },
    {
      id: "4",
      user: "Alex Rivera",
      message: "@code Generate a responsive navigation component with mobile hamburger menu",
      timestamp: new Date(Date.now() - 120000),
      avatar: "AR",
      type: "message",
    },
    {
      id: "5",
      user: "AI Assistant",
      message:
        'Here\'s a responsive navigation component:\n\n```jsx\nfunction Navigation() {\n  const [isOpen, setIsOpen] = useState(false);\n  \n  return (\n    <nav className="bg-gray-800 text-white">\n      {/* Navigation code */}\n    </nav>\n  );\n}\n```\n\nWould you like me to insert this into your editor?',
      timestamp: new Date(Date.now() - 60000),
      avatar: "AI",
      type: "ai",
    },
  ])

  const [participants] = useState<Participant[]>([
    { id: "1", name: "Sarah Wilson", avatar: "SW", isVideoOn: true, isAudioOn: true, isScreenSharing: false },
    { id: "2", name: "Mike Chen", avatar: "MC", isVideoOn: false, isAudioOn: true, isScreenSharing: false },
    { id: "3", name: "Alex Rivera", avatar: "AR", isVideoOn: true, isAudioOn: false, isScreenSharing: true },
    {
      id: "4",
      name: "You",
      avatar: "YO",
      isVideoOn: isVideoOn,
      isAudioOn: isAudioOn,
      isScreenSharing: isScreenSharing,
    },
  ])

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: message.trim(),
      timestamp: new Date(),
      avatar: "YO",
      type: message.startsWith("@") ? "ai" : "message",
    }

    setMessages([...messages, newMessage])

    // Simulate AI response for AI commands
    if (message.startsWith("@")) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: "AI Assistant",
          message: `I'll help you with: "${message}". Let me generate that for you...`,
          timestamp: new Date(),
          avatar: "AI",
          type: "ai",
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }

    setMessage("")
  }

  const startMeeting = () => {
    setIsInMeeting(true)
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "System",
      message: "Meeting started. All participants have been notified.",
      timestamp: new Date(),
      avatar: "SYS",
      type: "system",
    }
    setMessages([...messages, systemMessage])
  }

  const endMeeting = () => {
    setIsInMeeting(false)
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "System",
      message: "Meeting ended. Recording saved to workspace.",
      timestamp: new Date(),
      avatar: "SYS",
      type: "system",
    }
    setMessages([...messages, systemMessage])
  }

  const filteredMessages = messages.filter(
    (msg) =>
      searchTerm === "" ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.user.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div
      className={`h-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} border-l border-gray-700 rounded-lg flex flex-col`}
    >
      {!isInMeeting ? (
        // Chat Only View
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-gray-700 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className={`${theme === "light" ? "text-gray-900" : "text-white"} font-medium`}>Team Chat</h3>
                <Badge
                  variant="outline"
                  className={`${theme === "light" ? "border-gray-300 text-gray-600" : "border-gray-600 text-gray-400"}`}
                >
                  <Users className="w-3 h-3 mr-1" />
                  {participants.length}
                </Badge>
              </div>
              <Button
                size="sm"
                onClick={startMeeting}
                className={`${theme === "light" ? "bg-green-400 hover:bg-green-500" : "bg-green-500 hover:bg-green-600"} text-white`}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Start Meeting
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages..."
                className={`pl-8 ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-white"} text-sm h-8 rounded`}
              />
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="w-8 h-8 flex-shrink-0 rounded">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback
                      className={`text-white text-xs rounded ${
                        msg.type === "ai" ? "bg-purple-500" : msg.type === "system" ? "bg-gray-500" : "bg-blue-500"
                      }`}
                    >
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${theme === "light" ? "text-gray-900" : "text-white"} text-sm font-medium`}>
                        {msg.user}
                      </span>
                      <span className={`${theme === "light" ? "text-gray-400" : "text-gray-500"} text-xs`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.pinned && <Pin className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <div
                      className={`text-sm leading-relaxed break-words ${
                        msg.type === "ai" ? "bg-purple-500/20 p-2 rounded" : ""
                      }`}
                    >
                      <span className={`${theme === "light" ? "text-gray-700" : "text-gray-300"} whitespace-pre-wrap`}>
                        {msg.message}
                      </span>
                      {msg.type === "ai" && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs border-purple-400 text-purple-400 hover:bg-purple-500/20"
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs border-purple-400 text-purple-400 hover:bg-purple-500/20"
                          >
                            Insert
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className={`border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"} p-3 rounded-b-lg`}>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-gray-700 rounded border border-gray-600">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message... Use @ask, @code, @debug, @explain"
                  className="border-0 bg-transparent text-white focus:ring-0"
                />
                <div className="flex items-center gap-1 px-2">
                  <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                    <AtSign className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                    <Paperclip className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                    <Smile className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                onClick={sendMessage}
                className={`${theme === "light" ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-500"} mt-1`}>
              Use @commands for AI assistance: @ask, @code, @debug, @explain
            </p>
          </div>
        </div>
      ) : (
        // Meeting + Chat Split View
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Chat Section */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="p-2 border-b border-gray-700 rounded-t-lg">
                <h3 className={`${theme === "light" ? "text-gray-900" : "text-white"} font-medium text-sm`}>Chat</h3>
              </div>
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {filteredMessages.slice(-5).map((msg) => (
                    <div key={msg.id} className="flex gap-2">
                      <Avatar className="w-6 h-6 flex-shrink-0 rounded">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">{msg.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs ${theme === "light" ? "text-gray-700" : "text-gray-300"} break-words`}>
                          <span className="font-medium">{msg.user}:</span> {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className={`border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"} p-2 rounded-b-lg`}>
                <div className="flex gap-1">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Message..."
                    className="bg-gray-700 rounded border border-gray-600 text-white focus:ring-0"
                  />
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    className={`${theme === "light" ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"} text-white h-8 w-8 p-0`}
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Meeting Section */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col">
              {/* Meeting Controls */}
              <div className="p-2 border-b border-gray-700 rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`${theme === "light" ? "text-gray-900" : "text-white"} font-medium text-sm`}>
                    Meeting
                  </h3>
                  <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                    Live
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={isVideoOn ? "default" : "outline"}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`h-6 w-6 p-0 ${isVideoOn ? (theme === "light" ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-500") : "border-gray-600 text-gray-400"}`}
                  >
                    {isVideoOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isAudioOn ? "default" : "outline"}
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`h-6 w-6 p-0 ${isAudioOn ? (theme === "light" ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-500") : "border-gray-600 text-gray-400"}`}
                  >
                    {isAudioOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isScreenSharing ? "default" : "outline"}
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`h-6 w-6 p-0 ${isScreenSharing ? (theme === "light" ? "bg-green-400 hover:bg-green-500" : "bg-green-500") : "border-gray-600 text-gray-400"}`}
                  >
                    {isScreenSharing ? <Monitor className="w-3 h-3" /> : <MonitorOff className="w-3 h-3" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={endMeeting}
                    className={`${theme === "light" ? "bg-red-400 hover:bg-red-500" : "bg-red-500 hover:bg-red-600"} text-white h-6 w-6 p-0 ml-auto`}
                  >
                    <PhoneOff className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Video Grid */}
              <div className="flex-1 p-2">
                <div className="grid grid-cols-2 gap-2 h-full">
                  {participants.map((participant) => (
                    <div key={participant.id} className="relative bg-gray-700 rounded overflow-hidden">
                      {participant.isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium text-lg">{participant.avatar}</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <VideoOff className="w-6 h-6 text-gray-500" />
                        </div>
                      )}

                      {/* Participant Info */}
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                        {participant.name}
                      </div>

                      {/* Status Indicators */}
                      <div className="absolute top-1 right-1 flex gap-1">
                        {!participant.isAudioOn && (
                          <div className="bg-red-500 rounded-full p-1">
                            <MicOff className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {participant.isScreenSharing && (
                          <div className="bg-green-500 rounded-full p-1">
                            <Monitor className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  )
}
