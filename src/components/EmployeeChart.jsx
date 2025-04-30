import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

const EmployeeChart = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [jobCounts, setJobCounts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token. Không gọi API.");
      return;
    }
    axios
      .get(apiRoutes.user.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const users = response.data || [];
        const jobMap = {};

        users.forEach((user) => {
          const jobTitle = user.jobTitle;
          if (jobMap[jobTitle]) {
            jobMap[jobTitle]++;
          } else {
            jobMap[jobTitle] = 1;
          }
        });

        const titles = Object.keys(jobMap);
        const counts = Object.values(jobMap);

        setJobTitles(titles);
        setJobCounts(counts);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: jobTitles,
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "right",
      itemMargin: {
        top: -5,
        vertical: 5,
      },
      fontSize: "14px",
      formatter: function (seriesName, opts) {
        const seriesIndex = opts.seriesIndex;
        const value = jobCounts[seriesIndex];
        return `${seriesName} (${value})`;
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    colors: [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#2EB67D",
      "#845EC2",
      "#D65DB1",
      "#FFC75F",
    ],
    tooltip: {
      y: {
        formatter: (val) => `${val} employees`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "",
              fontSize: "50px",
              style: {
                fontWeight: 700,
              },
              color: "#333",
              formatter: function () {
                const total = jobCounts.reduce((a, b) => a + b, 0);
                return `${total}`;
              },
            },
          },
        },
      },
    },
  };

  const chartSeries = jobCounts;

  return (
    <div className="bg-white">
      <div className="ml-10 mt-2 mb-[-5%]">
        {jobTitles.length > 0 && jobCounts.length > 0 && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={300}
            width={400}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeChart;
