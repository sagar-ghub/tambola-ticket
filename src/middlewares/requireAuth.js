const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    return res.status(401).json({ error: 1, msg: "Unauthorized access" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 1, msg: "Unauthorized access" });
    }

    const { id } = payload;
    req.user = payload;

    next();
  });
};
