import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import VehicleCard from "../components/VehicleCard";
import VehicleForm from "../components/VehicleForm";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading } =
    useContext(AuthContext);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get("/vehicles");
        setVehicles(res.data);

        if (res.data.length > 0) {
          setSelectedVehicleId(res.data[0]._id);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load vehicles"
        );
      }

      setLoading(false);
    };

    fetchVehicles();
  }, []);

  // Add new vehicle to state
  const handleVehicleAdded = (vehicle) => {
    setVehicles((prev) => [vehicle, ...prev]);
  };

  // Update battery history after adding entry
  const handleBatteryUpdate = (id, updatedHistory) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v._id === id
          ? { ...v, batteryHistory: updatedHistory }
          : v
      )
    );
  };

  if (authLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  if (loading)
    return <div className="page-container">Loading...</div>;

  const selectedVehicle = vehicles.find(
    (v) => v._id === selectedVehicleId
  );

  // Chart preparation
  let chartData = null;

  if (
    selectedVehicle &&
    selectedVehicle.batteryHistory.length > 0
  ) {
    const labels =
      selectedVehicle.batteryHistory.map((entry) =>
        new Date(entry.recordedAt).toLocaleDateString()
      );

    const values =
      selectedVehicle.batteryHistory.map(
        (entry) => entry.level
      );

    chartData = {
      labels,
      datasets: [
        {
          label: "Battery %",
          data: values,
          borderColor: "#2563eb",
          backgroundColor:
            "rgba(37, 99, 235, 0.2)",
          tension: 0.3,
        },
      ],
    };
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Dashboard</h2>

      {error && (
        <div className="error-box">{error}</div>
      )}

      {/* Add Vehicle Form */}
      <div className="card">
        <h3>Add New Vehicle</h3>
        <VehicleForm
          type="vehicle"
          onVehicleAdded={handleVehicleAdded}
        />
      </div>

      {/* Empty State */}
      {vehicles.length === 0 && (
        <div className="empty-state">
          <h3>No vehicles yet</h3>
          <p>
            Add your first vehicle to start tracking
            battery usage.
          </p>
        </div>
      )}

      {/* Vehicle List */}
      {vehicles.length > 0 && (
        <>
          <div className="vehicle-selector">
            <label>Select Vehicle:</label>
            <select
              value={selectedVehicleId}
              onChange={(e) =>
                setSelectedVehicleId(
                  e.target.value
                )
              }
            >
              {vehicles.map((v) => (
                <option
                  key={v._id}
                  value={v._id}
                >
                  {v.brand} {v.model}
                </option>
              ))}
            </select>
          </div>

          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onBatteryAdded={
                  handleBatteryUpdate
                }
              />
            ))}
          </div>

          {/* Battery Chart */}
          {selectedVehicle &&
            selectedVehicle.batteryHistory
              .length > 0 && (
              <div className="card">
                <h3>
                  Battery Usage Trend
                </h3>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                      },
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;