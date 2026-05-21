const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const ShipmentRoutes  = require("./Routes/Shipments");
const UserRoutes      = require("./Routes/Users");
const DelayCodeRoutes = require("./Routes/DelayCodes");
const ReportRoutes    = require("./Routes/Reports");

const app = express();

app.use(cors());
app.use(express.json());

const Connection = require("./Database/Db");
Connection();

app.use("/api/shipments",  ShipmentRoutes);
app.use("/api/users",      UserRoutes);
app.use("/api/delaycodes", DelayCodeRoutes);
app.use("/api/reports",    ReportRoutes);

app.use('/api/customers', require('./Routes/Customer'));

app.get("/", (req, res) => {
  res.send("ShipSense backend running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});