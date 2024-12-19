import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";

function NumberOfEmployee() {
  const { token } = useContext(AppContext); // Access token from context
  const [employeeCount, setEmployeeCount] = useState(null);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    doneTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch employee count
        const employeeRes = await fetch("http://localhost:8000/api/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!employeeRes.ok) {
          throw new Error("Failed to fetch employee count");
        }

        const employeeData = await employeeRes.json();
        setEmployeeCount(employeeData.count); // Assuming API returns employee count

        // Fetch task statistics
        const taskRes = await fetch("http://localhost:8000/api/task-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!taskRes.ok) {
          throw new Error("Failed to fetch task statistics");
        }

        const taskData = await taskRes.json();
        setTaskStats({
          totalTasks: taskData.total,
          pendingTasks: taskData.pending,
          doneTasks: taskData.done,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // token in array

  if (loading) return <p className="text-white">Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-white bg-custom-grey p-4 rounded-md shadow-lg">
        <p className="text-lg font-semibold">Number of Employees</p>
        <p className="text-2xl font-bold">{employeeCount}</p>
      </div>

      <div className="text-white bg-custom-grey p-4 rounded-md shadow-lg">
        <p className="text-lg font-semibold">Total Tasks</p>
        <p className="text-2xl font-bold">{taskStats.totalTasks}</p>
      </div>

      <div className="text-white bg-custom-grey p-4 rounded-md shadow-lg">
        <p className="text-lg font-semibold">Pending Tasks</p>
        <p className="text-2xl font-bold">{taskStats.pendingTasks}</p>
      </div>

      <div className="text-white bg-custom-grey p-4 rounded-md shadow-lg">
        <p className="text-lg font-semibold">Done Tasks</p>
        <p className="text-2xl font-bold">{taskStats.doneTasks}</p>
      </div>
    </div>
  );
}

export default NumberOfEmployee;
