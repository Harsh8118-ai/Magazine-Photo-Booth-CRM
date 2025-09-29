import Finance from "../models/finance-model.js";

export const createFinance = async (req, res) => {
    try {
        const finance = await Finance.create(req.body);
        res.status(201).json(finance);
    } catch (err) {
        res.status(400).json( { error: err.message });
    }
};

export const getFinance =  async (req, res) => {
    try {
        const finance = await Finance.find().sort( { createdAt: -1});
        res.json(finance);
    } catch (err) {
        res.status(500).json( { error : err.message });
    }
}