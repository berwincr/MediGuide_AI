import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MedicineSearch from "./pages/MedicineSearch";
import ConditionSearch from "./pages/ConditionSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import ConditionDetails from "./pages/ConditionDetails";
import AppLayout from "./components/AppLayout";
import MedicineDetails from "./pages/MedicineDetails";
import AIChat from "./pages/AIChat";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/medicines"
  element={
    <ProtectedRoute>
      <AppLayout>
        <MedicineSearch />
      </AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/conditions"
  element={
    <ProtectedRoute>
      <AppLayout>
        <ConditionSearch />
      </AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/conditions/:code"
  element={
    <ProtectedRoute>
      <AppLayout>
        <ConditionDetails />
      </AppLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/medicines/:rx_cui"
  element={
    <ProtectedRoute>
      <AppLayout>
        <MedicineDetails />
      </AppLayout>
    </ProtectedRoute>
  }
/>
<Route path="/ai-chat" element={<AIChat />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;