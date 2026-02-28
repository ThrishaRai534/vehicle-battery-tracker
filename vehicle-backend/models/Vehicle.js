import mongoose from "mongoose";

const batteryEntrySchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);


const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },

    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1900,
      max: new Date().getFullYear() + 1,
    },

    color: {
      type: String,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Important for dashboard queries
    },

    batteryHistory: {
      type: [batteryEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;