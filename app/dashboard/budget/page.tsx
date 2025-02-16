"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  paid: boolean
}

export default function BudgetManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [totalBudget, setTotalBudget] = useState(0)
  const [filter, setFilter] = useState({ category: "", paid: "" })

  useEffect(() => {
    // In a real application, these would be API calls
    const fetchExpenses = async () => {
      const response = await fetch("/api/expenses")
      const data = await response.json()
      setExpenses(data)
      const uniqueCategories = [...new Set(data.map((expense: Expense) => expense.category))]
      setCategories(uniqueCategories)
    }
    const fetchBudget = async () => {
      const response = await fetch("/api/budget")
      const data = await response.json()
      setTotalBudget(data.total)
    }
    fetchExpenses()
    fetchBudget()
  }, [])

  const addExpense = async () => {
    // In a real application, this would be an API call
    const expenseWithId = { ...newExpense, id: Date.now().toString(), paid: false }
    setExpenses([...expenses, expenseWithId as Expense])
    setNewExpense({})
  }

  const updateExpense = async (updatedExpense: Expense) => {
    // In a real application, this would be an API call
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const filteredExpenses = expenses.filter(
    (expense) =>
      (filter.category ? expense.category === filter.category : true) &&
      (filter.paid ? String(expense.paid) === filter.paid : true),
  )

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = totalBudget - totalExpenses

  const chartData = categories.map((category) => ({
    name: category,
    value: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ניהול תקציב</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="expenses">הוצאות</TabsTrigger>
          <TabsTrigger value="add">הוסף הוצאה</TabsTrigger>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>סקירה כללית של התקציב</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle>תקציב כולל</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₪{totalBudget.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>סך הוצאות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₪{totalExpenses.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>יתרה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-500" : "text-red-500"}`}>
                      ₪{remainingBudget.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>רשימת הוצאות</CardTitle>
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
                <Select onValueChange={(value) => setFilter({ ...filter, paid: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="סנן לפי סטטוס תשלום" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="false">לא שולם</SelectItem>
                    <SelectItem value="true">שולם</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>קטגוריה</TableHead>
                    <TableHead>תיאור</TableHead>
                    <TableHead>סכום</TableHead>
                    <TableHead>תאריך</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>₪{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.paid ? "שולם" : "לא שולם"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">ערוך</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ערוך הוצאה</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Select
                                onValueChange={(value) => updateExpense({ ...expense, category: value })}
                                defaultValue={expense.category}
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
                                defaultValue={expense.description}
                                onChange={(e) => updateExpense({ ...expense, description: e.target.value })}
                                placeholder="תיאור"
                              />
                              <Input
                                type="number"
                                defaultValue={expense.amount}
                                onChange={(e) => updateExpense({ ...expense, amount: Number(e.target.value) })}
                                placeholder="סכום"
                              />
                              <Input
                                type="date"
                                defaultValue={expense.date}
                                onChange={(e) => updateExpense({ ...expense, date: e.target.value })}
                              />
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="paid"
                                  checked={expense.paid}
                                  onChange={(e) => updateExpense({ ...expense, paid: e.target.checked })}
                                />
                                <label htmlFor="paid">שולם</label>
                              </div>
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
              <CardTitle>הוסף הוצאה חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Select onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
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
                  value={newExpense.description || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="תיאור"
                />
                <Input
                  type="number"
                  value={newExpense.amount || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                  placeholder="סכום"
                />
                <Input
                  type="date"
                  value={newExpense.date || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
                <Button onClick={addExpense}>הוסף הוצאה</Button>
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

