const express = require("express");
const path = require("path");
require("./db/index");

const router = require("./routes/router");
const app = express();

app.use(express.json());

app.use("/api", router);

app.get("/", async (req, res) => {
  try {
    return res.status(200).json({ error: 0, msg: "Server is Up and running" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: 0, msg: "hello world2" });
  }
});

// 404
app.use((req, res, next) => {
  return res
    .status(404)
    .json({ error: 1, msg: "request page " + req.url + " Not found." });
});

// 500 - Any server error
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: 1, msg: "Something broke!" });
});

module.exports = app;
