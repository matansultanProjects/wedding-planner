"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface Guest {
  id: string
  name: string
  group: string
}

interface Table {
  id: string
  name: string
  capacity: number
  guests: Guest[]
}

export default function SeatingArrangement() {
  const [tables, setTables] = useState<Table[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [newTable, setNewTable] = useState<Partial<Table>>({})

  useEffect(() => {
    // In a real application, these would be API calls
    const fetchTables = async () => {
      const response = await fetch("/api/tables")
      const data = await response.json()
      setTables(data)
    }
    const fetchGuests = async () => {
      const response = await fetch("/api/guests")
      const data = await response.json()
      setGuests(data)
    }
    fetchTables()
    fetchGuests()
  }, [])

  const addTable = async () => {
    // In a real application, this would be an API call
    const tableWithId = { ...newTable, id: Date.now().toString(), guests: [] }
    setTables([...tables, tableWithId as Table])
    setNewTable({})
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const sourceTable = tables.find((table) => table.id === result.source.droppableId)
    const destTable = tables.find((table) => table.id === result.destination.droppableId)

    if (sourceTable && destTable) {
      const [reorderedItem] = sourceTable.guests.splice(result.source.index, 1)
      destTable.guests.splice(result.destination.index, 0, reorderedItem)

      setTables([...tables])
    }
  }

  const generateSeatingChart = async () => {
    // In a real application, this would call an AI service to generate optimal seating
    alert("מפת הושבה נוצרה בהצלחה!")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">סידורי ישיבה</h1>
      <Button onClick={generateSeatingChart} className="mb-4">
        צור מפת הושבה אוטומטית
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>הוסף שולחן חדש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Input
                value={newTable.name || ""}
                onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                placeholder="שם השולחן"
              />
              <Input
                type="number"
                value={newTable.capacity || ""}
                onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                placeholder="קיבולת"
              />
              <Button onClick={addTable}>הוסף שולחן</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>אורחים ללא שולחן</CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="unassigned">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {guests
                      .filter((guest) => !tables.some((table) => table.guests.some((g) => g.id === guest.id)))
                      .map((guest, index) => (
                        <Draggable key={guest.id} draggableId={guest.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 p-2 mb-2 rounded"
                            >
                              {guest.name} ({guest.group})
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <Droppable droppableId={table.id} key={table.id}>
              {(provided) => (
                <Card {...provided.droppableProps} ref={provided.innerRef}>
                  <CardHeader>
                    <CardTitle>
                      {table.name} (קיבולת: {table.capacity})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {table.guests.map((guest, index) => (
                      <Draggable key={guest.id} draggableId={guest.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded shadow"
                          >
                            {guest.name} ({guest.group})
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

