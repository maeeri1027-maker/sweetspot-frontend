import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// ★ AuthProvider をインポート
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ★ アプリ全体を包む */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
