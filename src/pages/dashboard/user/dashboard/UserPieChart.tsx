/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import type { UserStatsResponse } from "@/redux/features/stats/statsApi";

interface UserPieChartProps {
  stats: UserStatsResponse["data"];
}

const UserPieChart = ({ stats }: UserPieChartProps) => {
  const pieData = {
    labels: ["Pending", "In Progress", "Solved", "Total Issues"],
    datasets: [
      {
        label: "My Issue Distribution",
        data: [
          stats.totalPending,
          stats.totalInProgress,
          stats.totalSolved,
          stats.totalIssues,
        ],
        backgroundColor: [
          "#FF6384", // Pending - Red/Pink
          "#36A2EB", // In Progress - Blue
          "#4CAF50", // Solved - Green
          "#9C27B0", // Total - Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(156, 39, 176, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(156, 39, 176, 0.8)",
        ],
        hoverBorderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(156, 39, 176, 1)",
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = stats.totalIssues;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        Issue Status Distribution
      </h1>
      <div className="flex-1 max-h-96 md:h-96">
        <Pie data={pieData} options={options} />
      </div>
    </div>
  );
};

export default UserPieChart;