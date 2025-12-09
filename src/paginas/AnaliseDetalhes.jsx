// src/components/BarChart.jsx (ou onde você quiser)
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnaliseDetalhes() {
  const data = {
    labels: ['Ficção-Científica', 'Romance', 'Fantasia', 'Outros'],
    datasets: [
      {
        label: 'Vendas Mensais',
        data: [65, 59, 80, 81, 56, 75,65, 59, 80, 81, 56, 75], // Seus dados aqui
        backgroundColor: [
'rgba(255, 99, 132, 0.7)', // Rosa (Ficção-Científica)
          'rgba(54, 162, 235, 0.7)',  // Azul (Romance)
          'rgba(255, 206, 86, 0.7)',  // Amarelo (Fantasia)
          'rgba(75, 192, 192, 0.7)', // Aqua/Verde (Outros)
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de Vendas Mensais',
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '600px', margin: '20px auto' }}> {/* Estilo para controle de tamanho */}
      <Bar data={data} options={options} />
    </div>
  );
}