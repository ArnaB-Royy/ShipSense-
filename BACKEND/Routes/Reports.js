const express = require("express");
const Router = express.Router();
const Shipment = require("../Models/Shipment");
const User = require("../Models/User");
const DelayCode = require("../Models/DelayCode");

// GET /api/reports — full analytics
Router.get("/", async (req, res) => {
  try {

    // ── 1. SHIPMENT STATUS BREAKDOWN ──
    const statusBreakdown = await Shipment.aggregate([
      { $group: { _id: "$Status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // ── 2. TOTAL COUNTS ──
    const totalShipments = await Shipment.countDocuments();
    const totalUsers     = await User.countDocuments();
    const activeUsers    = await User.countDocuments({ IsActive: true });
    const totalDelayed   = await Shipment.countDocuments({ Status: "Delayed" });
    const totalOnTime    = await Shipment.countDocuments({ Status: "On Time" });
    const onTimeRate     = totalShipments > 0
      ? Math.round((totalOnTime / totalShipments) * 100)
      : 0;

    // ── 3. MONTHLY TREND (last 6 months) ──
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrend = await Shipment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          delayed: {
            $sum: { $cond: [{ $eq: ["$Status", "Delayed"] }, 1, 0] }
          },
          onTime: {
            $sum: { $cond: [{ $eq: ["$Status", "On Time"] }, 1, 0] }
          },
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Fill in missing months so chart always shows 6 bars
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const trendFilled = months.map(m => {
      const found = monthlyTrend.find(t => t._id.year === m.year && t._id.month === m.month);
      return {
        label: `${monthNames[m.month - 1]} ${m.year}`,
        shortLabel: monthNames[m.month - 1],
        count:   found ? found.count   : 0,
        delayed: found ? found.delayed : 0,
        onTime:  found ? found.onTime  : 0,
      };
    });

    // ── 4. TOP SUPPLIERS ──
    const topSuppliers = await Shipment.aggregate([
      { $group: {
        _id: "$Supplier",
        total:     { $sum: 1 },
        delayed:   { $sum: { $cond: [{ $eq: ["$Status","Delayed"]   }, 1, 0] } },
        delivered: { $sum: { $cond: [{ $eq: ["$Status","Delivered"] }, 1, 0] } },
        onTime:    { $sum: { $cond: [{ $eq: ["$Status","On Time"]   }, 1, 0] } },
      }},
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // ── 5. DELAY REASON BREAKDOWN ──
    const delayReasons = await Shipment.aggregate([
      { $match: { DelayReason: { $ne: null } } },
      {
        $lookup: {
          from: "delaycodes",
          localField: "DelayReason",
          foreignField: "_id",
          as: "delayCodeDoc",
        },
      },
      { $unwind: "$delayCodeDoc" },
      {
        $group: {
          _id: "$delayCodeDoc.Code",
          reason:   { $first: "$delayCodeDoc.Reason" },
          category: { $first: "$delayCodeDoc.Category" },
          count:    { $sum: 1 },
          avgHours: { $avg: "$DelayDuration" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // ── 6. DELAY CODE STATS ──
    const totalDelayCodes  = await DelayCode.countDocuments();
    const activeDelayCodes = await DelayCode.countDocuments({ IsActive: true });

    res.json({
      success: true,
      data: {
        summary: {
          totalShipments,
          totalUsers,
          activeUsers,
          totalDelayed,
          totalOnTime,
          onTimeRate,
          totalDelayCodes,
          activeDelayCodes,
        },
        statusBreakdown,
        monthlyTrend: trendFilled,
        topSuppliers,
        delayReasons,
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = Router;