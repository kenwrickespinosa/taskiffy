import { useEffect, useState } from "react";
import EmployeeTask from "./EmployeeTask";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/employees");
        const result = await response.json();
        setEmployees(result.data);
      } catch (error) {
        console.log("Failed to fetch employees", error);
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="h-full bg-custom-grey text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">List of Employees</h1>
      {/* Table Container */}
      <div className="max-h-[500px] overflow-y-auto border border-custom-black rounded">
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-custom-black py-2 px-4">Name</th>
              <th className="border-b-2 border-custom-black py-2 px-4">Email</th>
              <th className="border-b-2 border-custom-black py-2 px-4">Task</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-custom-blue">
                <td className="py-2 px-4">{employee.name}</td>
                <td className="py-2 px-4">{employee.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => setSelectedEmployee(employee)}
                    className="bg-custom-green text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display tasks for the selected employee */}
      {selectedEmployee && (
        <EmployeeTask
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}

export default EmployeeList;
