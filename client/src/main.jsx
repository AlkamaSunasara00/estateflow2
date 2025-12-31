import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ActiveUserProvider } from "./context/ActiveUserContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ActiveUserProvider>
      <App />
    </ActiveUserProvider>
  </BrowserRouter>
);
