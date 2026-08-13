import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth(); // AuthContext から login 関数を取得
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      // 1. ログインAPIを実行
      const data = await loginApi({ email, password });

      // 2. 受け取ったトークンとユーザー情報を Context (localStorage) に保存
      login(data.token, data.user);

      // 3. ログイン成功後、一覧画面へ遷移
      navigate("/");
    } catch (err) {
      console.error("ログインエラー:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "ログインに失敗しました。認証情報を確認してください。",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "var(--surface)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "var(--text-primary)",
        }}
      >
        ログイン
      </h2>

      {errorMessage && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffe0e0",
            color: "var(--danger)",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              borderRadius: "6px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              borderRadius: "6px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: "10px",
            padding: "12px",
            backgroundColor: submitting ? "#ccc" : "var(--accent-pink)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
