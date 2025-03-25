# カレンダー連携オプション調査結果

## Google Calendar API

Google Calendar APIは現在も利用可能で、RESTful APIとして提供されています。このAPIを使用することで、以下の機能が実現可能です：

- カレンダーイベントの取得
- イベントの作成・更新・削除
- カレンダーリストの取得
- ユーザー設定の取得・更新

Google Calendar APIを利用するには以下の手順が必要です：
1. Google Cloud Platformでプロジェクトを作成
2. Google Calendar APIを有効化
3. OAuth認証情報を設定
4. アクセストークンを取得してAPIを呼び出す

参考URL: https://developers.google.com/calendar/api/guides/overview?hl=ja

## TimeTree API

TimeTree APIは2023年12月22日をもって終了しました。公式アナウンスによると：

- Connect App（API機能）は完全に終了
- 外部サービスとの連携は基本的に不可能
- Amazon Alexaとの連携のみ継続
- Google Homeとの連携も終了
- 開発者が作成したアプリケーションとの連携も不可能

参考URL: https://timetreeapp.com/intl/en/newsroom/2023-12-14/connect-app-api-202312

## 連携オプションの結論

1. **Google Calendar連携**：APIが利用可能なため、Google Calendarからイベント情報を取得し、ポッドキャスト用の台本作成に活用することは可能です。

2. **TimeTree連携**：APIが終了しているため、プログラムによる直接連携は不可能です。ユーザーが手動でTimeTreeからイベント情報をエクスポートし、それを入力として使用する方法を検討する必要があります。

3. **スケジュール帳連携**：物理的なスケジュール帳との連携は、ユーザーが手動で情報を入力する形になります。

## 推奨アプローチ

現状では、Google Calendar APIを中心に連携機能を実装し、TimeTreeやスケジュール帳については、ユーザーが手動でデータを入力できるインターフェースを提供することが最適と考えられます。

アプリ開発が必要な場合は、Google Calendar APIを活用したウェブアプリケーションを作成し、その他のカレンダーソースについては手動入力フォームを提供する方針が良いでしょう。
