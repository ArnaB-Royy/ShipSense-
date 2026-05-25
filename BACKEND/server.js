const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const ShipmentRoutes  = require("./Routes/Shipments");
const UserRoutes      = require("./Routes/Users");
const DelayCodeRoutes = require("./Routes/DelayCodes");
const ReportRoutes    = require("./Routes/Reports");
const AuthRoutes      = require("./Routes/Auth");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const Connection = require("./Database/Db");
Connection();

app.use("/api/shipments",  ShipmentRoutes);
app.use("/api/users",      UserRoutes);
app.use("/api/delaycodes", DelayCodeRoutes);
app.use("/api/reports",    ReportRoutes);
app.use("/api/auth",       AuthRoutes);
app.use('/api/customers',  require('./Routes/Customer'));

app.get("/", (req, res) => res.send("ShipSense backend running"));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});