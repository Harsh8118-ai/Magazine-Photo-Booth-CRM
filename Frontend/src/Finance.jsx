"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Label } from "./components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Badge } from "./components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Download, Plus, Search, Filter, X } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for initial load
const demoEntries = [
  { id: 1, date: "2025-09-01", type: "income", amount: 5000, category: "Salary", description: "September Salary" },
  { id: 2, date: "2025-09-05", type: "expense", amount: 1200, category: "Rent", description: "Monthly rent payment" },
  { id: 3, date: "2025-09-08", type: "expense", amount: 300, category: "Food", description: "Groceries" },
  { id: 4, date: "2025-09-12", type: "income", amount: 800, category: "Freelance", description: "Website project" },
  { id: 5, date: "2025-09-15", type: "expense", amount: 150, category: "Transport", description: "Uber rides" },
]

// Income/Expense categories
const incomeCategories = ["Salary", "Freelance", "Investments", "Other"]
const expenseCategories = ["Rent", "Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"]

// Analytics card component
const AnalyticsCard = ({ title, value, icon, type }) => (
  <Card className="flex-1">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-xl font-bold ${type === "income" ? "text-green-600" : type === "expense" ? "text-red-600" : "text-blue-600"}`}>
          ${value.toLocaleString()}
        </p>
      </div>
      <div className="text-muted-foreground">{icon}</div>
    </CardContent>
  </Card>
)

// Add entry form
const AddEntryForm = ({ onAdd }) => {
  const [type, setType] = useState("income")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !category || !date) return
    const newEntry = {
      id: Date.now(),
      date,
      type,
      amount: parseFloat(amount),
      category,
      description,
    }
    onAdd(newEntry)
    setAmount("")
    setCategory("")
    setDescription("")
    setDate("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Entry</Button>
    </form>
  )
}

// Transactions Table
const TransactionsTable = ({ entries, searchTerm, typeFilter, categoryFilter }) => {
  const filtered = entries.filter(entry =>
    (entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     entry.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === "all" || entry.type === typeFilter) &&
    (categoryFilter === "all" || entry.category === categoryFilter)
  )

  return (
    <div className="space-y-2">
      {filtered.map(entry => (
        <Card key={entry.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{entry.description}</p>
              <p className="text-sm text-muted-foreground">{entry.date} • {entry.category}</p>
            </div>
            <div className={`font-bold ${entry.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {entry.type === "income" ? "+" : "-"}${entry.amount}
            </div>
          </CardContent>
        </Card>
      ))}
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No entries found</p>
      )}
    </div>
  )
}

export default function FinancePage() {
  const [entries, setEntries] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      await new Promise(res => setTimeout(res, 500))
      setEntries(demoEntries)
    }
    loadData()
  }, [])

  const income = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
  const expense = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  const balance = income - expense

  const monthlyData = [
    { name: "Income", amount: income },
    { name: "Expenses", amount: expense },
  ]

  const handleAdd = (entry) => {
    setEntries([entry, ...entries])
  }

  const exportCSV = () => {
    const headers = "Date,Type,Amount,Category,Description\n"
    const rows = entries.map(e => `${e.date},${e.type},${e.amount},${e.category},${e.description}`).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "finance-data.csv"
    a.click()
  }

  return (
    <div className="space-y-6 p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard title="Total Income" value={income} icon={<TrendingUp className="h-6 w-6" />} type="income" />
        <AnalyticsCard title="Total Expenses" value={expense} icon={<TrendingDown className="h-6 w-6" />} type="expense" />
        <AnalyticsCard title="Net Balance" value={balance} icon={<DollarSign className="h-6 w-6" />} type="balance" />
      </div>

      {/* Add Entry Form */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
          <AddEntryForm onAdd={handleAdd} />
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><PieChart className="h-5 w-5" /> Monthly Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" onClick={() => setSearchTerm("")}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {[...incomeCategories, ...expenseCategories].map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        entries={entries}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
      />
    </div>
  )
}
