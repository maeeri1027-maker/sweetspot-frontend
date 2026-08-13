import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function SpotCalendar({ spots }) {
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [selectedSpot, setSelectedSpot] = useState(null);

  const BASE_URL = "https://sweetspot-7kzg.onrender.com";

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const extractImages = (spot) => {
    let images = [];

    if (spot.imageUrls && Array.isArray(spot.imageUrls)) {
      spot.imageUrls.forEach((url) => {
        if (url) images.push(getImageUrl(url));
      });
    }

    const mainImg = spot.imageUrl || spot.image_url || spot.mainImage;
    if (mainImg) images.push(getImageUrl(mainImg));

    if (spot.images && Array.isArray(spot.images)) {
      spot.images.forEach((img) => {
        const url =
          typeof img === "string"
            ? img
            : img.imageUrl || img.image_url || img.url;
        if (url) images.push(getImageUrl(url));
      });
    }

    return [...new Set(images.filter(Boolean))];
  };

  // 時差ズレを防ぐローカル日付フォーマット関数
  const formatDate = (dateObj) => {
    if (!dateObj) return "";

    if (typeof dateObj === "string") {
      return dateObj.substring(0, 10);
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatDate(date);

  // 該当日のスポット抽出
  const selectedDaySpots = spots.filter((spot) => {
    const rawDate = spot.visitedDate || spot.visited_date;
    if (!rawDate) return false;
    return formatDate(rawDate) === selectedDateStr;
  });

  const renderTileContent = ({ date: tileDate, view }) => {
    if (view !== "month") return null;

    const tileDateStr = formatDate(tileDate);
    const matchedSpots = spots.filter((spot) => {
      const rawDate = spot.visitedDate || spot.visited_date;
      if (!rawDate) return false;
      return formatDate(rawDate) === tileDateStr;
    });

    if (matchedSpots.length === 0) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          marginTop: "4px",
          width: "100%",
        }}
      >
        {matchedSpots.map((spot, index) => {
          const images = extractImages(spot);
          const firstImage = images[0];

          return (
            <div key={index} style={{ width: "100%", textAlign: "center" }}>
              {firstImage && (
                <img
                  src={firstImage}
                  alt={spot.name}
                  style={{
                    width: "100%",
                    height: "32px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "10px" }}>
      <style>{`
        .calendar-container {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .calendar-main {
          flex: 1 1 550px;
          background-color: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .calendar-detail-mobile {
          flex: 0 0 350px;
          max-width: 100%;
          background-color: #fff;
          border-radius: 24px;
          border: 8px solid #333;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          min-height: 480px;
        }
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit;
        }
        .react-calendar__tile {
          min-height: 75px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          align-items: center !important;
          padding: 6px 2px !important;
          cursor: pointer;
        }
        .react-calendar__tile--active {
          background: #ffe4e1 !important;
          color: #000 !important;
          border-radius: 8px;
        }
        .spot-title-click {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .spot-title-click:hover {
          opacity: 0.7;
          text-decoration: underline;
        }
        @media (max-width: 930px) {
          .calendar-detail-mobile {
            flex: 1 1 100%;
          }
        }
      `}</style>

      <div className="calendar-container">
        {/* 左側：メインカレンダー */}
        <div className="calendar-main">
          <h3
            style={{
              textAlign: "center",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            訪問カレンダー
          </h3>

          <Calendar
            value={date}
            activeStartDate={activeStartDate}
            showNeighboringMonth={false}
            onClickDay={(clickedDate) => {
              setDate(clickedDate);
            }}
            onActiveStartDateChange={({ activeStartDate: newActiveDate }) => {
              setActiveStartDate(newActiveDate);
            }}
            tileContent={renderTileContent}
            locale="ja-JP"
          />
        </div>

        {/* 右側：スマホ風の詳細ビュー */}
        <div className="calendar-detail-mobile">
          <div
            style={{
              width: "40px",
              height: "4px",
              backgroundColor: "#ccc",
              borderRadius: "2px",
              margin: "0 auto 16px auto",
            }}
          />

          <h4
            style={{
              margin: "0 0 16px 0",
              fontSize: "16px",
              color: "var(--accent-pink, #ff69b4)",
              borderBottom: "2px solid #fff0f5",
              paddingBottom: "8px",
              textAlign: "center",
            }}
          >
            📅 {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日
          </h4>

          {selectedDaySpots.length === 0 ? (
            <p
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: "40px",
                fontSize: "14px",
              }}
            >
              この日の訪問記録はありません。
            </p>
          ) : (
            selectedDaySpots.map((spot) => {
              const allImages = extractImages(spot);

              return (
                <div key={spot.id} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <h5
                      className="spot-title-click"
                      onClick={() => setSelectedSpot(spot)}
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        color: "var(--accent-pink, #ff69b4)",
                      }}
                    >
                      📍 {spot.name} 🔗
                    </h5>
                    <span
                      style={{
                        fontSize: "11px",
                        backgroundColor: "#fff0f5",
                        color: "var(--accent-pink)",
                        padding: "2px 6px",
                        borderRadius: "10px",
                      }}
                    >
                      {spot.category || "スポット"}
                    </span>
                  </div>

                  {spot.description && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#555",
                        margin: "4px 0 10px 0",
                      }}
                    >
                      {spot.description}
                    </p>
                  )}

                  {allImages.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(90px, 1fr))",
                        gap: "6px",
                        marginTop: "8px",
                      }}
                    >
                      {allImages.map((imgUrl, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={imgUrl}
                          alt={`${spot.name}-${imgIndex}`}
                          onClick={() => setSelectedSpot(spot)}
                          style={{
                            width: "100%",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 詳細表示用モーダル */}
      {selectedSpot && (
        <div
          onClick={() => setSelectedSpot(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedSpot(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                border: "none",
                background: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              ✖
            </button>

            <h3 style={{ margin: "0 0 12px 0", color: "var(--text-primary)" }}>
              📍 {selectedSpot.name}
            </h3>

            {selectedSpot.category && (
              <span
                style={{
                  fontSize: "12px",
                  backgroundColor: "#fff0f5",
                  color: "var(--accent-pink)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  display: "inline-block",
                  marginBottom: "16px",
                }}
              >
                {selectedSpot.category}
              </span>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              {selectedSpot.address && (
                <div>
                  <strong>📍 住所:</strong> {selectedSpot.address}
                </div>
              )}

              {(selectedSpot.visitedDate || selectedSpot.visited_date) && (
                <div>
                  <strong>📅 訪問日:</strong>{" "}
                  {selectedSpot.visitedDate || selectedSpot.visited_date}
                </div>
              )}

              {selectedSpot.description && (
                <div>
                  <strong>📝 説明:</strong>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#555",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedSpot.description}
                  </p>
                </div>
              )}

              {/* ★ 1. 最優先表示：味の感想 */}
              {(selectedSpot.tasteImpression ||
                selectedSpot.taste_impression ||
                selectedSpot.taste ||
                selectedSpot.review ||
                selectedSpot.impression) && (
                <div
                  style={{
                    backgroundColor: "#fff0f5",
                    padding: "14px",
                    borderRadius: "12px",
                    borderLeft: "5px solid var(--accent-pink, #ff69b4)",
                    boxShadow: "0 2px 6px rgba(255, 105, 180, 0.15)",
                  }}
                >
                  <strong
                    style={{
                      color: "var(--accent-pink, #ff69b4)",
                      fontSize: "15px",
                    }}
                  >
                    😋 味の感想
                  </strong>
                  <p
                    style={{
                      margin: "6px 0 0 0",
                      color: "#333",
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {selectedSpot.tasteImpression ||
                      selectedSpot.taste_impression ||
                      selectedSpot.taste ||
                      selectedSpot.review ||
                      selectedSpot.impression}
                  </p>
                </div>
              )}

              {/* ★ 2. サブ表示：メモ */}
              {selectedSpot.memo && (
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                  }}
                >
                  <strong style={{ color: "#666" }}>💡 メモ</strong>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#555",
                      whiteSpace: "pre-wrap",
                      fontSize: "13px",
                    }}
                  >
                    {selectedSpot.memo}
                  </p>
                </div>
              )}

              {/* 写真一覧 */}
              {extractImages(selectedSpot).length > 0 && (
                <div>
                  <strong>📷 写真一覧:</strong>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(130px, 1fr))",
                      gap: "10px",
                      marginTop: "8px",
                    }}
                  >
                    {extractImages(selectedSpot).map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`detail-${idx}`}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
