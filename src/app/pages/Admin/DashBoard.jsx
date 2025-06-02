import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Toolbar } from "primereact/toolbar";
import { ProgressSpinner } from "primereact/progressspinner";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import API_BASE_URL from "../../apiConfig";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/Statistics/summary-chart`)
      .then(res => {
        setChartData(res.data.data);
        setError(null);
      })
      .catch(err => {
        setError("Không tải được dữ liệu thống kê.");
        setChartData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const header = (
    <Toolbar>
      <div className="flex align-items-center">
        <i className="pi pi-chart-bar mr-2" style={{ fontSize: "1.5rem" }}></i>
        <h2 className="m-0">Dashboard - Thống kê tổng quan</h2>
      </div>
    </Toolbar>
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "100%" }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 m-4 border-round shadow-2">
        <div className="text-red-600">{error}</div>
      </Card>
    );
  }

  if (!chartData) return null;

  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.backgroundColor,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Card header={header} className="shadow-2 border-round p-4" style={{ minHeight: "400px" }}>
      <Bar data={data} options={options} />
    </Card>
  );
}
