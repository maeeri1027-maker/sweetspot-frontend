import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../apiClient";

// 1. 認証情報を共有するための箱（Context）を作成
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ログイン状態（トークンとユーザー情報）
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 画面が開いた時（またはリロード時）に保存されたトークンを復元
  useEffect(() => {
    if (token) {
      // トークンが存在すれば共通ヘッダーにセット
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  }, [token]);

  // ログイン処理（トークンを受け取って保存）
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  // ログアウト処理（トークンを削除）
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token, // トークンがあれば true
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 他のコンポーネントから簡単に呼び出すためのカスタムフック
export const useAuth = () => useContext(AuthContext);
