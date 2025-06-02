"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Users, MessageSquare, Sparkles } from "lucide-react"

interface CodeEditorProps {
  theme: "dark" | "light"
  activeFile: string
  language: string
}

interface Collaborator {
  id: string
  name: string
  color: string
  cursor: { line: number; column: number }
  isTyping: boolean
}

export function CodeEditor({ theme, activeFile, language }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [code, setCode] = useState(`// Welcome to CollabCodeAI!
// Real-time collaborative coding with AI assistance

import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="rounded"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`)

  const [collaborators] = useState<Collaborator[]>([
    { id: "1", name: "Sarah Wilson", color: "#10B981", cursor: { line: 8, column: 15 }, isTyping: true },
    { id: "2", name: "Mike Chen", color: "#3B82F6", cursor: { line: 25, column: 8 }, isTyping: false },
    { id: "3", name: "Alex Rivera", color: "#F59E0B", cursor: { line: 42, column: 20 }, isTyping: false },
  ])

  const [aiSuggestion, setAiSuggestion] = useState({
    show: false,
    text: "const deleteTodo = (id) => {\n  setTodos(todos.filter(todo => todo.id !== id));\n};",
    description: "Add delete functionality for todos",
    line: 20,
  })

  const [annotations] = useState([
    { line: 15, message: "Consider adding error handling for empty todos", type: "warning", author: "AI Assistant" },
    { line: 28, message: "This could be optimized with useCallback", type: "suggestion", author: "Sarah Wilson" },
    { line: 35, message: "Great implementation! 👍", type: "comment", author: "Mike Chen" },
  ])

  const lines = code.split("\n")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "s":
          e.preventDefault()
          console.log("Saving file:", activeFile)
          break
        case " ":
          e.preventDefault()
          setAiSuggestion((prev) => ({ ...prev, show: true }))
          break
      }
    }
  }

  const acceptAISuggestion = () => {
    const textarea = editorRef.current
    if (textarea) {
      const lines = code.split("\n")
      lines.splice(aiSuggestion.line, 0, "", aiSuggestion.text, "")
      setCode(lines.join("\n"))
      setAiSuggestion((prev) => ({ ...prev, show: false }))
    }
  }

  return (
    <div className="h-full bg-gray-900 dark:bg-gray-900 light:bg-white flex flex-col relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white dark:text-white light:text-gray-900 font-medium">{activeFile}</span>
            <Badge
              variant="outline"
              className="border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs"
            >
              {language}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {collaborators.map((collab) => (
              <div key={collab.id} className="relative">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: collab.color }}
                  title={`${collab.name}${collab.isTyping ? " (typing...)" : ""}`}
                >
                  {collab.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {collab.isTyping && (
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </div>
            ))}
            <Badge
              variant="outline"
              className="border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 ml-2"
            >
              <Users className="w-3 h-3 mr-1" />
              {collaborators.length + 1}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setAiSuggestion((prev) => ({ ...prev, show: true }))}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI Assist
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Line Numbers */}
          <div className="w-12 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border-r border-gray-700 dark:border-gray-700 light:border-gray-200 p-2 text-right">
            {lines.map((_, index) => (
              <div
                key={index}
                className="text-gray-500 dark:text-gray-500 light:text-gray-400 text-sm leading-6 font-mono"
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Area */}
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 font-mono text-sm p-4 resize-none outline-none leading-6 border-0"
              style={{ fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace' }}
              spellCheck={false}
            />

            {/* Collaborator Cursors */}
            {collaborators.map((collab) => (
              <div
                key={collab.id}
                className="absolute w-0.5 h-6 pointer-events-none z-10"
                style={{
                  backgroundColor: collab.color,
                  top: `${collab.cursor.line * 24 + 16}px`,
                  left: `${collab.cursor.column * 8 + 16}px`,
                }}
              >
                <div
                  className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
                  style={{ backgroundColor: collab.color }}
                >
                  {collab.name}
                </div>
              </div>
            ))}

            {/* Code Annotations */}
            {annotations.map((annotation, index) => (
              <div
                key={index}
                className="absolute left-0 w-full h-6 cursor-pointer group"
                style={{ top: `${annotation.line * 24}px` }}
              >
                <div
                  className={`h-full border-l-2 ${
                    annotation.type === "warning"
                      ? "border-yellow-400 bg-yellow-400/10"
                      : annotation.type === "suggestion"
                        ? "border-blue-400 bg-blue-400/10"
                        : "border-green-400 bg-green-400/10"
                  }`}
                >
                  <MessageSquare
                    className={`w-4 h-4 ml-2 mt-1 ${
                      annotation.type === "warning"
                        ? "text-yellow-400"
                        : annotation.type === "suggestion"
                          ? "text-blue-400"
                          : "text-green-400"
                    }`}
                  />
                </div>

                {/* Tooltip */}
                <div className="absolute left-8 top-0 bg-gray-800 dark:bg-gray-800 light:bg-white text-white dark:text-white light:text-gray-900 p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                  <div className="text-xs font-medium">{annotation.author}</div>
                  <div className="text-sm">{annotation.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion Popup */}
        {aiSuggestion.show && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-xl max-w-md z-30 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">AI Suggestion</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{aiSuggestion.description}</p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs mb-3 overflow-x-auto font-mono">
              {aiSuggestion.text}
            </pre>
            <div className="flex gap-2">
              <Button size="sm" onClick={acceptAISuggestion} className="bg-blue-500 hover:bg-blue-600 text-white">
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAiSuggestion((prev) => ({ ...prev, show: false }))}
                className="border-gray-300 dark:border-gray-600"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t border-gray-700 dark:border-gray-700 light:border-gray-200 text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
        <div className="flex items-center gap-4">
          <span>Line {lines.length}, Column 1</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">● Auto-saved</span>
          <span>Last sync: now</span>
        </div>
      </div>
    </div>
  )
}
