/* ******************************************
 * server.js
 ******************************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
require("dotenv").config();

const app = express();
const static = require("./routes/static");

// View engine + Pfade
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));   // <— wichtig
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static
app.use(static);

// Healthcheck (optional, hilft bei Render)
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// Index
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Host/Port (mit Fallback + 0.0.0.0 für Render)
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`app listening on ${HOST}:${PORT}`);
});
