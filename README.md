# Sweet Spot（スイーツ＆カフェ スポット管理アプリ）

> **「SNSで見つけた『行ってみたいお店』をスマートに整理・一覧化し、今日のおでかけを最高にするグルメガイド」**

---

## 📸 アプリケーションの雰囲気

![スポット一覧画面](https://github.com/maeeri1027-maker/sweetspot-frontend/assets/dummy-image.png)
_(※ ここに画面のスクリーンショット画像を挿入できます)_

- **本番Webサイト（フロントエンド）:** https://sweetspot-frontend.vercel.app/
- **APIサーバー（バックエンド）:** https://sweetspot-7kzg.onrender.com/api/spots

---

## 💡 アプリケーションの概要・開発背景

### 概要

X（旧Twitter）、Instagram、TikTokなどのSNSで見つけた近場のおいしいお店やカフェを登録・管理し、行きたい状態やカテゴリ別に瞬時に検索・比較できるWebアプリケーションです。

### 開発背景

SNSで「行ってみたいお店」を見つける機会が増え、以前はGoogleマップ等にピンを立てて保存していました。
しかし、実際に「今日どこかに行こう」となった際、マップ上のピンだけでは**リストとして一覧化されておらず、カテゴリやその時の気分（「スイーツ」「カフェ」「行った／気になる」など）で比較・絞り込みがしづらい**という課題がありました。
この課題を解決するため、カード・グリッド形式で視覚的に比較でき、柔軟にタグ絞り込みができる本アプリを開発しました。

---

## 🛠️ 主な使用技術・インフラ構成

| カテゴリ                    | 技術スタック                                                          |
| :-------------------------- | :-------------------------------------------------------------------- |
| **フロントエンド**          | React 18, React Router v6, Axios                                      |
| **バックエンド**            | Java 21, Spring Boot 3.x, Spring Security, Spring Data JPA, Hibernate |
| **データベース**            | PostgreSQL (Neon Database)                                            |
| **インフラ / ホスティング** | Vercel（フロントエンド）, Render（バックエンド）                      |
| **ビルド / パッケージ**     | Maven, Vite, Git / GitHub                                             |

### インフラ構成図

```mermaid
graph TD
    User[ユーザー ブラウザ] --> Frontend[Vercel React]
    Frontend -->|REST API| Backend[Render Spring Boot]
    Backend -->|JDBC| DB[(Neon PostgreSQL)]

    コード スニペット
erDiagram
    USERS ||--o{ SPOTS : "creates"

    USERS {
        Long id PK
        String email UK
        String password
    }

    SPOTS {
        Long id PK
        String name
        String description
        String address
        Double latitude
        Double longitude
        String category
        String status
        String visitedDate
        String memo
        String tasteReview
        String imageUrls
    }

    画面および主要機能の説明
ユーザー認証機能

会員登録 / ログイン・ログアウト（JWT認証・Security実装）

スポット管理（CRUD機能）

スポット一覧表示（リストビュー / グリッドビュー切替）

スポット新規登録（画像アップロード・リアルタイムプレビュー表示）

スポット詳細表示・編集・削除機能

検索・絞り込み機能

カテゴリタグ（#カフェ、#スイーツ など）による即時フィルタリング

訪問ステータス（行った / 気になる / 時間があれば）による絞り込み

ソート機能（最新順 / 古い順 / 五十音順）

マップ連携

登録住所から Google Maps へのダイレクト遷移リンク生成

🔑 テスト用ログイン情報
評価・動作確認用に以下のテストアカウントをご利用いただけます。

メールアドレス: test@example.com
パスワード: password123

製作者：Mitani
```
