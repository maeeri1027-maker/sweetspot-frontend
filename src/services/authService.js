import apiClient from "../apiClient";

// ログインAPIを呼び出す関数
export const loginApi = async (credentials) => {
  // バックエンドのログインエンドポイント（/auth/login や /login など環境に合わせて調整）
  const response = await apiClient.post("/auth/login", credentials);
  return response.data; // { token: "...", user: {...} } のようなデータを想定
};
