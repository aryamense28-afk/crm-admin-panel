import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {

  const user = localStorage.getItem("user");

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" />}
      />

    </Routes>
  );
}

export default App;