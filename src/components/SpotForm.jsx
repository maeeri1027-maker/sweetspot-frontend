import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ★ 1. spotService と apiClient のインポート
import { createSpot } from "../services/spotService";
import apiClient from "../apiClient";

const MAX_SUB_PHOTOS = 4; // メイン写真1枚 + サブ写真最大4枚 = 最大5枚

export default function SpotForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [snsUrl, setSnsUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [status, setStatus] = useState("気になる");
  const [visitedDate, setVisitedDate] = useState("");
  const [memo, setMemo] = useState("");
  const [tasteReview, setTasteReview] = useState("");
  const [mainPhotoUrl, setMainPhotoUrl] = useState("");
  const [subPhotoUrls, setSubPhotoUrls] = useState([""]);
  const [uploading, setUploading] = useState({});

  // ★ 2. 送信中状態およびエラー表示用ステートを追加
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const categoryOptions = ["カフェ", "スイーツ", "洋食", "和食", "中華"];

  // ★ 3. 画像アップロードを apiClient(Axios) に共通化
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  };

  const handleMainPhotoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, main: true }));
    try {
      const url = await uploadFile(file);
      setMainPhotoUrl(url);
    } catch (err) {
      console.error(err);
      alert("写真のアップロードに失敗しました");
    } finally {
      setUploading((prev) => ({ ...prev, main: false }));
    }
  };

  const handleSubPhotoFile = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const url = await uploadFile(file);
      handleSubPhotoChange(index, url);
    } catch (err) {
      console.error(err);
      alert("写真のアップロードに失敗しました");
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubPhotoChange = (index, value) => {
    const updated = [...subPhotoUrls];
    updated[index] = value;
    setSubPhotoUrls(updated);
  };

  const addSubPhotoField = () => {
    if (subPhotoUrls.length < MAX_SUB_PHOTOS) {
      setSubPhotoUrls([...subPhotoUrls, ""]);
    }
  };

  const removeSubPhotoField = (index) => {
    setSubPhotoUrls(subPhotoUrls.filter((_, i) => i !== index));
  };

  // ★ 4. 送信処理のバリデーション・エラー処理・二重送信防止を追加
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 入力バリデーション（空白文字チェック）
    if (!name.trim()) {
      setErrorMessage("スポット名を入力してください。");
      return;
    }

    // 画像アップロード中の送信防止
    const isImageUploading = Object.values(uploading).some((isUp) => isUp);
    if (isImageUploading) {
      alert("画像のアップロードが完了するまでお待ちください。");
      return;
    }

    const imageUrls = [mainPhotoUrl, ...subPhotoUrls]
      .map((url) => url.trim())
      .filter((url) => url !== "");

    const newSpot = {
      name: name.trim(),
      description,
      address,
      websiteUrl,
      snsUrl,
      latitude: 0.0,
      longitude: 0.0,
      category: selectedCategories.join(","),
      status,
      visitedDate: status === "行った" ? visitedDate || null : null,
      memo,
      tasteReview,
      imageUrls,
    };

    try {
      setSubmitting(true);
      setErrorMessage("");
      // createSpot を利用して送信
      await createSpot(newSpot);
      navigate("/");
    } catch (err) {
      console.error("登録エラー:", err);
      setErrorMessage(
        "登録に失敗しました。入力内容やサーバー状態を確認してください。",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  };
  const inputStyle = { width: "100%", padding: "8px", boxSizing: "border-box" };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "var(--surface)",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "var(--text-primary)" }}>
        新規スポット追加
      </h2>

      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffe0e0",
            color: "var(--danger)",
            borderRadius: "4px",
            marginBottom: "15px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label style={labelStyle}>スポット名 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* ステータス選択 */}
        <div>
          <label style={labelStyle}>ステータス</label>
          <div style={{ display: "flex", gap: "15px" }}>
            {["行った", "気になる", "時間があれば"].map((s) => (
              <label
                key={s}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={(e) => setStatus(e.target.value)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* 行った日付 */}
        {status === "行った" && (
          <div>
            <label style={labelStyle}>行った日付 📅</label>
            <input
              type="date"
              value={visitedDate}
              onChange={(e) => setVisitedDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>タグ（複数選択可）</label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categoryOptions.map((cat) => (
              <label
                key={cat}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>住所</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="例: 福岡県北九州市小倉北区..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="混雑する時間帯、おすすめメニューなど"
            style={inputStyle}
          />
        </div>

        {/* 味の感想 */}
        <div>
          <label style={labelStyle}>味の感想</label>
          <textarea
            value={tasteReview}
            onChange={(e) => setTasteReview(e.target.value)}
            placeholder="実際に食べてみた感想、おすすめポイントなど"
            style={{ ...inputStyle, minHeight: "70px" }}
          />
        </div>

        {/* メイン写真 */}
        <div>
          <label style={labelStyle}>メイン写真（ホーム画面に表示）</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainPhotoFile}
            style={inputStyle}
          />
          {uploading.main && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                margin: "5px 0",
              }}
            >
              アップロード中...
            </p>
          )}
          {mainPhotoUrl && (
            <img
              src={mainPhotoUrl}
              alt="メイン写真プレビュー"
              style={{
                marginTop: "8px",
                maxWidth: "150px",
                maxHeight: "150px",
                borderRadius: "6px",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
        </div>

        {/* サブ写真 */}
        <div>
          <label style={labelStyle}>
            サブ写真（最大{MAX_SUB_PHOTOS}枚・詳細のみ表示）
          </label>
          {subPhotoUrls.map((url, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSubPhotoFile(index, e)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => removeSubPhotoField(index)}
                  style={{
                    padding: "0 12px",
                    backgroundColor: "var(--surface-light)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
              {uploading[index] && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    margin: "5px 0",
                  }}
                >
                  アップロード中...
                </p>
              )}
              {url && (
                <img
                  src={url}
                  alt={`サブ写真${index + 1}プレビュー`}
                  style={{
                    marginTop: "6px",
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
            </div>
          ))}
          {subPhotoUrls.length < MAX_SUB_PHOTOS && (
            <button
              type="button"
              onClick={addSubPhotoField}
              style={{
                padding: "6px 12px",
                backgroundColor: "transparent",
                color: "var(--accent-purple)",
                border: "1px dashed var(--accent-purple)",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              ＋ 写真欄を追加
            </button>
          )}
        </div>

        <div>
          <label style={labelStyle}>Webサイト URL</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Instagram / SNS URL</label>
          <input
            type="url"
            value={snsUrl}
            onChange={(e) => setSnsUrl(e.target.value)}
            placeholder="https://instagram.com/..."
            style={inputStyle}
          />
        </div>

        {/* ボタンエリア（二重送信防止用に disabled を適用） */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "var(--surface-light)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 2,
              padding: "10px",
              backgroundColor: submitting ? "#cccccc" : "var(--accent-pink)",
              color: "var(--bg-dark)",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "登録中..." : "登録する"}
          </button>
        </div>
      </form>
    </div>
  );
}
