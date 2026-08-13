import { useState, useEffect } from "react";
import SpotCalendar from "./SpotCalendar";
import apiClient from "../apiClient"; // パスは環境に合わせて調整してください

export default function CalendarPage() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // スポット一覧を取得してカレンダーに渡す
    apiClient
      .get("/spots")
      .then((response) => {
        setSpots(response.data);
      })
      .catch((error) => {
        console.error("カレンダーデータの取得に失敗しました:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", color: "#fff", marginTop: "40px" }}>
        読み込み中...
      </div>
    );
  }

  return (
    <div>
      <SpotCalendar spots={spots} />
    </div>
  );
}
