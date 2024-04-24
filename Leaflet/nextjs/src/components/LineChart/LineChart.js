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

    const [chartData, setCharData] = useState({
        datasets: []
    })

    const [charOptions, setCharOptions] = useState({})

    useEffect( () => {
        setCharData({
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'], 
            datasets: [
                {
                    label:'QoE Data %',
                    data: [0, 85.6, 72.3, 90.2, 92.5, 93.0, 100],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235, 0.4)'
                }
            ]
        })

        setCharOptions({
            plugins: {
                legend: {
                    position : 'top'
                },
                title: {
                    display: true,
                    text: "Evolution de la QoE data"
                }
            },
            maintainAspectRatio: false,
            responsive: false
        })
    })

    return (
        <>
        <div className={styles.LineChart}>
            <Line options={charOptions} data={chartData} />
        </div>
        </>

    )
}