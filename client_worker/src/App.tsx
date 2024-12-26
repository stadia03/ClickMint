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

import Withdraw from "./pages/Withdraw";

function App() {
  const isAuth = useUserStore((state) => state.isAuth);
  const setAuth = useUserStore((state) => state.setAuth);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const workerAddress= localStorage.getItem("workerAddress");
    if (token && workerAddress) {
      setAuth(true);
      useUserStore.getState().setWorkeraddress(workerAddress ?? "");
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
            path="/funds"
            element={isAuth ? <Withdraw /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
