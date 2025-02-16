import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, ShoppingBag, CheckSquare, ChevronsUpDown, PieChart, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">חתונה חכמה</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/guests"
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Users className="mr-2" size={20} />
                  ניהול מוזמנים
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/vendors"
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <ShoppingBag className="mr-2" size={20} />
                  ניהול ספקים
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tasks" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                  <CheckSquare className="mr-2" size={20} />
                  ניהול משימות
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/seating"
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <ChevronsUpDown className="mr-2" size={20} />
                  סידורי ישיבה
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/budget"
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <PieChart className="mr-2" size={20} />
                  ניהול תקציב
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                <Settings className="mr-2" size={20} />
                הגדרות
              </Link>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100">
                <LogOut className="mr-2" size={20} />
                התנתקות
              </Button>
            </li>
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

