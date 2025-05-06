import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

const EmployeeChart = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [jobCounts, setJobCounts] = useState([]);
  const [jobName, setJobName] = useState([]);

  // Get all jobtitle
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.role.getRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setJobName(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  const getJobName = (id) => {
    const job = jobName.find((d) => d._id === id);
    return job ? job.name : "Unknown";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
          const jobTitleId = user.jobTitle;
          const jobTitleName = getJobName(jobTitleId);

          jobMap[jobTitleName] = (jobMap[jobTitleName] || 0) + 1;
        });

        setJobTitles(Object.keys(jobMap));
        setJobCounts(Object.values(jobMap));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#2EB67D",
    "#845EC2",
    "#D65DB1",
    "#FFC75F",
  ];

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: jobTitles,
    dataLabels: {
      enabled: false,
    },
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
              style: { fontWeight: 700 },
              color: "#333",
              formatter: function () {
                return jobCounts.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: false, // Tắt legend mặc định
    },
    colors: colors,
  };

  const chartSeries = jobCounts;

  return (
    <div className="bg-white">
      {jobTitles.length > 0 && jobCounts.length > 0 && (
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Chart bên trái */}
          <div className="flex-shrink-0">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={175}
              className="w-[175px]"
            />
          </div>

          {/* Legend bên phải */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            {jobTitles.map((title, index) => (
              <div
                key={index}
                className="flex items-center text-left space-x-2"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                ></span>
                <span className="text-sm">
                  {title} ({jobCounts[index]})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeChart;
