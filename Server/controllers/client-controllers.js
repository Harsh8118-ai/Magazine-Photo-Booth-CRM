import Client from "../models/client-model.js";

// Create client
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update client (status, note, etc.)
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Edit entire client
export const editField = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    if (!field) {
      return res.status(400).json({ message: "Field name is required" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { [field]: value }, // dynamic field update
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedClient);
  } catch (err) {
    console.error("Edit field error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

