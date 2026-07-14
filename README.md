# 錢從哪裡來（biz-map）

> 一個把「產業怎麼賺錢」與「股價為什麼漲」講清楚的互動網站。
> 定位刻意選在難的一邊：**描述位置、不做預測。**

## 這是什麼

市面上的投資網站大致分兩種：賣訊號的，和只攤數據的。這個網站兩者都不是——
它是一套**互動式的投資思考教材**，帶使用者走一條完整的認知路徑：

1. **產業怎麼賺錢** — 用互動供應鏈圖，跟著金流走一遍，看鏈上誰賺走最多。
2. **公司怎麼賺錢** — 每家公司一張桑基圖，把營收拆到淨利，只填 5 個原始數字，其餘由程式推導保證一致。
3. **股價為什麼漲** — 用 `股價 = EPS × 本益比` 的框架拆解上漲，區分「獲利動」與「情緒動」。
4. **極端會長怎樣** — 泡沫博物館：七場歷史泡沫，同一套「泡沫五問」解剖框架。
5. **現在站在哪裡** — 市場溫度計 + 情境計算機，讓使用者在進場前先量自己的位置與風險。

## 設計理念

- **不預測方向**：所有工具只描述「你買的價格內建了哪些假設、假設鬆動的代價是幾成」，把判斷留給使用者。
- **一致性由架構保證**：公司財報只存 5 個原始輸入（revenue / cogs / rd / sga / taxAndOther），
  毛利、營益、淨利全部由程式推導，杜絕手動填數字的矛盾。
- **資料驅動**：每個產業／公司／案例／泡沫都是一個 JSON。新增內容 = 加一個 JSON + 在 `src/data/index.js` import，不動元件。

## 技術

- **Vite + React**（JSX，刻意不用 TypeScript）
- **@xyflow/react**（React Flow）— 供應鏈節點圖
- **d3-sankey** — 公司損益金流圖
- **framer-motion** — 動畫（whileInView 時間軸、路徑描繪、面板滑動）
- **react-router-dom**（HashRouter，相容 GitHub Pages）

## 專案結構

```
src/
  data/            # 內容層：全部是 JSON + 一個中央註冊表 index.js
    industries/    #   產業供應鏈（半導體、電子代工、金融、航運、零售、電信）
    companies/     #   公司桑基圖（8 家）
    cases/         #   個股漲幅拆解案例
    bubbles/       #   泡沫博物館（7 場）
    market.json    #   市場溫度計數據（更新只改這一檔）
  pages/           # 路由頁面：Home / Industry / Company / Case / Bubble / Thermometer / Concept / Listening
  components/      # 視覺元件：StageNode / FlowEdge / MoneySankey / PriceBridge / BubbleChart / RangeGauge
  lib/colors.js    # 毛利率單色相色階編碼
```

## 本地執行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/
```

## 現況

MVP 完成：六產業供應鏈、八公司金流圖、七場泡沫、市場溫度計、觀念頁、投資節目拆解方法頁。
內容資料經 WebSearch 查證，市場數據標註更新日期。
