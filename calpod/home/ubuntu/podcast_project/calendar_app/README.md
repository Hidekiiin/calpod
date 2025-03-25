# カレンダー連携ポッドキャストアプリ（強化版）

## 概要
このアプリは、Googleカレンダーと連携して、アート、デザイン、ファッション、音楽、建築に関するイベント情報とポッドキャスト内容を表示するウェブアプリケーションです。最新のニュースから自動的にポッドキャスト台本を生成する機能も備えています。

## 機能
- ポッドキャスト内容の表示機能
- カレンダーイベントの表示機能
- Googleカレンダーとの連携機能
- ニュース自動取得とポッドキャスト台本生成機能

## 技術スタック
- Next.js
- React
- Material UI
- Google Calendar API
- News API (モック実装)

## 開発方法

### 必要条件
- Node.js
- npm

### インストール
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=http://localhost:3000/api/google/callback
SERPAPI_KEY=your_serpapi_key (オプション)
```

### ビルド
```bash
npm run build
```

### 本番環境での実行
```bash
npm start
```

## デプロイ
このアプリはVercelにデプロイすることを想定しています。

### Vercelへのデプロイ手順
1. GitHubリポジトリにコードをプッシュ
2. Vercelアカウントを作成し、GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイを実行

## ライセンス
MIT
