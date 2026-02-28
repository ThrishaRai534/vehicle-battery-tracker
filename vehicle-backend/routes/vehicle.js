import express from "express";
import Vehicle from "../models/Vehicle.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { brand, model, year, color } = req.body;

    if (!brand || !model || !year) {
      return res.status(400).json({
        message: "Brand, model, and year are required",
      });
    }

    const vehicle = await Vehicle.create({
      brand,
      model,
      year,
      color,
      user: req.user._id,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Create Vehicle Error:", error.message);

    res.status(500).json({
      message: "Vehicle creation failed",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    console.error("Fetch Vehicles Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch vehicles",
    });
  }
});

router.post("/:id/battery", authMiddleware, async (req, res) => {
  try {
    const { level } = req.body;

    if (level === undefined) {
      return res.status(400).json({
        message: "Battery level is required",
      });
    }

    if (level < 0 || level > 100) {
      return res.status(400).json({
        message: "Battery level must be between 0 and 100",
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Ensure ownership
    if (vehicle.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to modify this vehicle",
      });
    }

    vehicle.batteryHistory.push({
      level,
    });

    // Optional: limit history to last 100 entries
    if (vehicle.batteryHistory.length > 100) {
      vehicle.batteryHistory.shift();
    }

    await vehicle.save();

    res.json({
      message: "Battery entry added",
      batteryHistory: vehicle.batteryHistory,
    });
  } catch (error) {
    console.error("Battery Update Error:", error.message);

    res.status(500).json({
      message: "Failed to update battery history",
    });
  }
});


export default router;