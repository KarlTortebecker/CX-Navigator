import { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import styles from "@styles/Home.module.scss";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export default function LineChart({ data: initialData }){

    const defaultData = {
        labels: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        datasets: [
            {
                label: 'Data',
                data: [100, 85.6, 50.3, 90.2, 92.5, 64.86, 90.23],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.4)'
            },
            {
                label: 'Voix',
                data: [95, 90, 85, 80, 75, 93.68, 85],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.4)'
            },
            {
                label: 'SMS',
                data: [80, 85, 90, 95, 100, 81.31, 90],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.4)'
            }
        ]
    };
    const [chartData, setChartData] = useState(initialData || defaultData);

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // Si des données initiales sont fournies en tant que prop, les mettre à jour
        if (initialData) {
            setChartData(initialData);
        }

        setChartOptions({
            plugins: {
                legend: {
                    position : 'top'
                },
                title: {
                    display: true,
                    text: "Evolution QoE sur les 7 derniers jours"
                }
            },
            maintainAspectRatio: false,
            responsive: false,
            scales: {
                y: {
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            // Set the size of the canvas
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 15
                }
            },
        });
    }, [initialData]); 

    return (
        <div className={styles.LineChart}>
            <Line options={chartOptions} data={chartData} />
        </div>
    );
}
