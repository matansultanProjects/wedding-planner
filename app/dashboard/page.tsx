"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, ShoppingBag, CheckSquare, PieChart } from "lucide-react"

interface DashboardData {
  guests: { total: number; confirmed: number }
  vendors: { total: number; confirmed: number }
  tasks: { total: number; completed: number }
  budget: { total: number; spent: number }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    guests: { total: 0, confirmed: 0 },
    vendors: { total: 0, confirmed: 0 },
    tasks: { total: 0, completed: 0 },
    budget: { total: 0, spent: 0 },
  })

  useEffect(() => {
    // In a real application, this would be an API call to fetch the latest data
    const fetchDashboardData = async () => {
      // Simulating an API call
      const response = await new Promise<DashboardData>((resolve) => {
        setTimeout(() => {
          resolve({
            guests: { total: 150, confirmed: 0 },
            vendors: { total: 10, confirmed: 0 },
            tasks: { total: 50, completed: 0 },
            budget: { total: 100000, spent: 0 },
          })
        }, 1000)
      })
      setData(response)
    }

    fetchDashboardData()
  }, [])

  const calculatePercentage = (part: number, whole: number) => {
    return whole > 0 ? Math.round((part / whole) * 100) : 0
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">שלום!</h1>
      <p className="text-xl text-gray-600">
        ברוכים הבאים ללוח הבקרה שלכם. הנה סקירה מהירה של התקדמות תכנון החתונה שלכם.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מוזמנים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.guests.confirmed} / {data.guests.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(data.guests.confirmed, data.guests.total)}% אישרו הגעה
            </p>
            <Progress value={calculatePercentage(data.guests.confirmed, data.guests.total)} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ספקים</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.vendors.confirmed} / {data.vendors.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(data.vendors.confirmed, data.vendors.total)}% הושלמו
            </p>
            <Progress value={calculatePercentage(data.vendors.confirmed, data.vendors.total)} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">משימות</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.tasks.completed} / {data.tasks.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(data.tasks.completed, data.tasks.total)}% הושלמו
            </p>
            <Progress value={calculatePercentage(data.tasks.completed, data.tasks.total)} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">תקציב</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{data.budget.spent.toLocaleString()} / ₪{data.budget.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentage(data.budget.spent, data.budget.total)}% נוצל
            </p>
            <Progress value={calculatePercentage(data.budget.spent, data.budget.total)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>משימות קרובות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">אין משימות קרובות כרגע. הוסיפו משימות בעמוד ניהול המשימות.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>הוצאות אחרונות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">אין הוצאות אחרונות כרגע. הוסיפו הוצאות בעמוד ניהול התקציב.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

