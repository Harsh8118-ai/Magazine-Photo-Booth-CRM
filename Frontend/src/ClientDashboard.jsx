import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Phone, MessageCircle, User, Calendar, AlertCircle } from "lucide-react";

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

  const [message, setMessage] = useState("");

  const addClient = async () => {
    if (!form.name || !form.phone) {
      setMessage("⚠️ Name & Phone required");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // ❌ If number already exists or any error — show message and reset form
        setMessage(data.error || "Something went wrong");
        setForm({
          name: "",
          eventType: "",
          eventDate: "",
          eventLocation: "",
          phone: "",
        });
        return;
      }

      // ✅ Success case — add to list and reset form
      setClients([...clients, data]);
      setForm({
        name: "",
        eventType: "",
        eventDate: "",
        eventLocation: "",
        phone: "",
      });
      setMessage("✅ Client added successfully!");
    } catch (err) {
      console.error("Add client error:", err);
      setMessage("❌ Server error");
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

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const totalClients = clients.length;
  const contacted = clients.filter((c) => c.called || c.messaged || c.status === "Contacted").length;
  const upcoming = clients.filter((c) => {
    if (!c.eventDate) return false;
    const diff = Math.ceil((new Date(c.eventDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;
  const pending = clients.filter((c) => !(c.called || c.messaged) && (c.status === "New" || !c.status)).length;

  let filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.eventType && c.eventType.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filter === "called") matchesFilter = c.called;
    if (filter === "messaged") matchesFilter = c.messaged;
    if (filter === "createdat") {
      const createdDate = new Date(c.createdAt);
      const today = new Date();
      matchesFilter =
        createdDate.toDateString() === date.toDateString(); 
    }
    if (filter === "upcoming") {
      const eventDate = new Date(c.eventDate);
      const today = new Date();
      matchesFilter = eventDate >= today;
    }
    return matchesSearch && matchesFilter;
  });

  filteredClients = [...filteredClients].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (sortConfig.key === "eventDate") {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    } else if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">Client Overview</h1>

      {message && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 text-sm sm:text-base rounded text-center">
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: <User className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />, label: "Total Clients", value: totalClients },
          { icon: <MessageCircle className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />, label: "Contacted", value: contacted },
          { icon: <Calendar className="text-yellow-600 w-5 h-5 sm:w-6 sm:h-6" />, label: "Upcoming (7 days)", value: upcoming },
          { icon: <AlertCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />, label: "Pending Follow-ups", value: pending },
        ].map((item, i) => (
          <Card key={i} className="bg-gray-200 border border-gray-300">
            <CardContent className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4">
              <div>{item.icon}</div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                <p className="text-sm sm:text-lg font-semibold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Client Form */}
      <Card className="bg-gray-200 border border-gray-300">
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-4">
            <Input placeholder="Client Name *" name="name" value={form.name} onChange={handleChange} />
            <Input placeholder="Event Type" name="eventType" value={form.eventType} onChange={handleChange} />
            <Input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} />
            <Input placeholder="Event Location" name="eventLocation" value={form.eventLocation} onChange={handleChange} />
            <Input placeholder="Phone Number *" name="phone" value={form.phone} onChange={handleChange} />
            <Button onClick={addClient} className="bg-green-600 w-full sm:w-auto">
              Add Client
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <Input
              placeholder="Search by name, phone, event type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="all">All Clients</option>
              <option value="called">Called</option>
              <option value="messaged">Messaged</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="createdat">Created At</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm justify-center sm:justify-start">
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">Overdue</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Within 7 days</span>
            <span className="px-2 py-1 bg-violet-100 text-violet-800 rounded-full">Future</span>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left cursor-pointer" onClick={() => requestSort("name")}>NAME {getSortIndicator("name")}</th>
                <th className="p-2 text-left cursor-pointer" onClick={() => requestSort("eventType")}>EVENT {getSortIndicator("eventType")}</th>
                <th className="p-2 text-left cursor-pointer w-[80px]" onClick={() => requestSort("eventDate")}>DATE {getSortIndicator("eventDate")}</th>
                <th className="p-2 text-left hidden md:table-cell">LOCATION</th>
                <th className="p-2 text-left cursor-pointer" onClick={() => requestSort("phone")}>PHONE {getSortIndicator("phone")}</th>
                <th className="p-2 text-center">WA</th>
                <th className="p-2 text-center">CALL</th>
                <th className="p-2 text-center hidden sm:table-cell">MSG</th>
                <th className="p-2 text-center hidden sm:table-cell">CALLED</th>
                <th className="p-2 text-left hidden lg:table-cell">NOTE</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => {
                const diffDays = c.eventDate
                  ? Math.ceil((new Date(c.eventDate) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;
                const rowClass =
                  diffDays !== null
                    ? diffDays < 0
                      ? "bg-red-50"
                      : diffDays <= 7
                        ? "bg-yellow-50"
                        : ""
                    : "";
                return (
                  <tr key={c._id} className={`${rowClass} hover:bg-gray-100`}>
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.eventType}</td>
                    <td className="p-2">
                      {c.eventDate
                        ? new Date(c.eventDate).toLocaleDateString("en-GB", {
                          day: "2-digit",  
                          month: "short",
                        }).toUpperCase()
                        : "-"}
                    </td>
                    <td className="p-2 hidden md:table-cell">{c.eventLocation}</td>
                    <td className="p-2">{c.phone}</td>
                    <td className="p-2 text-center">
                      <a
                        href={`https://wa.me/${c.phone.startsWith("+91")
                            ? c.phone.slice(1)
                            : c.phone.length === 10
                              ? `91${c.phone}`
                              : c.phone
                          }`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-green-100 text-green-600 p-1 rounded hover:bg-green-200"
                      >
                        <MessageCircle size={16} />
                      </a>
                    </td>
                    <td className="p-2 text-center">
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200"
                      >
                        <Phone size={16} />
                      </a>
                    </td>
                    <td className="p-2 text-center hidden sm:table-cell">
                      <input
                        type="checkbox"
                        checked={c.messaged}
                        onChange={(e) => toggleStatus(c._id, "messaged", e.target.checked)}
                      />
                    </td>
                    <td className="p-2 text-center hidden sm:table-cell">
                      <input
                        type="checkbox"
                        checked={c.called}
                        onChange={(e) => toggleStatus(c._id, "called", e.target.checked)}
                      />
                    </td>
                    <td className="p-2 hidden lg:table-cell">
                      <Textarea
                        placeholder="Add note..."
                        value={c.note || ""}
                        onChange={(e) => updateNote(c._id, e.target.value)}
                        className="min-h-[38px]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

