const express = require("express");
const router = express.Router();

const { query, param, body } = require("express-validator");
const { signup, signin } = require("../controller/UserController");
const {
  generate,
  getTickets,
  getTicketById,
} = require("../controller/TambolaContoller");
const requiredAuth = require("../middlewares/requireAuth");

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/createticket", requiredAuth, generate);
router.get("/ticket/:id", requiredAuth, getTicketById);

module.exports = router;
