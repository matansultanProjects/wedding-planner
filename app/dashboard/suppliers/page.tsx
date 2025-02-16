"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Supplier {
  id: string
  name: string
  category: string
  price: number
  rating: number
  area: string
}

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [priceFilter, setPriceFilter] = useState<number>(0)
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [areaFilter, setAreaFilter] = useState<string>("")

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchSuppliers = async () => {
      const response = await fetch("/api/suppliers")
      const data = await response.json()
      setSuppliers(data)
      setFilteredSuppliers(data)
    }
    fetchSuppliers()
  }, [])

  useEffect(() => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.price >= priceFilter &&
        supplier.rating >= ratingFilter &&
        (areaFilter === "" || supplier.area === areaFilter),
    )
    setFilteredSuppliers(filtered)
  }, [priceFilter, ratingFilter, areaFilter, suppliers])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">רשימת ספקים</h2>
      <div className="flex space-x-4 mb-4">
        <Input type="number" placeholder="מחיר מינימלי" onChange={(e) => setPriceFilter(Number(e.target.value))} />
        <Input type="number" placeholder="דירוג מינימלי" onChange={(e) => setRatingFilter(Number(e.target.value))} />
        <Input type="text" placeholder="אזור" onChange={(e) => setAreaFilter(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>קטגוריה: {supplier.category}</p>
              <p>מחיר: ₪{supplier.price}</p>
              <p>דירוג: {supplier.rating}/5</p>
              <p>אזור: {supplier.area}</p>
              <Button className="mt-2">צור קשר</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

