import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import logoIcon from "./assets/images/icon.svg";

const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/svg+xml";
favicon.href = logoIcon;
if (!favicon.parentNode) {
    document.head.appendChild(favicon);
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
