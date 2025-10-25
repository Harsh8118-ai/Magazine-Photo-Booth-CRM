import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { MessageCircle, Calendar, MapPin, User, Phone } from "lucide-react";

export default function SendMessagePage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "eventDate", direction: "asc" });
  const [template, setTemplate] = useState(
    "Hey *[Client Name]*,\nYour event is coming up soon!\n\nIf you’re really interested in our *Luxury Magazine Photo Booth*, this is the last call to book.Give us a chance to make your event truly *Premium*\n\n@luxurybooth.in"
  );

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/clients`)
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

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

  let filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.eventLocation && c.eventLocation.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
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

const generateWhatsAppLink = (client) => {
  const firstName = client.name ? client.name.split(" ")[0] : "there";

  const personalized = template.replace("[Client Name]", firstName);

  const encoded = encodeURIComponent(personalized);

  const phone =
    client.phone.startsWith("+91") ? client.phone.slice(1) : `91${client.phone}`;

  return `https://wa.me/${phone}?text=${encoded}`; 
};


  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">
        ✉️ Send Personalized Messages
      </h1>

      {/* Message Template Box */}
      <Card className="bg-gray-100">
        <CardContent className="space-y-3">
          <h2 className="font-semibold text-gray-700">Message Template</h2>
          <Textarea
            rows={6}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Use <strong>[Client Name]</strong> to auto-insert client names.
          </p>
        </CardContent>
      </Card>

      {/* Search & Filter Controls */}
      <Card>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <Input
              placeholder="Search by name, phone, or location..."
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
              <option value="upcoming">Upcoming Events</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  NAME {getSortIndicator("name")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => requestSort("eventDate")}
                >
                  DATE {getSortIndicator("eventDate")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => requestSort("eventLocation")}
                >
                  LOCATION {getSortIndicator("eventLocation")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => requestSort("phone")}
                >
                  PHONE {getSortIndicator("phone")}
                </th>
                <th className="p-2 text-center">SEND</th>
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
                    <td className="p-2">
                      {c.eventDate
                        ? new Date(c.eventDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          }).toUpperCase()
                        : "-"}
                    </td>
                    <td className="p-2">{c.eventLocation || "-"}</td>
                    <td className="p-2">{c.phone}</td>
                    <td className="p-2 text-center">
                      <a
                        href={generateWhatsAppLink(c)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                      >
                        <MessageCircle size={16} className="mr-1" /> Send
                      </a>
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
