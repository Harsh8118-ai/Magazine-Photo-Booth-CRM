import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
    {
        type: { type:String},
        category: { type:String},
        amount: { type:String},
        date: { type:Date},
        notes: { type:String}
    },
    { timestamps: true }
);

const Finance = mongoose.model("Finance", financeSchema)
export default Finance;