import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://sweetspot-7kzg.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエスト送信時に自動で localStorage からトークンを取得してヘッダーにセットする設定
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
