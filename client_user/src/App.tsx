import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useUserStore } from "./store";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Task from "./pages/Task";

function App() {
  const isAuth = useUserStore((state) => state.isAuth);
  const setAuth = useUserStore((state) => state.setAuth);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userAddress = localStorage.getItem("userAddress");
    if (token && userAddress) {
      setAuth(true);
      useUserStore.getState().setUseraddress(userAddress ?? "");
    } else {
      setAuth(false);
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!isAuth ? <Login /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={isAuth ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks"
            element={isAuth ? <Task /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
