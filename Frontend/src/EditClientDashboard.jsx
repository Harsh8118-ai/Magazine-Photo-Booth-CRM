import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Trash2 } from "lucide-react";

export default function EditClientDashboard() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState({ id: null, field: null });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "eventDate", direction: "asc" });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // fetch clients
  useEffect(() => {
    fetch(`${BASE_URL}/clients`)
      .then((res) => res.json())
      .then(setClients)
      .catch((err) => console.error("Fetch error:", err));    
  }, [BASE_URL]);

  // inline field update
  const handleFieldEdit = async (id, field, value) => {
    try {
      const res = await fetch(`${BASE_URL}/clients/${id}/field`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const data = await res.json();
      setClients(clients.map((c) => (c._id === id ? data : c)));
      setEditing({ id: null, field: null });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // delete full client
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await fetch(`${BASE_URL}/clients/${id}`, {
        method: "DELETE",
      });  
      setClients(clients.filter((c) => c._id !== id));   
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // sorting
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

  // filter + search
  let filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      (c.eventType && c.eventType.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filter === "called") matchesFilter = c.called;
    if (filter === "messaged") matchesFilter = c.messaged;
    if (filter === "upcoming") {
      const eventDate = new Date(c.eventDate);
      matchesFilter = eventDate >= new Date();
    }
    return matchesSearch && matchesFilter;
  });

  // sorting logic
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold">✏️ Edit Client Dashboard</h1>

      {/* Search + Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Input
              placeholder="Search by name, phone, event type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Clients</option>
              <option value="called">Called</option>
              <option value="messaged">Messaged</option>
              <option value="upcoming">Upcoming Events</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Editable Clients Table */}
      <Card>
        <CardContent className="overflow-auto p-0">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 cursor-pointer" onClick={() => requestSort("name")}>
                  NAME {getSortIndicator("name")}
                </th>
                <th className="p-2 cursor-pointer" onClick={() => requestSort("eventType")}>
                  EVENT TYPE {getSortIndicator("eventType")}
                </th>
                <th className="p-2 cursor-pointer" onClick={() => requestSort("eventDate")}>
                  DATE {getSortIndicator("eventDate")}
                </th>
                <th className="p-2">LOCATION</th>
                <th className="p-2 cursor-pointer" onClick={() => requestSort("phone")}>
                  PHONE {getSortIndicator("phone")}
                </th>
                <th className="p-2">STATUS</th>
                <th className="p-2">NOTE</th>
                <th className="p-2 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  {["name", "eventType", "eventDate", "eventLocation", "phone", "status", "note"].map(
                    (field) => (
                      <td
                        key={field}
                        className="p-2 border cursor-pointer"
                        onClick={() => setEditing({ id: c._id, field })}
                      >
                        {editing.id === c._id && editing.field === field ? (
                          field === "note" ? (
                            <Textarea
                              defaultValue={c[field] || ""}
                              autoFocus
                              onBlur={(e) => handleFieldEdit(c._id, field, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleFieldEdit(c._id, field, e.target.value);
                                }
                              }}
                            />
                          ) : (
                            <Input
                              type={field === "eventDate" ? "date" : "text"}
                              defaultValue={c[field] || ""}
                              autoFocus
                              onBlur={(e) => handleFieldEdit(c._id, field, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleFieldEdit(c._id, field, e.target.value);
                                }
                              }}
                            />
                          )
                        ) : field === "eventDate" && c[field] ? (
                          new Date(c[field]).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          }).toUpperCase()
                        ) : (
                          c[field] || "-"
                        )}
                      </td>
                    )
                  )}

                  {/* Action column */}
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete client"
                    >
                      <Trash2 className="inline-block w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent> 
      </Card>
    </div>
  );
}
