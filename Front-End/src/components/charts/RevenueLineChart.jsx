import React from 'react';
import { Line } from 'react-chartjs-2';
import './chartSetup';
import { AXIS_COLOR, GRID_COLOR, LEGEND_COLOR } from './chartSetup';

export default function RevenueLineChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: data.map((d) => d.faturamento),
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22,163,74,0.15)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Lucro (R$)',
        data: data.map((d) => d.lucro),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: LEGEND_COLOR } } },
    scales: {
      x: { ticks: { color: AXIS_COLOR }, grid: { color: GRID_COLOR } },
      y: { ticks: { color: AXIS_COLOR }, grid: { color: GRID_COLOR } },
    },
  };

  return <Line data={chartData} options={options} />;
}
