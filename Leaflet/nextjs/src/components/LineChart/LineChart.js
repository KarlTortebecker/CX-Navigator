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

export default function LineChart(){

    const [chartData, setChartData] = useState({
        datasets: []
    });

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        setChartData({
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'], 
            datasets: [
                {
                    label:'QoE Data en %',
                    data: [100, 85.6, 50.3, 90.2, 92.5, 93.0, 100],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235, 0.4)'
                }
            ]
        });

        setChartOptions({
            plugins: {
                legend: {
                    position : 'top'
                },
                title: {
                    display: true,
                    text: "Evolution QoE data sur les 7 derniers jours"
                }
            },
            maintainAspectRatio: false,
            responsive: false
        });
    }, []); 

    return (
        <div className={styles.LineChart}>
            <Line options={chartOptions} data={chartData} />
        </div>
    );
}
