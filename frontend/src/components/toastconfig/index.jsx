import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastConfig() {
  return (
    <ToastContainer
      theme="colored"
      position="top-right"
      pauseOnFocusLoss={false}
      autoClose={3000}
      transition={Slide}
    />
  );
}
