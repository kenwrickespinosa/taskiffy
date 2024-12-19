import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import AdminDashboard from "./pages/user/admin/Dashboard.jsx";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import TaskForm from "./components/Admin/TaskForm.jsx";
import EmployeeList from "./components/Admin/EmployeeList.jsx";
import EmployeeDashboard from "./pages/user/employee/Dashboard.jsx";
import TaskList from "./components/Employee/TaskList.jsx";
import TaskHistory from "./components/Employee/TaskHistory.jsx";

function App() {
  const { user } = useContext(AppContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <PageNotFound />,
    },
    {
      path: '/signup',
      element: user ? <Home /> : <Signup />,
      errorElement: <PageNotFound />,
    },
    {
      path: '/login',
      element: user ? < Home /> : <Login />,
      errorElement: <PageNotFound />,
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: "tasks",
          element: <TaskForm />
        },
        { 
          path: "employees",
          element: <EmployeeList />
        }
      ]
    },
    {
      path: "/employee/dashboard",
      element: <EmployeeDashboard />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: "tasks",
          element: <TaskList />
        },
        {
          path: "task-history",
          element: <TaskHistory />
        }
      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
