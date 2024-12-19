import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

function TaskList() {
  const { token } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [submission, setSubmission] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch tasks for the employee
  useEffect(() => {
    console.log("TOken", token);
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
        setTasks(data.tasks); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e, taskId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", submission[taskId]?.message || "");
    formData.append("file", submission[taskId]?.file || "");
  
    try {
      const res = await fetch(
        `http://localhost:8000/api/tasks/${taskId}/submit`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // Keep only the required headers
          },
          body: formData, // Pass FormData directly
        }
      );
  
      if (!res.ok) {
        throw new Error("Failed to submit task");
      }
  
      const data = await res.json();
      alert("Submission successful!");
      console.log("Response data:", data);
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  // Update submission state
  const handleChange = (e, taskId) => {
    const { name, value, files } = e.target;
    setSubmission((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [name]: files ? files[0] : value,
      },
    }));
  };

  return (
    <div className="text-white px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        tasks.map((task) => {
          const deadlinePassed = new Date(task.deadline) < new Date();

          return (
            <div
              key={task.id}
              className="bg-custom-grey p-4 rounded-md mb-4 shadow-lg"
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-sm mb-2">{task.description}</p>
              <p className="mb-4">
                Deadline:{" "}
                <span
                  className={deadlinePassed ? "text-red-500" : "text-green-500"}
                >
                  {new Date(task.deadline).toLocaleString()}
                </span>
              </p>

              {deadlinePassed ? (
                <p className="text-red-500">
                  Deadline has passed. You can no longer submit.
                </p>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, task.id)}>
                  <textarea
                    name="message"
                    placeholder="Enter your message"
                    className="w-full p-2 mb-2 rounded-md text-black"
                    onChange={(e) => handleChange(e, task.id)}
                  />
                  <input
                    type="file"
                    name="file"
                    className="mb-2 text-sm"
                    onChange={(e) => handleChange(e, task.id)}
                  />
                  <button
                    type="submit"
                    className="bg-custom-green px-4 py-2 rounded-md text-white font-semibold hover:bg-green-600"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default TaskList;
