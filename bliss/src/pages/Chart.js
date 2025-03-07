import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Styled Components
const ChartContainer = styled.div`
    width: 80%;
    margin: auto;
    padding: 20px;
`;

const Header = styled.div`
    background: #c00;
    color: white;
    padding: 10px;
    text-align: left;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        axios.get("https://vynceianoani.helioho.st/bliss/graph.php")
            .then((response) => {
                const data = response.data;
                const monthlyData = {};

                data.forEach(item => {
                    const date = new Date(item.date_received);
                    const month = date.toLocaleString('en-US', { month: 'long' });

                    if (!monthlyData[month]) {
                        monthlyData[month] = 0;
                    }
                    monthlyData[month] += 1; // Increment the count for each item in the month
                });

                const months = Object.keys(monthlyData);
                const counts = Object.values(monthlyData);

                setChartData({
                    labels: months,
                    datasets: [{
                        label: "Count per Month",
                        backgroundColor: "#1E90FF",
                        data: counts,
                    }],
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    if (!chartData) return <p>Loading...</p>;

    return (
        <ChartContainer>
            <Header>
                <span>📊 REPORT</span>
                <span>⬇</span>
            </Header>
            <Bar data={chartData} options={{ responsive: true }} />
        </ChartContainer>
    );
};

export default BarChart;