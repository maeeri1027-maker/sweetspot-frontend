import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SpotList from "./components/SpotList";
import SpotForm from "./components/SpotForm";
import SpotEditForm from "./components/SpotEditForm";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import CalendarPage from "./components/CalendarPage"; // ★ 追加：カレンダーページのインポート

// ヘッダー要素（useAuth を使用するため Router の内部で呼ぶコンポーネントとして分離）
function HeaderContent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header
      style={{
        maxWidth: "800px",
        margin: "0 auto 20px auto",
        padding: "15px 20px",
        background: "linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          margin: "0 auto",
        }}
      >
        <img
          src="/illustration/yuru_neko4.png"
          alt="sweet spot icon"
          style={{ height: "80px", width: "auto" }}
        />

        <h1
          style={{
            color: "var(--accent-pink)",
            margin: 0,
            fontSize: "32px",
            userSelect: "none",
            fontWeight: "bold",
            fontFamily: "'Your Font Name', cursive",
          }}
        >
          sweet spot
        </h1>
      </Link>

      {/* ★ 変更：カレンダー移動ボタンとログアウトボタンを右端に配置 */}
      {isAuthenticated && (
        <div
          style={{
            position: "absolute",
            right: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <Link
            to="/calendar"
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffffff",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "13px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            📅 カレンダー
          </Link>
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffffff",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <div
        style={{
          backgroundColor: "var(--bg-dark)",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <HeaderContent />

        <Routes>
          {/* 未認証でもアクセス可能な公開ルート */}
          <Route path="/login" element={<Login />} />

          {/* 認証が必要な保護ルート（PrivateRoute でガード） */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <SpotList />
              </PrivateRoute>
            }
          />
          {/* ★ 追加：カレンダー専用ページのルート */}
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <SpotForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <SpotEditForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
