import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MyNetwork from "./pages/MyNetwork";
import ProfilePage from "./pages/ProfilePage";
import Notification from "./pages/Notification";
import { useAuthContext } from "./context/AuthUser";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser } = useAuthContext();
  // console.log(authUser);

  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/home"} /> : <Login />}
        />
        <Route
          path="/"
          element={authUser ? <Navigate to={"/home"} /> : <Login />}
        />
        <Route path="/home" element={authUser ? <Home /> : <Login />} />
        <Route
          path="/mynetwork"
          element={authUser ? <MyNetwork /> : <Login />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Login />}
        />
        <Route
          path="/notification"
          element={authUser ? <Notification /> : <Login />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
