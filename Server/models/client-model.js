import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eventType: { type: String },
    eventDate: { type: Date },
    eventLocation: { type: String },
    phone: { type: String, required: true },
    called: { type: Boolean, default: false },
    messaged: { type: Boolean, default: false },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
