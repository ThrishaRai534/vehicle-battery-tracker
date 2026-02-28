import { useState } from "react";
import VehicleForm from "./VehicleForm";

const VehicleCard = ({ vehicle, onBatteryAdded }) => {
  const [showBatteryForm, setShowBatteryForm] = useState(false);

  const latestBattery =
    vehicle.batteryHistory.length > 0
      ? vehicle.batteryHistory[vehicle.batteryHistory.length - 1].level
      : "N/A";

  return (
    <div className="card vehicle-card">
      <div className="vehicle-header">
        <h3>
          {vehicle.brand} {vehicle.model}
        </h3>
        <span className="vehicle-year">
          {vehicle.year}
        </span>
      </div>

      <p className="vehicle-color">
        Color: {vehicle.color || "Not specified"}
      </p>

      <div className="battery-section">
        <h4>Current Battery</h4>
        <div className="battery-level">
          {latestBattery !== "N/A"
            ? `${latestBattery}%`
            : "No data yet"}
        </div>
      </div>

      <button
        className="button button-primary"
        onClick={() =>
          setShowBatteryForm(!showBatteryForm)
        }
      >
        {showBatteryForm
          ? "Cancel"
          : "Add Battery Entry"}
      </button>

      {showBatteryForm && (
        <VehicleForm
          vehicleId={vehicle._id}
          onBatteryAdded={(updatedHistory) => {
            onBatteryAdded(vehicle._id, updatedHistory);
            setShowBatteryForm(false);
          }}
          type="battery"
        />
      )}
    </div>
  );
};

export default VehicleCard;