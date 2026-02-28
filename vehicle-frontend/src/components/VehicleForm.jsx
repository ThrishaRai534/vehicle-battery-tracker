import { useState } from "react";
import api from "../services/api";

const VehicleForm = ({
  type = "vehicle",
  vehicleId,
  onVehicleAdded,
  onBatteryAdded,
}) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (type === "vehicle") {
        const res = await api.post("/vehicles", {
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          color: formData.color,
        });

        onVehicleAdded(res.data);
      } else {
        const res = await api.post(
          `/vehicles/${vehicleId}/battery`,
          {
            level: Number(formData.level),
          }
        );

        onBatteryAdded(res.data.batteryHistory);
      }

      setFormData({
        brand: "",
        model: "",
        year: "",
        color: "",
        level: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error && (
        <div className="error-box">{error}</div>
      )}

      {type === "vehicle" ? (
        <>
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
          />
        </>
      ) : (
        <input
          type="number"
          name="level"
          placeholder="Battery %"
          value={formData.level}
          onChange={handleChange}
          min="0"
          max="100"
          required
        />
      )}

      <button
        className="button button-primary"
        disabled={loading}
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};

export default VehicleForm;