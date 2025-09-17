import Orders from "../models/orders-model.js";

export const createOrder = async (req, res) => {
    try {
        const order = await Orders.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getOrders = async (req,res) => {
    try {
        const orders = await Orders.find().sort({ createdAt: -1});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

