"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  rsvp: "מאושר" | "ממתין" | "לא מגיע"
  group: string
  tableAssignment: string
}

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [newGuest, setNewGuest] = useState<Omit<Guest, "id">>({
    name: "",
    email: "",
    phone: "",
    rsvp: "ממתין",
    group: "",
    tableAssignment: "",
  })
  const [filter, setFilter] = useState({ group: "", rsvp: "" })

  const addGuest = () => {
    const guestWithId = { ...newGuest, id: Date.now().toString() }
    setGuests([...guests, guestWithId])
    setNewGuest({
      name: "",
      email: "",
      phone: "",
      rsvp: "ממתין",
      group: "",
      tableAssignment: "",
    })
  }

  const updateGuest = (updatedGuest: Guest) => {
    setGuests(guests.map((guest) => (guest.id === updatedGuest.id ? updatedGuest : guest)))
  }

  const filteredGuests = guests.filter(
    (guest) =>
      (filter.group ? guest.group === filter.group : true) && (filter.rsvp ? guest.rsvp === filter.rsvp : true),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ניהול מוזמנים</h1>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">רשימת מוזמנים</TabsTrigger>
          <TabsTrigger value="add">הוסף מוזמן</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>רשימת מוזמנים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <Select onValueChange={(value) => setFilter({ ...filter, group: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="סנן לפי קבוצה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="משפחה">משפחה</SelectItem>
                    <SelectItem value="חברים">חברים</SelectItem>
                    <SelectItem value="עבודה">עבודה</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilter({ ...filter, rsvp: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="סנן לפי RSVP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="מאושר">מאושר</SelectItem>
                    <SelectItem value="ממתין">ממתין</SelectItem>
                    <SelectItem value="לא מגיע">לא מגיע</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {guests.length === 0 ? (
                <p className="text-center text-gray-500">אין מוזמנים עדיין. הוסיפו מוזמנים כדי לראות אותם כאן.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם</TableHead>
                      <TableHead>אימייל</TableHead>
                      <TableHead>טלפון</TableHead>
                      <TableHead>RSVP</TableHead>
                      <TableHead>קבוצה</TableHead>
                      <TableHead>שולחן</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.name}</TableCell>
                        <TableCell>{guest.email}</TableCell>
                        <TableCell>{guest.phone}</TableCell>
                        <TableCell>{guest.rsvp}</TableCell>
                        <TableCell>{guest.group}</TableCell>
                        <TableCell>{guest.tableAssignment}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">ערוך</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>ערוך מוזמן</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <Input
                                  defaultValue={guest.name}
                                  onChange={(e) => updateGuest({ ...guest, name: e.target.value })}
                                  placeholder="שם"
                                />
                                <Input
                                  defaultValue={guest.email}
                                  onChange={(e) => updateGuest({ ...guest, email: e.target.value })}
                                  placeholder="אימייל"
                                />
                                <Input
                                  defaultValue={guest.phone}
                                  onChange={(e) => updateGuest({ ...guest, phone: e.target.value })}
                                  placeholder="טלפון"
                                />
                                <Select
                                  onValueChange={(value) => updateGuest({ ...guest, rsvp: value as Guest["rsvp"] })}
                                  defaultValue={guest.rsvp}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="RSVP" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="מאושר">מאושר</SelectItem>
                                    <SelectItem value="ממתין">ממתין</SelectItem>
                                    <SelectItem value="לא מגיע">לא מגיע</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  onValueChange={(value) => updateGuest({ ...guest, group: value })}
                                  defaultValue={guest.group}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="קבוצה" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="משפחה">משפחה</SelectItem>
                                    <SelectItem value="חברים">חברים</SelectItem>
                                    <SelectItem value="עבודה">עבודה</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  defaultValue={guest.tableAssignment}
                                  onChange={(e) => updateGuest({ ...guest, tableAssignment: e.target.value })}
                                  placeholder="מספר שולחן"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>הוסף מוזמן חדש</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  placeholder="שם"
                />
                <Input
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  placeholder="אימייל"
                />
                <Input
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  placeholder="טלפון"
                />
                <Select onValueChange={(value) => setNewGuest({ ...newGuest, group: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="קבוצה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="משפחה">משפחה</SelectItem>
                    <SelectItem value="חברים">חברים</SelectItem>
                    <SelectItem value="עבודה">עבודה</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addGuest}>הוסף מוזמן</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

