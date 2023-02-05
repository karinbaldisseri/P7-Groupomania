import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Error from "./pages/error";
import Postswall from "./pages/postswall";
import Profile from "./pages/profile";
import Footer from "./components/footer";
import RequireAuth from "./components/requireAuth";
import PersistLogin from "./components/persistLogin";
import ToastConfig from "./components/toastconfig";

function App() {
  return (
    <>
      <ToastConfig />
      <Routes>
        {/* Public Routes */}
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />

        {/* Restricted / Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/postswall" element={<Postswall />} />
          </Route>
        </Route>

        {/* Catch all / Error Routes */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
