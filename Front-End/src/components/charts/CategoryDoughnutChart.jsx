import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartSetup';
import { LEGEND_COLOR } from './chartSetup';

const PALETTE = ['#16A34A', '#2563EB', '#F59E0B', '#E11D48', '#9333EA', '#0EA5E9', '#F97316', '#64748B'];

export default function CategoryDoughnutChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.categoria),
    datasets: [
      {
        data: data.map((d) => d.qtd),
        backgroundColor: PALETTE,
        borderColor: '#0F172A',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: LEGEND_COLOR, boxWidth: 12, padding: 12 } },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
