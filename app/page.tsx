import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-pink-100 to-purple-100">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">ברוכים הבאים לחתונה חכמה</h1>
      <p className="text-xl mb-12 text-center text-gray-600 max-w-2xl">
        הפלטפורמה המושלמת לתכנון החתונה שלכם. נהלו את כל ההיבטים של היום המיוחד שלכם במקום אחד.
      </p>
      <Link href="/dashboard" passHref>
        <Button size="lg" className="text-lg">
          התחילו לתכנן את החתונה שלכם
        </Button>
      </Link>
    </main>
  )
}

