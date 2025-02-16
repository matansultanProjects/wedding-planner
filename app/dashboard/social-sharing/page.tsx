"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function SocialSharing() {
  const [post, setPost] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const shareToSocialMedia = async (platform: "facebook" | "twitter" | "instagram") => {
    // In a real application, this would be an API call to share the post
    console.log(`Sharing to ${platform}: ${post}`)
    if (image) {
      console.log(`With image: ${image.name}`)
    }
    alert(`הפוסט שותף בהצלחה ל-${platform}!`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">שיתוף ברשתות חברתיות</h1>
      <Card>
        <CardHeader>
          <CardTitle>צור פוסט</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="מה תרצו לשתף על החתונה שלכם?"
            className="mb-4"
          />
          <Input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
          <div className="flex space-x-2">
            <Button onClick={() => shareToSocialMedia("facebook")}>
              <Facebook className="mr-2" /> שתף בפייסבוק
            </Button>
            <Button onClick={() => shareToSocialMedia("twitter")}>
              <Twitter className="mr-2" /> שתף בטוויטר
            </Button>
            <Button onClick={() => shareToSocialMedia("instagram")}>
              <Instagram className="mr-2" /> שתף באינסטגרם
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

