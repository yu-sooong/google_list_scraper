# 🍜 Nearby Food Recommender (Google Maps POC)

使用 Google Maps Entity List 非公開 API，實作從地圖清單中篩選離目前位置最近的美食地點，並以亂數推薦一筆並提供詳細資訊連結，適合整合進 LINE Bot、Firebase、或 Web 前端應用！

## ✨ 功能介紹

- 從 Google Maps 收藏清單中擷取地點資訊
- 依目前經緯度找出最近的 3 筆地點並隨機推薦
- 結合 Google Place API 取得更完整的地點資訊與連結
- 支援 CLI 呼叫與 Webhook 模式擴充
- 支援 `.env` 管理 API 金鑰
- 支援 JSON 快取加速並降低 API 次數
- 可延伸整合到 LINE Bot、Firebase、GAS 定時排程等

---

## 🧱 架構特色

- Clean Code + 單一職責模組化 (`ensurePlaceList`, `getNearbyPlaces`, `searchPlace`)
- TypeScript 強型別、可維護性佳
- 實作符合 POC 快速驗證風格

---

## 🚀 安裝與執行

```bash
# 安裝依賴
npm install

# 設定 Google API 金鑰
echo "GOOGLE_MAPS_API_KEY=你的金鑰" > .env
echo "GOOGLE_LIST_URL=你的Google Map 儲存的清單 API" > .env

# 執行主流程 (會自動抓取資料並推薦地點)
npx tsx src/main.ts

# 或自訂目前位置
npx tsx src/main.ts --lat=24.1572 --lng=120.6634
```

---

## 📂 專案結構

```bash
.
├── src
│   ├── main.ts                   # 主程式入口
│   ├── types.ts                 # 型別定義 Place / NearbyPlace
│   └── utils
│       ├── placeHelper.ts        # 取得地點資訊、計算經緯度距離、解析整合回傳格式等
│       └── parseGoogleListRes.ts # 解析 Google List 的非公開格式
├── places.json                  # 快取地點資料 (首次執行自動產生)
├── .env                         # 儲存 GOOGLE_MAPS_API_KEY
└── README.md
```

---

## ✅ 範例輸出

```bash
🎯 地點名稱: Giocoso Café&Pasta（20:30停餐/僅收現金💰）
📍 地址: 403台中市西區精誠八街21號
🗺️ 地圖連結: https://www.google.com/maps/place/?q=place_id:ChIJg1fNSZY9aTQRtI4pf1rECos
📌 經緯度: 24.1543367 120.6566881
📌 差距距離(公尺): 761
```

---

## 🔧 延伸應用建議

- 整合 LINE Bot 回傳地點卡片訊息 (LINE FlexMessage)
- 結合 Firebase Firestore 儲存個人化喜好
- 定時執行 GAS 抓最新的 Google 地圖清單
- 加入 filter 條件：評價 4+、價位、分類篩選
- 將地圖資料轉為 GeoJSON，供 Web 前端使用

---

## 📜 License

MIT

---