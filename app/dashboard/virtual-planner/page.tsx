"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function VirtualPlanner() {
  const [query, setQuery] = useState("")
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setConversation((prev) => [...prev, { role: "user", content: query }])

    try {
      // In a real application, this would be an API call to your AI service
      const response = await fetch("/api/virtual-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, conversation }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      setConversation((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error:", error)
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
      setQuery("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">מתכנן חתונות וירטואלי</h1>
      <Card>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 p-4 border rounded">
            {conversation.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  {message.content}
                </span>
              </div>
            ))}
            {isLoading && <div className="text-center">המתכנן חושב...</div>}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="שאל את המתכנן הוירטואלי שלך..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              שלח
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

