"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Task {
  id: string
  description: string
  assignedTo: string
  completed: boolean
}

interface Decision {
  id: string
  topic: string
  options: string[]
  selectedOption: string | null
}

export default function CollaborativePlanning() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ description: "", assignedTo: "" })
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [newDecision, setNewDecision] = useState({ topic: "", options: ["", ""] })

  useEffect(() => {
    // In a real application, these would be API calls
    const fetchTasks = async () => {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    }
    const fetchDecisions = async () => {
      const response = await fetch("/api/decisions")
      const data = await response.json()
      setDecisions(data)
    }
    fetchTasks()
    fetchDecisions()
  }, [])

  const addTask = async () => {
    // In a real application, this would be an API call
    const newTaskWithId = { ...newTask, id: Date.now().toString(), completed: false }
    setTasks([...tasks, newTaskWithId])
    setNewTask({ description: "", assignedTo: "" })
  }

  const toggleTask = async (id: string) => {
    // In a real application, this would be an API call
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const addDecision = async () => {
    // In a real application, this would be an API call
    const newDecisionWithId = { ...newDecision, id: Date.now().toString(), selectedOption: null }
    setDecisions([...decisions, newDecisionWithId])
    setNewDecision({ topic: "", options: ["", ""] })
  }

  const makeDecision = async (id: string, option: string) => {
    // In a real application, this would be an API call
    setDecisions(decisions.map((decision) => (decision.id === id ? { ...decision, selectedOption: option } : decision)))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">תכנון משותף</h1>
      <Tabs defaultValue="tasks">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">משימות</TabsTrigger>
          <TabsTrigger value="decisions">החלטות</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>משימות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="תיאור המשימה"
                />
                <Input
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="מוקצה ל"
                />
                <Button onClick={addTask}>הוסף משימה</Button>
              </div>
              <ul>
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                    <span className={task.completed ? "line-through" : ""}>
                      {task.description} (מוקצה ל: {task.assignedTo})
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>החלטות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <Input
                  value={newDecision.topic}
                  onChange={(e) => setNewDecision({ ...newDecision, topic: e.target.value })}
                  placeholder="נושא ההחלטה"
                />
                {newDecision.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newDecision.options]
                      newOptions[index] = e.target.value
                      setNewDecision({ ...newDecision, options: newOptions })
                    }}
                    placeholder={`אפשרות ${index + 1}`}
                  />
                ))}
                <Button onClick={() => setNewDecision({ ...newDecision, options: [...newDecision.options, ""] })}>
                  הוסף אפשרות
                </Button>
                <Button onClick={addDecision}>הוסף החלטה</Button>
              </div>
              {decisions.map((decision) => (
                <Card key={decision.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{decision.topic}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {decision.options.map((option) => (
                      <Button
                        key={option}
                        onClick={() => makeDecision(decision.id, option)}
                        variant={decision.selectedOption === option ? "default" : "outline"}
                        className="mr-2 mb-2"
                      >
                        {option}
                      </Button>
                    ))}
                    {decision.selectedOption && <p className="mt-2">החלטה: {decision.selectedOption}</p>}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

