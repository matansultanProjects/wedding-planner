"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface Vendor {
  id: string
  name: string
  category: string
  phone: string
  email: string
  website: string
  price: number
  rating: number
  notes: string
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [filter, setFilter] = useState({ category: "", rating: 0 })

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchVendors = async () => {
      const response = await fetch("/api/vendors")
      const data = await response.json()
      setVendors(data)
      const uniqueCategories = [...new Set(data.map((vendor: Vendor) => vendor.category))]
      setCategories(uniqueCategories)
    }
    fetchVendors()
  }, [])

  const addVendor = async () => {
    // In a real application, this would be an API call
    const vendorWithId = { ...newVendor, id: Date.now().toString(), rating: 0 }
    setVendors([...vendors, vendorWithId as Vendor])
    setNewVendor({})
  }

  const updateVendor = async (updatedVendor: Vendor) => {
    // In a real application, this would be an API call
    setVendors(vendors.map((vendor) => (vendor.id === updatedVendor.id ? updatedVendor : vendor)))
  }

  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      (filter.category ? vendor.category === filter.category : true) &&
      (filter.rating ? vendor.rating >= filter.rating : true),
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ניהול ספקים</h1>
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">רשימת ספקים</TabsTrigger>
          <TabsTrigger value="add">הוסף ספק</TabsTrigger>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>רשימת ספקים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <Select onValueChange={(value) => setFilter({ ...filter, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="סנן לפי קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilter({ ...filter, rating: Number(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="סנן לפי דירוג" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">הכל</SelectItem>
                    <SelectItem value="1">1+ כוכבים</SelectItem>
                    <SelectItem value="2">2+ כוכבים</SelectItem>
                    <SelectItem value="3">3+ כוכבים</SelectItem>
                    <SelectItem value="4">4+ כוכבים</SelectItem>
                    <SelectItem value="5">5 כוכבים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>קטגוריה</TableHead>
                    <TableHead>טלפון</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead>מחיר</TableHead>
                    <TableHead>דירוג</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>₪{vendor.price}</TableCell>
                      <TableCell>
                        {vendor.rating} <Star className="inline-block" />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">ערוך</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ערוך ספק</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Input
                                defaultValue={vendor.name}
                                onChange={(e) => updateVendor({ ...vendor, name: e.target.value })}
                                placeholder="שם"
                              />
                              <Select
                                onValueChange={(value) => updateVendor({ ...vendor, category: value })}
                                defaultValue={vendor.category}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="קטגוריה" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                defaultValue={vendor.phone}
                                onChange={(e) => updateVendor({ ...vendor, phone: e.target.value })}
                                placeholder="טלפון"
                              />
                              <Input
                                defaultValue={vendor.email}
                                onChange={(e) => updateVendor({ ...vendor, email: e.target.value })}
                                placeholder="אימייל"
                              />
                              <Input
                                defaultValue={vendor.website}
                                onChange={(e) => updateVendor({ ...vendor, website: e.target.value })}
                                placeholder="אתר אינטרנט"
                              />
                              <Input
                                type="number"
                                defaultValue={vendor.price}
                                onChange={(e) => updateVendor({ ...vendor, price: Number(e.target.value) })}
                                placeholder="מחיר"
                              />
                              <Select
                                onValueChange={(value) => updateVendor({ ...vendor, rating: Number(value) })}
                                defaultValue={String(vendor.rating)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="דירוג" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 כוכב</SelectItem>
                                  <SelectItem value="2">2 כוכבים</SelectItem>
                                  <SelectItem value="3">3 כוכבים</SelectItem>
                                  <SelectItem value="4">4 כוכבים</SelectItem>
                                  <SelectItem value="5">5 כוכבים</SelectItem>
                                </SelectContent>
                              </Select>
                              <Textarea
                                defaultValue={vendor.notes}
                                onChange={(e) => updateVendor({ ...vendor, notes: e.target.value })}
                                placeholder="הערות"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>הוסף ספק חדש</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input
                  value={newVendor.name || ""}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="שם"
                />
                <Select onValueChange={(value) => setNewVendor({ ...newVendor, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newVendor.phone || ""}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  placeholder="טלפון"
                />
                <Input
                  value={newVendor.email || ""}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  placeholder="אימייל"
                />
                <Input
                  value={newVendor.website || ""}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  placeholder="אתר אינטרנט"
                />
                <Input
                  type="number"
                  value={newVendor.price || ""}
                  onChange={(e) => setNewVendor({ ...newVendor, price: Number(e.target.value) })}
                  placeholder="מחיר"
                />
                <Textarea
                  value={newVendor.notes || ""}
                  onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                  placeholder="הערות"
                />
                <Button onClick={addVendor}>הוסף ספק</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>ניהול קטגוריות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="שם הקטגוריה החדשה"
                />
                <Button onClick={addCategory}>הוסף קטגוריה</Button>
              </div>
              <ul>
                {categories.map((category) => (
                  <li key={category} className="mb-2">
                    {category}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

