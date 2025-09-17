import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eventType: { type: String },
    eventDate: { type: Date },
    eventLocation: { type: String },
    phone: { type: String, required: true },
    bookingAmount: { type: String, required: true }, 
    tokenAmount: { type: String, required: true },
    remainingAmount: { type: String, required: true },
    note: { type: String, default: "" },
    invoice: [{ type: String }] 
  },
  { timestamps: true }
);

const Orders = mongoose.model("Order", ordersSchema);
export default Orders;
