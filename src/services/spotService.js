import apiClient from "../apiClient";

// スポット一覧の取得 (Read)
export const getSpots = async () => {
  const response = await apiClient.get("/spots");
  return response.data;
};

// スポット詳細の取得 (Read)
export const getSpotById = async (id) => {
  const response = await apiClient.get(`/spots/${id}`);
  return response.data;
};

// スポットの新規登録 (Create)
export const createSpot = async (spotData) => {
  const response = await apiClient.post("/spots", spotData);
  return response.data;
};

// スポットの更新 (Update)
export const updateSpot = async (id, spotData) => {
  const response = await apiClient.put(`/spots/${id}`, spotData);
  return response.data;
};

// スポットの削除 (Delete)
export const deleteSpot = async (id) => {
  const response = await apiClient.delete(`/spots/${id}`);
  return response.data;
};
