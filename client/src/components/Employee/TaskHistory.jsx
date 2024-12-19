import React from "react";
import { useOutletContext } from "react-router-dom";

function TaskHistory() {
  const { completedTasks } = useOutletContext(); // Access shared state

  return (
    <div className="text-white px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Task History</h1>
      {completedTasks.length === 0 ? (
        <p>No completed tasks yet.</p>
      ) : (
        completedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-custom-grey p-4 rounded-md mb-4 shadow-lg"
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-sm">{task.description}</p>
            <p className="text-green-500">Status: {task.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskHistory;
