import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

function TaskForm() {
  const { token } = useContext(AppContext);
  const [tasksData, setTasksData] = useState({
    employee_id: "", // Single employee ID
    title: "",
    description: "",
    deadline: "",
  });

  const [employees, setEmployees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown visibility
  const [searchQuery, setSearchQuery] = useState(""); // For filtering employees
  const [errors, setErrors] = useState({}); // For handling errors

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/employees", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch employees");
          throw new Error("Error fetching employees");
        }

        const result = await response.json();

        if (result && Array.isArray(result.data)) {
          setEmployees(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching employees!", error);
      }
    };

    fetchEmployees();
  }, [token]);

  // Handle form submission
  async function handleTasksSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          admin_id: 1, // Replace with actual admin ID
          employee_id: parseInt(tasksData.employee_id, 10), // Single employee ID
          title: tasksData.title,
          description: tasksData.description,
          deadline: tasksData.deadline,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || { message: "Failed to create task" });
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      console.log(data);

      // Reset form
      setTasksData({
        title: "",
        description: "",
        deadline: "",
        employee_id: "",
      });
    } catch (error) {
      console.error("Error creating task!", error);
    }
  }

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setTasksData((prevTasksData) => ({
      ...prevTasksData,
      [name]: value,
    }));
  }

  return (
    <div className="p-6 bg-custom-grey text-white rounded">
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      <form onSubmit={handleTasksSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={tasksData.title}
            onChange={handleChange}
            className="w-full p-2 border border-custom-black rounded text-black"
          />
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Description"
            name="description"
            value={tasksData.description}
            onChange={handleChange}
            className="w-full p-2 border border-custom-black rounded text-black"
          />
        </div>

        <div className="mb-4">
          <input
            type="datetime-local"
            placeholder="Deadline"
            name="deadline"
            value={tasksData.deadline}
            onChange={handleChange}
            className="w-full p-2 border border-custom-black rounded text-black"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Assign to an Employee</h3>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search employees..."
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="w-full p-2 border border-custom-black rounded mb-4 text-black"
          />

          {/* Dropdown for Employees */}
          <div className="relative">
            <button
              type="button"
              className="bg-custom-green text-white px-4 py-2 rounded w-full"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {dropdownOpen ? "Close Employee List" : "Open Employee List"}
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full max-h-64 bg-custom-grey text-white border border-custom-black rounded mt-2 overflow-y-auto z-10">
                {employees
                  .filter((employee) =>
                    employee.name.toLowerCase().includes(searchQuery)
                  )
                  .map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center space-x-2 p-2 hover:bg-custom-blue"
                    >
                      <input
                        type="radio"
                        name="employee_id"
                        value={employee.id}
                        onChange={handleChange}
                        checked={tasksData.employee_id === employee.id.toString()}
                      />
                      <span>{employee.name}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-custom-green text-white px-4 py-2 rounded hover:bg-opacity-80"
        >
          Create Task
        </button>
      </form>

      {errors.message && (
        <div className="mt-4 text-red-500">{errors.message}</div>
      )}
    </div>
  );
}

export default TaskForm;
