import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Phone, MessageCircle } from "lucide-react";

export default function ClientDashboard() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    phone: "",
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "eventDate", direction: "asc" });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/clients`)
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addClient = async () => {
    if (!form.name || !form.phone) return alert("Name & Phone required");

    try {
      const res = await fetch(`${BASE_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const newClient = await res.json();
      setClients([...clients, newClient]);
      setForm({ name: "", eventType: "", eventDate: "", eventLocation: "", phone: "" });
    } catch (err) {
      console.error("Add client error:", err);
    }
  };

  const toggleStatus = async (id, field, value) => {
    try {
      const res = await fetch(`${BASE_URL}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      const updatedClient = await res.json();
      setClients(clients.map((c) => (c._id === id ? updatedClient : c)));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const updateNote = async (id, value) => {
    try {
      const res = await fetch(`${BASE_URL}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: value }),
      });

      const updatedClient = await res.json();
      setClients(clients.map((c) => (c._id === id ? updatedClient : c)));
    } catch (err) {
      console.error("Note update error:", err);
    }
  };

  // Sorting handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Search + Filter
  let filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.eventType && c.eventType.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filter === "called") matchesFilter = c.called;
    if (filter === "messaged") matchesFilter = c.messaged;
    if (filter === "upcoming") {
      const eventDate = new Date(c.eventDate);
      const today = new Date();
      matchesFilter = eventDate >= today;
    }
    return matchesSearch && matchesFilter;
  });

  // Apply sorting
  filteredClients = [...filteredClients].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    // Handle date sorting
    if (sortConfig.key === "eventDate") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Client Management Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Total Clients", "Contacted", "Upcoming (7 days)", "Pending Follow-ups"].map((title, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold">
                {idx === 0
                  ? clients.length
                  : idx === 1
                    ? clients.filter(c => c.called || c.messaged || c.status === "Contacted").length
                    : idx === 2
                      ? clients.filter(c => {
                        if (!c.eventDate) return false;
                        const diff = Math.ceil((new Date(c.eventDate) - new Date()) / (1000 * 60 * 60 * 24));
                        return diff >= 0 && diff <= 7;
                      }).length
                      : clients.filter(c => !(c.called || c.messaged) && (c.status === "New" || !c.status)).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Client Form */}
      <Card className="p-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center">
            <Input placeholder="Client Name" name="name" value={form.name} onChange={handleChange} className="flex-1 min-w-[150px]" />
            <Input placeholder="Event Type" name="eventType" value={form.eventType} onChange={handleChange} className="flex-1 min-w-[120px]" />
            <Input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="flex-1 min-w-[120px]" />
            <Input placeholder="Event Location" name="eventLocation" value={form.eventLocation} onChange={handleChange} className="flex-1 min-w-[140px]" />
            <Input placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange} className="flex-1 min-w-[140px]" />
            <Button onClick={addClient} className="whitespace-nowrap w-full sm:w-auto">Add Client</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search, filter, actions */}
      <Card className="p-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Input
                placeholder="Search by name, phone, event type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                <option value="all">All Clients</option>
                <option value="called">Called</option>
                <option value="messaged">Messaged</option>
                <option value="upcoming">Upcoming Events</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 items-center">
              <Button variant="outline" className="text-sm">Export CSV</Button>
              <Button variant="outline" className="text-sm">Export XLSX</Button>
              <Button variant="outline" className="text-sm">Import</Button>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 items-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 text-red-800 px-2 py-1 text-xs font-medium">Overdue</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium">Within 7 days</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-800 px-2 py-1 text-xs font-medium">Future</span>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="p-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[60vh] rounded-md border">
            <table className="min-w-[700px] sm:min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="text-left">
                  <th className="p-2 sm:p-3 font-medium cursor-pointer" onClick={() => requestSort('name')}>Name {getSortIndicator('name')}</th>
                  <th className="p-2 sm:p-3 font-medium cursor-pointer" onClick={() => requestSort('eventType')}>Event Type {getSortIndicator('eventType')}</th>
                  <th className="p-2 sm:p-3 font-medium cursor-pointer" onClick={() => requestSort('eventDate')}>Date {getSortIndicator('eventDate')}</th>
                  <th className="hidden sm:table-cell p-2 sm:p-3 font-medium">Location</th>
                  <th className="p-2 sm:p-3 font-medium">Phone</th>
                  <th className="p-2 sm:p-3 font-medium">WhatsApp</th>
                  <th className="p-2 sm:p-3 font-medium">Call</th>
                  <th className="hidden sm:table-cell p-2 sm:p-3 font-medium cursor-pointer" onClick={() => requestSort('messaged')}>Messaged {getSortIndicator('messaged')}</th>
                  <th className="hidden sm:table-cell p-2 sm:p-3 font-medium cursor-pointer" onClick={() => requestSort('called')}>Called {getSortIndicator('called')}</th>
                  <th className="hidden md:table-cell p-2 sm:p-3 font-medium">Status</th>
                  <th className="hidden md:table-cell p-2 sm:p-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b">
                {filteredClients.map((c) => (
                  <tr key={c._id} className={`hover:bg-gray-50 ${c.eventDate && (() => {
                    const diffDays = Math.ceil((new Date(c.eventDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return diffDays < 0 ? "bg-red-50" : diffDays <= 7 ? "bg-amber-50" : "";
                  })()}`}>
                    <td className="p-2 sm:p-3">{c.name}</td>
                    <td className="p-2 sm:p-3">{c.eventType}</td>
                    <td className="p-2 sm:p-3">
                      {c.eventDate
                        ? new Date(c.eventDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        }).toUpperCase()
                        : "-"}
                    </td>
                    <td className="hidden sm:table-cell p-2 sm:p-3">{c.eventLocation}</td>
                    <td className="p-2 sm:p-3">{c.phone}</td>
                    <td className="p-2 sm:p-3">
                      <a
                        href={`https://wa.me/${c.phone.startsWith("+91") ? c.phone.slice(1) : c.phone.length === 10 ? `91${c.phone}` : c.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </td>
                    <td className="p-2 sm:p-3">
                      <a href={`tel:${c.phone}`} className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </td>
                    <td className="hidden sm:table-cell p-2 sm:p-3 text-center">
                      <input type="checkbox" checked={c.messaged} onChange={(e) => toggleStatus(c._id, "messaged", e.target.checked)} />
                    </td>
                    <td className="hidden sm:table-cell p-2 sm:p-3 text-center">
                      <input type="checkbox" checked={c.called} onChange={(e) => toggleStatus(c._id, "called", e.target.checked)} />
                    </td>
                    <td className="hidden md:table-cell p-2 sm:p-3">
                      <select value={c.status || "New"} onChange={(e) => toggleStatus(c._id, "status", e.target.value)} className="border rounded-md px-2 py-1 text-xs sm:text-sm">
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="hidden md:table-cell p-2 sm:p-3">
                      <Textarea placeholder="Add note..." value={c.note || ""} onChange={(e) => updateNote(c._id, e.target.value)} className="min-h-[38px]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
