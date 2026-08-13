import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ログイン状態を確認中の場合はローディング表示
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "var(--text-primary)",
          padding: "40px",
        }}
      >
        認証状態を確認中...
      </div>
    );
  }

  // 未ログインの場合はログイン画面へリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ログイン済みの場合はそのまま子要素（保護された画面）を表示
  return children;
}
