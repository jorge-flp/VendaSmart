import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesChart() {
  const chartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Produção (R$)',
        data: [1400, 1500, 1200, 1900, 2300, 3000, 2700],
        backgroundColor: '#D97706',
        borderRadius: 4,
      },
      {
        label: 'Vendas (R$)',
        data: [1250, 1400, 1100, 1800, 2400, 3100, 2800],
        backgroundColor: '#C2410C',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#A8A29E' } },
    },
    scales: {
      x: { ticks: { color: '#78716C' }, grid: { color: '#292524' } },
      y: { ticks: { color: '#78716C' }, grid: { color: '#292524' } },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}