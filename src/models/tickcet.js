const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  tickets: mongoose.Schema.Types.Mixed,
});

const Ticket = new mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

// Define the schema
