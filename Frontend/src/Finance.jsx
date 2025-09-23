"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Search,
  X,
  Plus,
  Loader2,
  Camera,
  Printer,
  FileText,
  Users,
  RotateCcw,
  Car,
  MoreHorizontal,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock UI Components (replace with your actual UI library)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => <div className="p-6 pb-0">{children}</div>

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

const Button = ({ children, onClick, variant = "default", size = "default", className = "", type = "button" }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
  }
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
)

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span>{value || "Select..."}</span>
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value)
                setIsOpen(false)
              },
            }),
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ children, value, onClick }) => (
  <div onClick={onClick} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
    {children}
  </div>
)

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
)

// Demo data and utility functions
const demoFinanceEntries = [
  {
    type: "Income",
    category: "Event Payment",
    amount: 15000,
    date: "2024-12-15",
    notes: "Wedding photography - Amit Sharma",
    createdAt: "2024-12-15T10:00:00Z",
  },
  {
    type: "Expense",
    category: "camera",
    amount: 2500,
    date: "2024-12-10",
    notes: "New lens for Canon camera",
    createdAt: "2024-12-10T14:30:00Z",
  },
  {
    type: "Income",
    category: "Deposit",
    amount: 5000,
    date: "2024-12-12",
    notes: "Advance payment - Corporate event",
    createdAt: "2024-12-12T09:15:00Z",
  },
  {
    type: "Expense",
    category: "travelling",
    amount: 800,
    date: "2024-12-08",
    notes: "Travel to Bangalore for event",
    createdAt: "2024-12-08T16:45:00Z",
  },
  {
    type: "Income",
    category: "Additional Services",
    amount: 3000,
    date: "2024-12-05",
    notes: "Extra editing work - Priya Verma",
    createdAt: "2024-12-05T11:30:00Z",
  },
  {
    type: "Expense",
    category: "printer",
    amount: 1200,
    date: "2024-12-03",
    notes: "Photo printing supplies",
    createdAt: "2024-12-03T13:20:00Z",
  },
]

const incomeCategories = ["Event Payment", "Deposit", "Additional Services", "Refund Recovery", "Other Income"]
const expenseCategories = ["camera", "printer", "paper", "porter", "refurbished", "travelling", "miscellaneous"]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case "camera":
      return <Camera className="h-4 w-4" />
    case "printer":
      return <Printer className="h-4 w-4" />
    case "paper":
      return <FileText className="h-4 w-4" />
    case "porter":
      return <Users className="h-4 w-4" />
    case "refurbished":
      return <RotateCcw className="h-4 w-4" />
    case "travelling":
      return <Car className="h-4 w-4" />
    default:
      return <MoreHorizontal className="h-4 w-4" />
  }
}

// Analytics Cards Component
function FinanceAnalytics({ entries }) {
  const analytics = useMemo(() => {
    const totalIncome = entries.filter((e) => e.type === "Income").reduce((sum, e) => sum + e.amount, 0)
    const totalExpenses = entries.filter((e) => e.type === "Expense").reduce((sum, e) => sum + e.amount, 0)
    const netBalance = totalIncome - totalExpenses
    const largestExpense = entries
      .filter((e) => e.type === "Expense")
      .reduce((max, e) => (e.amount > max ? e.amount : max), 0)

    return { totalIncome, totalExpenses, netBalance, largestExpense }
  }, [entries])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalIncome)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(analytics.totalExpenses)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className={`h-5 w-5 ${analytics.netBalance >= 0 ? "text-green-500" : "text-red-500"}`} />
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${analytics.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(analytics.netBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Largest Expense</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.largestExpense)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Add Entry Form Component
function AddEntryForm({ onAddEntry }) {
  const [formData, setFormData] = useState({
    type: "Income",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const [errors, setErrors] = useState({})

  const categories = formData.type === "Income" ? incomeCategories : expenseCategories

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) newErrors.amount = "Valid amount is required"
    if (!formData.date) newErrors.date = "Date is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newEntry = {
      type: formData.type,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      notes: formData.notes,
    }

    onAddEntry(newEntry)
    setFormData({
      type: "Income",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    })
    setErrors({})
    alert(`${formData.type} entry added successfully!`)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Finance Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, type: value, category: "" }))
                setErrors((prev) => ({ ...prev, category: "" }))
              }}
            >
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, category: value }))
                setErrors((prev) => ({ ...prev, category: "" }))
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center space-x-2">
                    {formData.type === "Expense" && getCategoryIcon(category)}
                    <span>{category}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
                setErrors((prev) => ({ ...prev, amount: "" }))
              }}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, date: e.target.value }))
                setErrors((prev) => ({ ...prev, date: "" }))
              }}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Optional notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Add Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Chart Component
function FinanceChart({ entries }) {
  const chartData = useMemo(() => {
    const monthlyData = {}

    entries.forEach((entry) => {
      const date = new Date(entry.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthLabel = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthLabel, income: 0, expenses: 0 }
      }

      if (entry.type === "Income") {
        monthlyData[monthKey].income += entry.amount
      } else {
        monthlyData[monthKey].expenses += entry.amount
      }
    })

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
  }, [entries])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Income vs Expenses Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Transactions Table Component
function TransactionsTable({ entries, searchTerm, typeFilter, categoryFilter }) {
  const filteredEntries = useMemo(() => {
    let filtered = entries

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.category.toLowerCase().includes(term) ||
          entry.notes.toLowerCase().includes(term) ||
          entry.amount.toString().includes(term),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((entry) => entry.type === typeFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((entry) => entry.category === categoryFilter)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [entries, searchTerm, typeFilter, categoryFilter])

  if (filteredEntries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
          <p className="text-gray-600">No transactions match your current filters.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      className={entry.type === "Income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {entry.type === "Income" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {entry.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {entry.type === "Expense" && getCategoryIcon(entry.category)}
                      <span className="text-sm text-gray-900">{entry.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${entry.type === "Income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {entry.type === "Income" ? "+" : "-"}
                      {formatCurrency(entry.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{entry.notes || "-"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Finance Page Component
export default function FinancePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Initialize with demo data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Add IDs to demo data
        const entriesWithIds = demoFinanceEntries.map((entry, index) => ({
          ...entry,
          _id: `finance_${index + 1}`,
          createdAt: entry.createdAt,
        }))

        setEntries(entriesWithIds)
      } catch (error) {
        console.error("Error loading finance data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Get unique categories for filter
  const allCategories = useMemo(() => {
    return Array.from(new Set(entries.map((entry) => entry.category)))
  }, [entries])

  const handleAddEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      _id: `finance_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => [entryWithId, ...prev])
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setCategoryFilter("all")
  }

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Category", "Amount", "Notes"]
    const csvContent = [
      headers.join(","),
      ...entries.map((entry) =>
        [entry.date, entry.type, `"${entry.category}"`, entry.amount, `"${entry.notes.replace(/"/g, '""')}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `finance_${new Date().toISOString().split("T")[0]}.csv`
    link.click()

    alert("Finance data exported successfully!")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading finance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600 mt-1">Track income and expenses for your event business</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <FinanceAnalytics entries={entries} />

      {/* Add Entry Form */}
      <AddEntryForm onAddEntry={handleAddEntry} />

      {/* Chart */}
      <FinanceChart entries={entries} />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by category, notes, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>

            {(searchTerm || typeFilter !== "all" || categoryFilter !== "all") && (
              <Button variant="outline" onClick={handleClearFilters} size="sm">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
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
