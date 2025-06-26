// src/components/FurnitureChart.jsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FurnitureChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Bueno', 'Regular', 'Malo'],
    datasets: [
      {
        label: 'Cantidad',
        data: [0, 0, 0],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'muebles'));
      const counts = { Bueno: 0, Regular: 0, Malo: 0 };

      snapshot.forEach(doc => {
        const estado = doc.data().estado;
        if (counts[estado] !== undefined) {
          counts[estado]++;
        }
      });

      setChartData(prev => ({
        ...prev,
        datasets: [{ ...prev.datasets[0], data: [counts.Bueno, counts.Regular, counts.Malo] }],
      }));
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto text-white">
      <h2 className="text-center text-2xl font-bold mb-4">Estado de Muebles</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default FurnitureChart;