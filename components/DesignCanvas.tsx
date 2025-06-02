"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Square, Circle, Type, ImageIcon, Figma, Code, Trash2, Move } from "lucide-react"

interface DesignElement {
  id: string
  type: "rectangle" | "circle" | "text" | "image"
  x: number
  y: number
  width: number
  height: number
  fill?: string
  text?: string
  src?: string
}

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedTool, setSelectedTool] = useState<"select" | "rectangle" | "circle" | "text" | "image">("select")
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [figmaUrl, setFigmaUrl] = useState("")

  useEffect(() => {
    drawCanvas()
  }, [elements, selectedElement])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw elements
    elements.forEach((element) => {
      ctx.fillStyle = element.fill || "#00D1FF"

      if (element.type === "rectangle") {
        ctx.fillRect(element.x, element.y, element.width, element.height)
      } else if (element.type === "circle") {
        ctx.beginPath()
        ctx.arc(element.x + element.width / 2, element.y + element.height / 2, element.width / 2, 0, 2 * Math.PI)
        ctx.fill()
      } else if (element.type === "text") {
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "16px Inter"
        ctx.fillText(element.text || "Text", element.x, element.y + 20)
      }

      // Draw selection border
      if (selectedElement === element.id) {
        ctx.strokeStyle = "#00D1FF"
        ctx.lineWidth = 2
        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4)
      }
    })
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === "select") {
      // Find clicked element
      const clickedElement = elements.find(
        (el) => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height,
      )
      setSelectedElement(clickedElement?.id || null)
    } else if (selectedTool !== "select") {
      // Create new element
      const newElement: DesignElement = {
        id: Date.now().toString(),
        type: selectedTool as any,
        x: x - 50,
        y: y - 25,
        width: selectedTool === "circle" ? 100 : 100,
        height: selectedTool === "circle" ? 100 : 50,
        fill: selectedTool === "text" ? "#FFFFFF" : "#00D1FF",
        text: selectedTool === "text" ? "New Text" : undefined,
      }
      setElements([...elements, newElement])
      setSelectedElement(newElement.id)
      setSelectedTool("select")
    }
  }

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(elements.filter((el) => el.id !== selectedElement))
      setSelectedElement(null)
    }
  }

  const importFromFigma = async () => {
    if (!figmaUrl) return

    // Simulate Figma import
    const mockElements: DesignElement[] = [
      {
        id: "figma-1",
        type: "rectangle",
        x: 50,
        y: 50,
        width: 200,
        height: 100,
        fill: "#C084FC",
      },
      {
        id: "figma-2",
        type: "text",
        x: 70,
        y: 80,
        width: 160,
        height: 40,
        text: "Imported from Figma",
      },
    ]

    setElements([...elements, ...mockElements])
    setFigmaUrl("")
  }

  const exportToCode = () => {
    // Generate React/HTML code from canvas elements
    const code = elements
      .map((el) => {
        if (el.type === "rectangle") {
          return `<div style={{
  position: 'absolute',
  left: '${el.x}px',
  top: '${el.y}px',
  width: '${el.width}px',
  height: '${el.height}px',
  backgroundColor: '${el.fill}',
  borderRadius: '4px'
}} />`
        } else if (el.type === "text") {
          return `<div style={{
  position: 'absolute',
  left: '${el.x}px',
  top: '${el.y}px',
  color: '${el.fill}',
  fontSize: '16px'
}}>
  ${el.text}
</div>`
        }
        return ""
      })
      .join("\n\n")

    console.log("Generated code:", code)
    // In a real app, this would be sent to the code editor
  }

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      {/* Design Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Design Canvas</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={exportToCode} className="bg-purple-500 hover:bg-purple-600 text-white">
              <Code className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-white hover:bg-red-500"
              onClick={deleteSelectedElement}
              disabled={!selectedElement}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Figma Import */}
        <div className="flex gap-2 mb-3">
          <Input
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            placeholder="Paste Figma URL..."
            className="bg-gray-700 border-gray-600 text-white text-sm"
          />
          <Button size="sm" onClick={importFromFigma} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Figma className="w-4 h-4 mr-1" />
            Import
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={selectedTool === "select" ? "default" : "outline"}
            onClick={() => setSelectedTool("select")}
            className={selectedTool === "select" ? "bg-blue-500" : "border-gray-600 text-white hover:bg-blue-500"}
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === "rectangle" ? "default" : "outline"}
            onClick={() => setSelectedTool("rectangle")}
            className={
              selectedTool === "rectangle" ? "bg-purple-500" : "border-gray-600 text-white hover:bg-purple-500"
            }
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === "circle" ? "default" : "outline"}
            onClick={() => setSelectedTool("circle")}
            className={selectedTool === "circle" ? "bg-purple-500" : "border-gray-600 text-white hover:bg-purple-500"}
          >
            <Circle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === "text" ? "default" : "outline"}
            onClick={() => setSelectedTool("text")}
            className={selectedTool === "text" ? "bg-purple-500" : "border-gray-600 text-white hover:bg-purple-500"}
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === "image" ? "default" : "outline"}
            onClick={() => setSelectedTool("image")}
            className={selectedTool === "image" ? "bg-purple-500" : "border-gray-600 text-white hover:bg-purple-500"}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-600 bg-gray-700 cursor-crosshair"
          onClick={handleCanvasClick}
        />
      </div>

      {/* Properties Panel */}
      {selectedElement && (
        <div className="border-t border-gray-700 p-3">
          <h4 className="text-white font-medium mb-2">Properties</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <label className="text-gray-400">X:</label>
              <Input
                type="number"
                value={elements.find((el) => el.id === selectedElement)?.x || 0}
                className="bg-gray-700 border-gray-600 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-gray-400">Y:</label>
              <Input
                type="number"
                value={elements.find((el) => el.id === selectedElement)?.y || 0}
                className="bg-gray-700 border-gray-600 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-gray-400">Width:</label>
              <Input
                type="number"
                value={elements.find((el) => el.id === selectedElement)?.width || 0}
                className="bg-gray-700 border-gray-600 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-gray-400">Height:</label>
              <Input
                type="number"
                value={elements.find((el) => el.id === selectedElement)?.height || 0}
                className="bg-gray-700 border-gray-600 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
