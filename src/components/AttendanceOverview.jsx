import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

const AttendanceOverview = () => {
  const [attendanceData, setAttendanceData] = useState({
    workFromOffice: 0,
    late: 0,
    absent: 0,
    total: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.attendance.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const records = response.data.data || [];
        const total = records.length;

        let workFromOffice = 0,
          late = 0,
          absent = 0;

        records.forEach((item) => {
          const status = item.status?.toLowerCase();
          if (status === "work from office") workFromOffice++;
          else if (status === "late") late++;
          else if (status === "absent") absent++;
        });

        setAttendanceData({ workFromOffice, late, absent, total });
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  }, []);

  const { workFromOffice, late, absent, total } = attendanceData;
  const calcPercent = (count) =>
    total > 0 ? ((count / total) * 100).toFixed(2) : 0;

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "30%",
        borderRadius: 8,
      },
    },
    xaxis: {
      categories: ["Absent", "Late", "Work from Office"],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    grid: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    legend: {
      show: true,
      position: "right",
      horizontalAlign: "center",
      itemMargin: {
        vertical: 19,
      },
      fontSize: "14px",
      markers: {
        show: false,
      },
      formatter: function (seriesName) {
        const { workFromOffice, late, absent } = attendanceData;
        const total = workFromOffice + late + absent;

        let percent = 0;
        if (seriesName === "Work from Office") {
          percent = (workFromOffice / total) * 100;
        } else if (seriesName === "Late") {
          percent = (late / total) * 100;
        } else if (seriesName === "Absent") {
          percent = (absent / total) * 100;
        }

        return `${seriesName} (${percent.toFixed(2)}%)`;
      },
    },
    colors: [
      "#FF0000", // Absent: đỏ
      "#828282", // Late: xám
      "#2EB67D", // Work from Office: xanh lá
    ],
  };

  const chartSeries = [
    {
      name: "Absent",
      data: [
        parseFloat(calcPercent(absent)),
        parseFloat(calcPercent(absent)),
        parseFloat(calcPercent(absent)),
      ],
    },
    {
      name: "Late",
      data: [
        parseFloat(calcPercent(late)),
        parseFloat(calcPercent(late)),
        parseFloat(calcPercent(late)),
      ],
    },
    {
      name: "Work from Office",
      data: [
        parseFloat(calcPercent(workFromOffice)),
        parseFloat(calcPercent(workFromOffice)),
        parseFloat(calcPercent(workFromOffice)),
      ],
    },
  ];

  return (
    <div className=" bg-white">
      <div className="mt-[-8%] mb-[-9%] ">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={200}
          width={500}
        />
      </div>
    </div>
  );
};

export default AttendanceOverview;
