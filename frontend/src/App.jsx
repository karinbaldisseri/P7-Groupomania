import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Error from "./pages/error";
import Postswall from "./pages/postswall";
import Profile from "./pages/profile";
import Footer from "./components/footer";
import RequireAuth from "./components/requireAuth";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />

        {/* Restricted / Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/postswall" element={<Postswall />} />
        </Route>

        {/* Catch all / Error Routes */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
