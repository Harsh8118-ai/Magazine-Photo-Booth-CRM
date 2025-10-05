import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Badge } from "./components/ui/badge"
import { useToast } from "./hooks/use-toast"
import {
  Filter,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Phone,
  MessageCircle,
  User,
  Briefcase,
  MapPin,
  Loader2,
} from "lucide-react"

// Utility functions
const getDaysDiff = (eventDate) => {
  const today = new Date()
  const event = new Date(eventDate)
  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800"
    case "Contacted":
      return "bg-indigo-100 text-indigo-800"
    case "Interested":
      return "bg-amber-100 text-amber-800"
    case "Confirmed":
      return "bg-green-100 text-green-800"
    case "Completed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getEventUrgencyColor = (diffDays) => {
  if (diffDays < 0) return "text-red-600"
  if (diffDays >= 0 && diffDays <= 7) return "text-yellow-600"
  return "text-muted-foreground"
}

// Filter Chip Component
function FilterChip({ label, active, onClick, onRemove }) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={`cursor-pointer transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
      onClick={onClick}
    >
      {label}
      {active && onRemove && (
        <X
          className="h-3 w-3 ml-1 hover:bg-primary-foreground/20 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        />
      )}
    </Badge>
  )
}

// Client Card Component
function ClientCard({ client }) {
  const diffDays = getDaysDiff(client.eventDate)
  const urgencyColor = getEventUrgencyColor(diffDays)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between w-full">
          {/* Left: Name + Event Type */}
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{client.name}</span>
            </CardTitle>

            <div className="flex items-center space-x-2 mt-1">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{client.eventType}</span>
            </div>
          </div>

          {/* Right: Created At + Status */}
          <div className="flex flex-col items-end space-y-1">
            <span className="text-xs text-muted-foreground">
              {new Date(client.createdAt).toLocaleDateString()}
            </span>
            <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm ${urgencyColor}`}>
            {client.eventDate ? new Date(client.eventDate).toLocaleDateString() : "No date set"}
          </span>
          {diffDays < 0 && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
          {diffDays >= 0 && diffDays <= 7 && (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
              Upcoming
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{client.eventLocation || "Location TBD"}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{client.phone}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <MessageCircle className={`h-4 w-4 ${client.messaged ? "text-green-600" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">{client.messaged ? "Messaged" : "Not messaged"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className={`h-4 w-4 ${client.called ? "text-green-600" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">{client.called ? "Called" : "Not called"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
              <a
                href={`https://wa.me/${client.phone.startsWith("+91") ? client.phone.slice(1) : client.phone.length === 10 ? `91${client.phone}` : client.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${client.name}`}
              >
                <MessageCircle className="h-3 w-3 text-green-600" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
              <a href={`tel:${client.phone}`} aria-label={`Call ${client.name}`}>
                <Phone className="h-3 w-3 text-primary" />
              </a>
            </Button>
          </div>
        </div>

        {client.note && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">{client.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Features() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [activeFilters, setActiveFilters] = useState([])
  const { toast } = useToast()

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/clients`)
      .then((res) => res.json())
      .then((data) => setClients(data))
      .then(() => setLoading(false))
      .catch((err) => console.error("Fetch error:", err));
  }, [BASE_URL]);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...clients]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.phone.includes(term) ||
          client.eventType.toLowerCase().includes(term) ||
          client.eventLocation.toLowerCase().includes(term),
      )
    }

    activeFilters.forEach((filter) => {
      switch (filter) {
        case "messaged":
          filtered = filtered.filter((c) => c.messaged)
          break
        case "called":
          filtered = filtered.filter((c) => c.called)
          break
        case "upcoming":
          filtered = filtered.filter((c) => {
            const diffDays = getDaysDiff(c.eventDate)
            return diffDays >= 0 && diffDays <= 7
          })
          break
        case "overdue":
          filtered = filtered.filter((c) => getDaysDiff(c.eventDate) < 0)
          break
        case "completed":
          filtered = filtered.filter((c) => c.status === "Completed")
          break
        default:
          break
      }
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (["eventDate", "createdAt", "updatedAt"].includes(sortField)) {
        aVal = new Date(aVal || "1970-01-01")
        bVal = new Date(bVal || "1970-01-01")
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      let comparison = 0
      if (aVal < bVal) comparison = -1
      if (aVal > bVal) comparison = 1

      return sortDirection === "desc" ? -comparison : comparison
    })

    return filtered
  }, [clients, searchTerm, activeFilters, sortField, sortDirection])

  const toggleFilter = (filter) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setActiveFilters([])
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading client data...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sorting & Filtering Playground</h1>
          <p className="text-muted-foreground mt-1">Advanced filtering and sorting tools for client management</p>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, phone, event type, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Sort by:</Label>
                <Select value={sortField} onValueChange={(value) => setSortField(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created At</SelectItem>
                    <SelectItem value="updatedAt">Updated At</SelectItem>
                    <SelectItem value="eventDate">Event Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="flex items-center space-x-2"
              >
                {getSortIcon(sortField)}
                <span>{sortDirection === "asc" ? "Ascending" : "Descending"}</span>
              </Button>
            </div>

            {/* Filter Chips */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Filters:</Label>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="Messaged"
                  active={activeFilters.includes("messaged")}
                  onClick={() => toggleFilter("messaged")}
                  onRemove={() => toggleFilter("messaged")}
                />
                <FilterChip
                  label="Called"
                  active={activeFilters.includes("called")}
                  onClick={() => toggleFilter("called")}
                  onRemove={() => toggleFilter("called")}
                />
                <FilterChip
                  label="Upcoming"
                  active={activeFilters.includes("upcoming")}
                  onClick={() => toggleFilter("upcoming")}
                  onRemove={() => toggleFilter("upcoming")}
                />
                <FilterChip
                  label="Overdue"
                  active={activeFilters.includes("overdue")}
                  onClick={() => toggleFilter("overdue")}
                  onRemove={() => toggleFilter("overdue")}
                />
                <FilterChip
                  label="Completed"
                  active={activeFilters.includes("completed")}
                  onClick={() => toggleFilter("completed")}
                  onRemove={() => toggleFilter("completed")}
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || activeFilters.length > 0) && (
              <Button variant="outline" onClick={clearAllFilters} size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {(searchTerm || activeFilters.length > 0) && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Active filters:</span>
            {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary">
                {filter}
              </Badge>
            ))}
            <span className="text-muted-foreground">
              ({filteredAndSortedClients.length} of {clients.length} clients)
            </span>
          </div>
        </div>
      )}

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedClients.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No clients match your filters</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or removing some filters to see more results.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
