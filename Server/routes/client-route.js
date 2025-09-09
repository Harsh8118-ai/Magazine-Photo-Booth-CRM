const express = require("express");
const { createClient, getClients, updateClient, deleteClient, editField} = require("../controllers/client-controllers.js");

const router = express.Router();

router.post("/", createClient);   
router.get("/", getClients);      
router.put("/:id", updateClient); 
router.delete("/:id", deleteClient); 

// ✅ New /edit route
router.patch("/:id/field", editField);

module.exports = router;
