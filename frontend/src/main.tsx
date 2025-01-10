import { createRoot } from "react-dom/client";
import MainRouter from "./routes";
import "./styles/index.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster />
    <MainRouter />
  </>
);
