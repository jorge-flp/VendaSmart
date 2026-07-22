import React from 'react';
import { Bar } from 'react-chartjs-2';
import './chartSetup';
import { AXIS_COLOR, GRID_COLOR } from './chartSetup';

export default function ProductsBarChart({ items, color = '#16A34A', label = 'Unidades vendidas' }) {
  const chartData = {
    labels: items.map((i) => i.name),
    datasets: [
      {
        label,
        data: items.map((i) => i.qtySold),
        backgroundColor: color,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: AXIS_COLOR }, grid: { color: GRID_COLOR } },
      y: { ticks: { color: AXIS_COLOR }, grid: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
}
