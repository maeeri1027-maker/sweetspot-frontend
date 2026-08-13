import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ★ 1. 作成したサービス関数をインポート
import { getSpots, deleteSpot } from "../services/spotService";

export default function SpotList() {
  const [spots, setSpots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("list");

  // ★ 2. ローディングとエラー用のステートを追加
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const categories = ["すべて", "カフェ", "スイーツ", "洋食", "和食", "中華"];
  const statuses = ["すべて", "行った", "気になる", "時間があれば"];

  // ★ 3. spotService を使ったデータ取得処理へ修正
  const fetchSpots = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSpots();
      setSpots(data);
    } catch (err) {
      console.error("エラー:", err);
      setError(
        "データの取得に失敗しました。サーバーが起動しているか確認してください。",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  // ★ 4. spotService を使った削除処理へ修正
  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await deleteSpot(id);
      // 再取得ではなく、画面上のStateから即座に取り除いてレスポンスを高める
      setSpots((prevSpots) => prevSpots.filter((spot) => spot.id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました。");
    }
  };

  const filteredSpots = spots
    .filter(
      (spot) =>
        selectedCategory === "すべて" ||
        (spot.category && spot.category.includes(selectedCategory)),
    )
    .filter(
      (spot) => selectedStatus === "すべて" || spot.status === selectedStatus,
    );

  const sortedSpots = [...filteredSpots].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.id - a.id;
    } else if (sortOrder === "oldest") {
      return a.id - b.id;
    } else if (sortOrder === "name") {
      return a.name ? a.name.localeCompare(b.name, "ja") : 0;
    }
    return 0;
  });

  const getStatusBorderColor = (status) => {
    switch (status) {
      case "行った":
        return "var(--status-visited)";
      case "気になる":
        return "var(--status-interested)";
      case "時間があれば":
        return "var(--status-someday)";
      default:
        return "#cfbfbf";
    }
  };

  // ★ 5. ローディング中の表示
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "var(--text-primary)",
          padding: "40px",
        }}
      >
        データを読み込んでいます...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      {/* ★ 6. エラー発生時のアラート表示 */}
      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffe0e0",
            color: "var(--danger)",
            borderRadius: "8px",
            marginBottom: "16px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* ヘッダーエリア */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2
            style={{
              color: "var(--text-primary)",
              margin: 0,
              fontSize: "24px",
            }}
          >
            スポット一覧
          </h2>
          <img
            src="/illustration/98.png"
            alt="スイーツのイラスト"
            style={{ width: "60px", height: "auto" }}
          />
        </div>

        <button
          onClick={() => navigate("/create")}
          style={{
            padding: "10px 18px",
            backgroundColor: "var(--accent-pink)",
            color: "#ffffff",
            border: "none",
            borderRadius: "24px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          ＋ 新規スポットを追加
        </button>
      </div>

      {/* フィルター固定表示用の親要素（Stickyヘッダー） */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "transparent",
          backdropFilter: "blur(8px)",
          zIndex: 10,
          paddingTop: "12px",
          paddingBottom: "12px",
          marginBottom: "16px",
        }}
      >
        {/* カテゴリフィルター */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: "none",
                backgroundColor:
                  selectedCategory === cat ? "var(--accent-purple)" : "#ffffff",
                color:
                  selectedCategory === cat ? "#ffffff" : "var(--text-primary)",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              #{cat}
            </button>
          ))}
        </div>

        {/* ステータスフィルター */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {statuses.map((s) => {
            const isSelected = selectedStatus === s;
            const themeColor =
              s === "すべて" ? "#cfbfbf" : getStatusBorderColor(s);

            return (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: isSelected
                    ? themeColor
                    : "rgba(255,255,255,0.6)",
                  color: isSelected ? "#ffffff" : themeColor,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* 並び替え ＆ 表示切替エリア */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* 表示切り替えボタン */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            padding: "4px",
            borderRadius: "10px",
          }}
        >
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                viewMode === "list" ? "var(--accent-purple)" : "transparent",
              color: viewMode === "list" ? "#ffffff" : "var(--text-primary)",
              fontWeight: "bold",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ☰ リスト
          </button>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                viewMode === "grid" ? "var(--accent-purple)" : "transparent",
              color: viewMode === "grid" ? "#ffffff" : "var(--text-primary)",
              fontWeight: "bold",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            田 グリッド
          </button>
        </div>

        {/* 並び替えドロップダウンUI */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            並び替え:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <option value="newest">最新順</option>
            <option value="oldest">古い順</option>
            <option value="name">五十音順</option>
          </select>
        </div>
      </div>

      {/* スポットカード一覧表示コンテナ */}
      <div
        style={{
          display: viewMode === "grid" ? "grid" : "block",
          gridTemplateColumns:
            viewMode === "grid"
              ? "repeat(auto-fill, minmax(280px, 1fr))"
              : "none",
          gap: "20px",
        }}
      >
        {sortedSpots.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-primary)",
              gridColumn: "1 / -1",
            }}
          >
            該当するスポットがありません。
          </p>
        ) : (
          sortedSpots.map((spot) => {
            const isVisited = spot.status === "行った";

            return (
              <div
                key={spot.id}
                style={{
                  padding: "18px",
                  borderRadius: "16px",
                  marginBottom: viewMode === "list" ? "20px" : "0px",
                  backgroundColor: isVisited ? "#f4f9f4" : "#ffffff",
                  border: isVisited ? "2px solid #b7e4c7" : "none",
                  boxShadow: isVisited
                    ? "0 6px 20px rgba(104, 189, 98, 0.15)"
                    : "0 4px 16px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* 左側のステータスアクセントライン */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: isVisited ? "8px" : "6px",
                    backgroundColor: getStatusBorderColor(spot.status),
                  }}
                />

                {/* カード右上の達成スタンプ */}
                {isVisited && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "15px",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src="/illustration/kohacu.com_001384.png"
                      alt="達成スタンプ"
                      style={{
                        width: "110px",
                        height: "auto",
                        opacity: 0.85,
                        transform: "rotate(-12deg)",
                      }}
                    />
                  </div>
                )}

                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: viewMode === "grid" ? "column" : "row",
                      gap: "18px",
                      paddingLeft: "6px",
                    }}
                  >
                    {/* メイン写真表示（丸角サムネイル） */}
                    <img
                      src={
                        (spot.imageUrls && spot.imageUrls[0]) ||
                        "/default-spot.png"
                      }
                      alt={spot.name}
                      onError={(e) => {
                        e.target.onerror = null; // 無限ループ防止
                        e.target.src = "/public/illustration/67.png"; // 画像読み込み失敗時の代替画像
                      }}
                      style={{
                        width: viewMode === "grid" ? "100%" : "140px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        flexShrink: 0,
                      }}
                    />

                    {/* テキストコンテンツエリア */}
                    <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                          gap: "8px",
                          paddingRight: isVisited ? "90px" : "0px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "18px",
                              color: "var(--text-primary)",
                              fontWeight: "bold",
                            }}
                          >
                            {spot.name}
                          </h3>
                          {spot.status && (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "3px 8px",
                                borderRadius: "12px",
                                backgroundColor: getStatusBorderColor(
                                  spot.status,
                                ),
                                color: "#ffffff",
                                fontWeight: "bold",
                              }}
                            >
                              {spot.status}
                            </span>
                          )}

                          {spot.status === "行った" && spot.visitedDate && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--text-muted)",
                                fontWeight: "bold",
                              }}
                            >
                              📅 {spot.visitedDate}
                            </span>
                          )}
                        </div>

                        {/* カテゴリタグ */}
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          {spot.category &&
                            spot.category.split(",").map((cat, index) => (
                              <span
                                key={index}
                                style={{
                                  fontSize: "11px",
                                  padding: "3px 10px",
                                  backgroundColor: "rgba(240, 237, 245, 0.8)",
                                  borderRadius: "12px",
                                  color: "var(--accent-purple)",
                                  fontWeight: "bold",
                                }}
                              >
                                #{cat}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* 説明 */}
                      {spot.description && (
                        <p
                          style={{
                            margin: "6px 0",
                            fontSize: "14px",
                            color: "var(--text-primary)",
                            opacity: 0.85,
                            lineHeight: "1.5",
                          }}
                        >
                          {spot.description}
                        </p>
                      )}

                      {/* 住所 ＆ Google Maps リンク */}
                      {spot.address && (
                        <p
                          style={{
                            margin: "4px 0",
                            fontSize: "13px",
                            color: "var(--text-muted)",
                          }}
                        >
                          📍 {spot.address}{" "}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              spot.address,
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "12px",
                              color: "var(--accent-purple)",
                              marginLeft: "6px",
                              textDecoration: "none",
                              fontWeight: "bold",
                            }}
                          >
                            [マップを見る]
                          </a>
                        </p>
                      )}

                      {/* メモ */}
                      {spot.memo && (
                        <div
                          style={{
                            margin: "8px 0",
                            padding: "8px 12px",
                            backgroundColor: "rgba(249, 248, 252, 0.8)",
                            borderRadius: "8px",
                            borderLeft: "3px solid var(--accent-purple)",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                          }}
                        >
                          <strong>メモ:</strong> {spot.memo}
                        </div>
                      )}

                      {/* 味の感想 */}
                      {spot.tasteReview && (
                        <div
                          style={{
                            margin: "8px 0",
                            padding: "8px 12px",
                            backgroundColor: "rgba(255, 245, 248, 0.8)",
                            borderRadius: "8px",
                            borderLeft: "3px solid var(--accent-pink)",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                          }}
                        >
                          <strong>味の感想:</strong> {spot.tasteReview}
                        </div>
                      )}

                      {/* リンク関連 */}
                      {(spot.websiteUrl || spot.snsUrl) && (
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "13px",
                            display: "flex",
                            gap: "12px",
                          }}
                        >
                          {spot.websiteUrl && (
                            <a
                              href={spot.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "var(--accent-purple)",
                                fontWeight: "bold",
                              }}
                            >
                              Webサイト ↗
                            </a>
                          )}
                          {spot.snsUrl && (
                            <a
                              href={spot.snsUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#e1306c", fontWeight: "bold" }}
                            >
                              Instagram ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 編集・削除アクションボタン */}
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => navigate(`/edit/${spot.id}`)}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#f0edf5",
                      color: "var(--accent-purple)",
                      border: "1px solid var(--accent-purple)",
                      borderRadius: "16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(spot.id)}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#fff0f0",
                      color: "var(--danger)",
                      border: "1px solid var(--danger)",
                      borderRadius: "16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
