import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext"; // Assuming you are using AppContext to provide the token

function NumberOfTasks() {
  const { token, user } = useContext(AppContext); // Get the token and user info from context
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks for the specific employee
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:8000/api/employee/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        // Filter tasks assigned to the current user
        const employeeTasks = data.tasks.filter((task) => task.employee_id === user.id);
        setTasks(employeeTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchTasks(); // Fetch tasks only if user ID exists
    }
  }, [token, user?.id]); // user?.id

  // Count the tasks based on their status
  const countTasks = (status) => {
    return tasks.filter((task) => task.status.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div className="text-white px-6 py-4">
      <h1 className="text-2xl font-bold mb-4 text-custom-green">Your Task Summary</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-custom-grey p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold">Total Tasks</h2>
            <p>{tasks.length}</p>
          </div>
          <div className="bg-custom-grey p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold">Completed Tasks</h2>
            <p>{countTasks("done")}</p>
          </div>
          <div className="bg-custom-grey p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold">Pending Tasks</h2>
            <p>{countTasks("pending")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NumberOfTasks;
