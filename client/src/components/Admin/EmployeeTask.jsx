import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";

function EmployeeTasks({ employee, onClose }) {
  const { token } = useContext(AppContext); // Get token from AppContext
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskDetails, setNewTaskDetails] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/employees/${employee.id}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the header
          },
        });
        if (!response.ok) {
          throw new Error("Unauthorized access");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setTasks(data.tasks || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employee.id, token]);

  const handleUpdate = async (taskId) => {
    if (!token) {
      // Handle unauthorized if token is not present
      window.location.href = "/login";
      return;
    }

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in the header
      },
      body: JSON.stringify(newTaskDetails),
    });

    const updatedTask = await response.json();

    if (response.ok) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...newTaskDetails } : task
        )
      );
      setEditingTask(null); // Close the edit mode
    } else {
      console.error("Failed to update task:", updatedTask.message);
    }
  };

  const handleDelete = async (taskId) => {
    // Update state to remove task from list without deleting it from the database
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    // Optionally, you can log a message or handle some feedback (if needed)
    console.log(
      "Task removed from the list, but not deleted from the database"
    );
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
              <th className="border-b-2 border-custom-blue py-2 px-4">
                Report
              </th>
              <th className="border-b-2 border-custom-blue py-2 px-4">File</th>
              <th className="border-b-2 border-custom-blue py-2 px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-custom-blue">
                  <td className="py-2 px-4">{task.title}</td>
                  <td className="py-2 px-4">{task.description}</td>
                  <td className="py-2 px-4">{task.deadline}</td>
                  <td className="py-2 px-4 capitalize">{task.status}</td>
                  <td className="py-2 px-4">{task.report || "No report"}</td>
                  <td className="py-2 px-4">
                    {task.file_url ? (
                      <a
                        href={task.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View File
                      </a>
                    ) : (
                      "No file submitted"
                    )}
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingTask && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-black">Edit Task</h3>
            <div className="mt-4">
              <label className="text-black">Title</label>
              <input
                type="text"
                value={newTaskDetails.title}
                onChange={(e) =>
                  setNewTaskDetails((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder={editingTask.title}
                className="w-full px-3 py-2 border text-black"
              />
            </div>
            <div className="mt-4">
              <label className="text-black">Description</label>
              <textarea
                value={newTaskDetails.description}
                onChange={(e) =>
                  setNewTaskDetails((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={editingTask.description}
                className="w-full px-3 py-2 border text-black"
              />
            </div>
            <div className="mt-4">
              <label className="text-black">Deadline</label>
              <input
                type="date"
                value={newTaskDetails.deadline}
                onChange={(e) =>
                  setNewTaskDetails((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }))
                }
                placeholder={editingTask.deadline}
                className="w-full px-3 py-2 border text-black"
              />
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(editingTask.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTasks;
