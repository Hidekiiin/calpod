# GitHubリポジトリとVercelデプロイ手順

## GitHubリポジトリの作成手順

1. GitHubにログインし、新しいリポジトリを作成します。
   - リポジトリ名: `calendar-podcast-app`（任意の名前）
   - 説明: カレンダー連携ポッドキャストアプリ（Google Calendar連携とニュース自動取得機能付き）
   - 公開設定: Public または Private
   - README.mdの初期化: チェックを外す

2. ローカル環境でリポジトリを初期化し、GitHubにプッシュします。
   ```bash
   # ZIPファイルを解凍したディレクトリに移動
   cd enhanced_app_package

   # Gitリポジトリを初期化
   git init

   # すべてのファイルをステージング
   git add .

   # 最初のコミット
   git commit -m "Initial commit: Calendar Podcast App with Google Calendar integration and News Digest automation"

   # リモートリポジトリを追加（URLは作成したリポジトリのものに置き換え）
   git remote add origin https://github.com/yourusername/calendar-podcast-app.git

   # プッシュ
   git push -u origin main
   ```

## Vercelへのデプロイ手順

1. [Vercel](https://vercel.com/)にアクセスし、アカウントを作成またはログインします。

2. 「New Project」をクリックします。

3. 「Import Git Repository」セクションで、先ほど作成したGitHubリポジトリを選択します。

4. プロジェクト設定を行います：
   - Framework Preset: Next.js
   - Root Directory: ./（リポジトリのルートディレクトリ）
   - Build Command: npm run build
   - Output Directory: .next

5. 環境変数を設定します：
   - GOOGLE_CLIENT_ID: Google Cloud Consoleで取得したクライアントID
   - GOOGLE_CLIENT_SECRET: Google Cloud Consoleで取得したクライアントシークレット
   - REDIRECT_URI: https://your-vercel-domain.vercel.app/api/google/callback
   （※ your-vercel-domainは実際のVercelドメインに置き換えてください）

6. 「Deploy」ボタンをクリックしてデプロイを開始します。

7. デプロイが完了すると、Vercelによって生成されたURLでアプリにアクセスできます。

## Google Cloud Consoleでの設定手順

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセスし、新しいプロジェクトを作成します。

2. 「APIとサービス」→「ライブラリ」から「Google Calendar API」を検索して有効化します。

3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuthクライアントID」を選択します。

4. アプリケーションの種類として「ウェブアプリケーション」を選択します。

5. 以下の情報を入力します：
   - 名前: Calendar Podcast App
   - 承認済みのJavaScript生成元: https://your-vercel-domain.vercel.app
   - 承認済みのリダイレクトURI: https://your-vercel-domain.vercel.app/api/google/callback

6. 「作成」ボタンをクリックします。

7. 表示されたクライアントIDとクライアントシークレットをVercelの環境変数に設定します。

## 注意事項

- 本番環境では、セキュリティを考慮して適切な認証・認可の仕組みを実装してください。
- Google Calendar APIの利用には、Googleアカウントの認証が必要です。
- ニュース自動取得機能は、実際の環境ではニュースAPIサービス（例：NewsAPI、GNewsなど）との連携が必要です。
