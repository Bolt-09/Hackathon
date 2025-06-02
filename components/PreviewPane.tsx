"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Zap } from "lucide-react"

interface PreviewPaneProps {
  theme: "dark" | "light"
  device: "desktop" | "tablet" | "mobile"
}

export function PreviewPane({ theme, device }: PreviewPaneProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const getDeviceStyles = () => {
    switch (device) {
      case "mobile":
        return { width: "375px", height: "667px", margin: "0 auto" }
      case "tablet":
        return { width: "768px", height: "1024px", margin: "0 auto" }
      default:
        return { width: "100%", height: "100%" }
    }
  }

  const refreshPreview = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  const previewContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Todo App Preview</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        * { box-sizing: border-box; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        function TodoApp() {
          const [todos, setTodos] = React.useState([
            { id: 1, text: "Learn React", completed: false },
            { id: 2, text: "Build awesome apps", completed: true },
            { id: 3, text: "Share with the world", completed: false }
          ]);
          const [input, setInput] = React.useState('');

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

          const deleteTodo = (id) => {
            setTodos(todos.filter(todo => todo.id !== id));
          };

          return React.createElement('div', {
            className: 'p-6 max-w-md mx-auto bg-white rounded-xl shadow-2xl'
          }, [
            React.createElement('h1', {
              key: 'title',
              className: 'text-3xl font-bold mb-6 text-gray-800 text-center'
            }, '✨ Todo List'),
            React.createElement('div', {
              key: 'input-section',
              className: 'flex gap-2 mb-6'
            }, [
              React.createElement('input', {
                key: 'input',
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: 'Add a new todo...',
                className: 'flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                onKeyPress: (e) => e.key === 'Enter' && addTodo()
              }),
              React.createElement('button', {
                key: 'add-btn',
                onClick: addTodo,
                className: 'px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium'
              }, '+ Add')
            ]),
            React.createElement('ul', {
              key: 'todo-list',
              className: 'space-y-3'
            }, todos.map(todo => 
              React.createElement('li', {
                key: todo.id,
                className: 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
              }, [
                React.createElement('input', {
                  key: 'checkbox',
                  type: 'checkbox',
                  checked: todo.completed,
                  onChange: () => toggleTodo(todo.id),
                  className: 'w-5 h-5 text-blue-500 rounded focus:ring-blue-500'
                }),
                React.createElement('span', {
                  key: 'text',
                  className: todo.completed ? 'line-through text-gray-500 flex-1' : 'text-gray-800 flex-1'
                }, todo.text),
                React.createElement('button', {
                  key: 'delete-btn',
                  onClick: () => deleteTodo(todo.id),
                  className: 'px-3 py-1 text-red-500 hover:bg-red-50 rounded transition-colors'
                }, '🗑️')
              ])
            ))
          ]);
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(TodoApp));
      </script>
    </body>
    </html>
  `

  return (
    <div className="h-full bg-gray-900 dark:bg-gray-900 light:bg-white flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-white dark:text-white light:text-gray-900 font-medium">Live Preview</h3>
          {isLoading && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Zap className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={refreshPreview} className="bg-blue-500 hover:bg-blue-600 text-white">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 dark:border-gray-600 light:border-gray-300 text-white dark:text-white light:text-gray-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-800 dark:bg-gray-800 light:bg-gray-100">
        <div
          className={`${device !== "desktop" ? "border-4 border-gray-600 dark:border-gray-600 light:border-gray-300 rounded-lg shadow-2xl bg-white" : ""}`}
          style={getDeviceStyles()}
        >
          <iframe
            srcDoc={previewContent}
            className="w-full h-full border-0 bg-white rounded"
            title="App Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Preview Status */}
      <div className="p-2 border-t border-gray-700 dark:border-gray-700 light:border-gray-200 text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
        <div className="flex items-center justify-between">
          <span>Device: {device.charAt(0).toUpperCase() + device.slice(1)}</span>
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
