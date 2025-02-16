"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WebsiteBuilder() {
  const [websiteData, setWebsiteData] = useState({
    title: "",
    date: "",
    location: "",
    story: "",
    schedule: "",
    rsvpLink: "",
    coverImage: "",
  })

  const [previewMode, setPreviewMode] = useState("desktop")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWebsiteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setWebsiteData((prev) => ({ ...prev, coverImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const saveWebsite = async () => {
    // In a real application, this would be an API call to save the website data
    console.log("Saving website data:", websiteData)
    alert("האתר נשמר בהצלחה!")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">בונה אתר החתונה</h1>
      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">עריכה</TabsTrigger>
          <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2">כותרת האתר</label>
                <Input
                  name="title"
                  value={websiteData.title}
                  onChange={handleInputChange}
                  placeholder="הזן את כותרת האתר"
                />
              </div>
              <div>
                <label className="block mb-2">תאריך החתונה</label>
                <Input name="date" type="date" value={websiteData.date} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block mb-2">מיקום</label>
                <Input
                  name="location"
                  value={websiteData.location}
                  onChange={handleInputChange}
                  placeholder="הזן את מיקום החתונה"
                />
              </div>
              <div>
                <label className="block mb-2">הסיפור שלנו</label>
                <Textarea
                  name="story"
                  value={websiteData.story}
                  onChange={handleInputChange}
                  placeholder="ספרו את הסיפור שלכם"
                />
              </div>
              <div>
                <label className="block mb-2">לוח זמנים</label>
                <Textarea
                  name="schedule"
                  value={websiteData.schedule}
                  onChange={handleInputChange}
                  placeholder="הזן את לוח הזמנים של האירוע"
                />
              </div>
              <div>
                <label className="block mb-2">קישור ל-RSVP</label>
                <Input
                  name="rsvpLink"
                  value={websiteData.rsvpLink}
                  onChange={handleInputChange}
                  placeholder="הזן קישור לטופס RSVP"
                />
              </div>
              <div>
                <label className="block mb-2">תמונת שער</label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              <Button onClick={saveWebsite}>שמור אתר</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <div className="mb-4">
            <Button
              variant={previewMode === "desktop" ? "default" : "outline"}
              onClick={() => setPreviewMode("desktop")}
              className="mr-2"
            >
              מחשב
            </Button>
            <Button variant={previewMode === "mobile" ? "default" : "outline"} onClick={() => setPreviewMode("mobile")}>
              נייד
            </Button>
          </div>
          <div className={`border rounded-lg p-4 ${previewMode === "mobile" ? "max-w-sm mx-auto" : "w-full"}`}>
            <h2 className="text-3xl font-bold mb-4">{websiteData.title || "כותרת החתונה"}</h2>
            {websiteData.coverImage && (
              <img
                src={websiteData.coverImage || "/placeholder.svg"}
                alt="תמונת שער"
                className="w-full h-64 object-cover mb-4 rounded"
              />
            )}
            <p className="mb-2">
              <strong>תאריך:</strong> {websiteData.date || "טרם נקבע"}
            </p>
            <p className="mb-2">
              <strong>מיקום:</strong> {websiteData.location || "טרם נקבע"}
            </p>
            <h3 className="text-xl font-bold mt-4 mb-2">הסיפור שלנו</h3>
            <p>{websiteData.story || "הסיפור שלכם יופיע כאן"}</p>
            <h3 className="text-xl font-bold mt-4 mb-2">לוח זמנים</h3>
            <p>{websiteData.schedule || "לוח הזמנים יופיע כאן"}</p>
            <Button className="mt-4" asChild>
              <a href={websiteData.rsvpLink || "#"} target="_blank" rel="noopener noreferrer">
                RSVP
              </a>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

