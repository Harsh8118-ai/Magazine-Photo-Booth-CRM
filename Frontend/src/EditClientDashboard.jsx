import { useState, useEffect } from "react";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Trash2 } from "lucide-react"; // 🗑️ delete icon

export default function EditClientDashboard() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState({ id: null, field: null });
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
      setEditing({ id: null, field: null }); // stop editing
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">✏️ Edit Client Dashboard</h1>

      <div className="overflow-auto rounded-md border max-h-[70vh]">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr className="text-left">
              <th className="border p-2">Name</th>
              <th className="border p-2">Event Type</th>
              <th className="border p-2">Event Date</th>
              <th className="border p-2">Event Location</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Note</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                {[
                  "name",
                  "eventType",
                  "eventDate",
                  "eventLocation",
                  "phone",
                  "status",
                  "note",
                ].map((field) => (
                  <td
                    key={field}
                    className="border p-2 cursor-pointer"
                    onClick={() => setEditing({ id: c._id, field })}
                  >
                    {editing.id === c._id && editing.field === field ? (
                      field === "note" ? (
                        <Textarea
                          defaultValue={c[field] || ""}
                          autoFocus
                          onBlur={(e) =>
                            handleFieldEdit(c._id, field, e.target.value)
                          }
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
                          onBlur={(e) =>
                            handleFieldEdit(c._id, field, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFieldEdit(c._id, field, e.target.value);
                            }
                          }}
                        />
                      )
                    ) : field === "eventDate" && c[field] ? (
                      new Date(c[field]).toLocaleDateString("en-GB")
                    ) : (
                      c[field] || "-"
                    )}
                  </td>
                ))}

                {/* Action column */}
                <td className="border p-2 text-center">
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
      </div>
    </div>
  );
}
