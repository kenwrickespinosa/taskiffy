import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

function TaskList({ employee, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem(token); // Example, replace with your token storage method

        // Fetch tasks with the Authorization header
        const response = await fetch(`http://localhost:8000/api/employees/${employee.id}/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Include the token in the request
          }
        });

        const data = await response.json();

        // Ensure you're accessing the correct key in the response
        setTasks(data.tasks); // Changed 'task' to 'tasks'
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employee.id]);

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("auth_token")}`,  // Include token here too
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (response.ok) {
        setTasks(tasks.map(task => (task.id === taskId ? result.data : task)));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("auth_token")}`,  // Include token here too
        },
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="p-6 bg-custom-grey rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          Tasks for {employee.name} ({employee.email})
        </h2>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Close
        </button>
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-custom-blue py-2 px-4">Title</th>
              <th className="border-b-2 border-custom-blue py-2 px-4">
                Description
              </th>
              <th className="border-b-2 border-custom-blue py-2 px-4">
                Deadline
              </th>
              <th className="border-b-2 border-custom-blue py-2 px-4">
                Status
              </th>
              <th className="border-b-2 border-custom-blue py-2 px-4">Report</th>
              <th className="border-b-2 border-custom-blue py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-custom-blue">
                <td className="py-2 px-4">{task.title}</td>
                <td className="py-2 px-4">{task.description}</td>
                <td className="py-2 px-4">{task.deadline}</td>
                <td className="py-2 px-4 capitalize">{task.status}</td>
                <td className="py-2 px-4">{task.report || "No report"}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleUpdateTask(task.id, { status: 'done' })}
                    className="bg-custom-green text-white px-4 py-1 rounded mr-2"
                  >
                    Mark as Done
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskList;
