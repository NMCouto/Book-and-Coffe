import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useFilter } from '../context/FilterContext'; // ✅ Hook para o filtro

// Importações e registro do ChartJS (mantém o que você já tinha)
// ...
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const MONTHLY_CATEGORY_DATA = [
    [70, 60, 85, 90], 
    [65, 55, 75, 80], 
    [75, 65, 90, 95], 
    [80, 70, 95, 100], 
];

export default function FilteredBarChart() {
  const { selectedMonth, monthNames } = useFilter();
  const currentMonthName = monthNames[selectedMonth];
  
  // ✅ Pega os dados do mês selecionado
  const currentMonthData = MONTHLY_CATEGORY_DATA[selectedMonth] || [0, 0, 0, 0];

  const data = {
    labels: ['Ficção-Científica', 'Romance', 'Fantasia', 'Outros'],
    datasets: [
      {
        label: `Vendas em ${currentMonthName}`,
        data: currentMonthData, 
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)', 
          'rgba(54, 162, 235, 0.7)',  
          'rgba(255, 206, 86, 0.7)',  
          'rgba(75, 192, 192, 0.7)', 
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
        text: `Distribuição de Vendas por Categoria em ${currentMonthName}`, // Título dinâmico
      },
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}>
        <Bar data={data} options={options} />
    </div>
  );
}