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
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  category: string
  assignedTo: string
  completed: boolean
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [filter, setFilter] = useState({ category: "", completed: "" })

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchTasks = async () => {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
      const uniqueCategories = [...new Set(data.map((task: Task) => task.category))]
      setCategories(uniqueCategories)
    }
    fetchTasks()
  }, [])

  const addTask = async () => {
    // In a real application, this would be an API call
    const taskWithId = { ...newTask, id: Date.now().toString(), completed: false }
    setTasks([...tasks, taskWithId as Task])
    setNewTask({})
  }

  const updateTask = async (updatedTask: Task) => {
    // In a real application, this would be an API call
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      (filter.category ? task.category === filter.category : true) &&
      (filter.completed ? String(task.completed) === filter.completed : true),
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ניהול משימות</h1>
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">רשימת משימות</TabsTrigger>
          <TabsTrigger value="add">הוסף משימה</TabsTrigger>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>רשימת משימות</CardTitle>
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
                <Select onValueChange={(value) => setFilter({ ...filter, completed: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="סנן לפי סטטוס" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="false">לא הושלם</SelectItem>
                    <SelectItem value="true">הושלם</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>כותרת</TableHead>
                    <TableHead>קטגוריה</TableHead>
                    <TableHead>תאריך יעד</TableHead>
                    <TableHead>הוקצה ל</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.category}</TableCell>
                      <TableCell>{format(new Date(task.dueDate), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) => updateTask({ ...task, completed: checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">ערוך</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ערוך משימה</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Input
                                defaultValue={task.title}
                                onChange={(e) => updateTask({ ...task, title: e.target.value })}
                                placeholder="כותרת"
                              />
                              <Select
                                onValueChange={(value) => updateTask({ ...task, category: value })}
                                defaultValue={task.category}
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
                              <Calendar
                                mode="single"
                                selected={new Date(task.dueDate)}
                                onSelect={(date) => date && updateTask({ ...task, dueDate: date })}
                              />
                              <Input
                                defaultValue={task.assignedTo}
                                onChange={(e) => updateTask({ ...task, assignedTo: e.target.value })}
                                placeholder="הוקצה ל"
                              />
                              <Textarea
                                defaultValue={task.description}
                                onChange={(e) => updateTask({ ...task, description: e.target.value })}
                                placeholder="תיאור"
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
              <CardTitle>הוסף משימה חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input
                  value={newTask.title || ""}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="כותרת"
                />
                <Select onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
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
                <Calendar
                  mode="single"
                  selected={newTask.dueDate}
                  onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                />
                <Input
                  value={newTask.assignedTo || ""}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="הוקצה ל"
                />
                <Textarea
                  value={newTask.description || ""}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="תיאור"
                />
                <Button onClick={addTask}>הוסף משימה</Button>
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

