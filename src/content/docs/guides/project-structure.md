---
title: 项目结构
description: 逐个文件走读项目源码，适合刚入门的开发者了解项目全貌
---

## 项目长什么样

整个项目像一个汉堡——上面是前端（用户看到的界面），下面是后端（逻辑和 AI），Tauri 是中间那层胶水把它们粘在一起。

```
price-compare-agent/
├── package.json          ← 前端身份卡（记录用了哪些 npm 包）
├── vite.config.ts        ← 前端构建工具配置
├── data/products.json    ← 离线商品数据（京东 + 淘宝的蓝牙耳机）
│
├── src/                  ← 前端源码（React + TypeScript）
│   ├── main.tsx          ← 启动入口，把 <App/> 渲染到页面
│   ├── App.tsx           ← 主页面：搜索流程、步骤展示、结果渲染
│   ├── types/product.ts  ← 数据类型定义（商品、意图、结果）
│   ├── api/
│   │   ├── query.ts      ← 调用后端"搜索商品"命令
│   │   └── settings.ts   ← 调用后端"读写设置"命令
│   └── components/
│       ├── ChatBubble.tsx      ← 消息气泡（用户 + Agent）
│       ├── StepsBar.tsx         ← 虚线进度条
│       ├── ResultTable.tsx     ← 结果表格（排序、标签、链接）
│       ├── PriceChart.tsx      ← 价格柱状图
│       └── SettingsDrawer.tsx  ← 设置面板（配置 AI 模型）
│
└── src-tauri/            ← 后端源码（Rust）
    ├── Cargo.toml         ← Rust 身份卡（记录了用哪些 crate）
    ├── tauri.conf.json    ← 桌面应用配置（窗口大小、图标等）
    └── src/
        ├── main.rs        ← 程序入口，调用 lib.rs 启动
        ├── lib.rs         ← 核心组装：加载配置 → 创建 AI Provider → 启动 Tauri
        ├── config.rs      ← 读取环境变量配置
        ├── models/
        │   └── product.rs ← 数据结构：商品、意图解析结果、返回结果
        ├── commands/
        │   ├── query.rs   ← "搜索商品"命令（前端通过 invoke 调用）
        │   └── settings.rs ← "读写设置"命令（持久化到磁盘）
        ├── agent/
        │   ├── orchestrator.rs ← 大脑：控制四步比价流水线
        │   ├── intent.rs       ← 调用 LLM，把用户大白话转成结构化数据
        │   └── tools.rs        ← 商品加载、关键词粗筛
        └── ai/
            ├── provider.rs      ← AI 统一接口（trait）
            ├── openai_compat.rs ← OpenAI 兼容格式实现
            └── anthropic.rs     ← Anthropic 格式实现
```

## 前端部分（用户看到的界面）

### 入口：`main.tsx`

只有 9 行代码。找到 HTML 里的 `<div id="root">` 容器，把 `<App/>` 组件渲染进去。像一个空画框，等着 React 在上面作画。

### 大脑：`App.tsx`

整个前端最核心的文件。管理四种状态：

- `loading` — 是否正在搜索
- `result` — 比价结果（商品列表 + 推荐）
- `stepIndex` — 当前执行到第几步
- `error` — 错误信息

核心交互逻辑：
1. 用户点击搜索 → 调用后端 `invoke("search_products")`
2. 同时监听后端实时推送的步骤事件
3. 收到结果后渲染：推荐建议 → 结果表格 → 价格柱状图

### 组件们

每个组件职责单一，像一个乐高积木：

- **ChatBubble**：消息气泡 — 用户消息靠右紫色，Agent 回复靠左白色，内嵌结果组件
- **StepsBar**：手写进度条 — 已完成实线，未完成虚线，圆点 + 标签双排布局
- **ResultTable**：用 Ant Design 的 Table 展示商品，不同平台用不同颜色标签，默认按价格升序
- **PriceChart**：用 ECharts 画柱状图，`useRef` + `useEffect` 模式操作 DOM
- **SettingsDrawer**：右侧滑出的抽屉面板，配置 API 格式、Key、地址、模型

### 前后端怎么聊天

不走 HTTP，不走 fetch。Tauri 提供两种通信方式：

| 方式 | 方向 | 干什么用 |
|------|------|---------|
| `invoke("命令名", 参数)` | 前端 → 后端 | 触发搜索、读写设置 |
| `listen("事件名", 回调)` | 后端 → 前端 | Agent 每完成一步，前端进度条前进一步 |

## 后端部分（逻辑和 AI）

### 程序入口：`main.rs`

只有 3 行代码。调用 `lib.rs` 里的 `run()` 函数启动一切。在 Windows 上隐藏控制台黑框。

### 总装车间：`lib.rs`

这是后端的大脑中枢，`run()` 函数做的事情：
1. 加载配置（API Key、模型选择）
2. 根据配置创建 AI Provider（OpenAI 兼容 or Anthropic）
3. 创建 AgentOrchestrator（比价智能体的核心大脑）
4. 启动 Tauri 应用，注册前端可调用的三个命令

### AI 接入层（`ai/` 目录）

定义了一个 `LlmProvider` trait — 这是 Rust 里的"接口"，规定了所有 AI 厂商必须实现 `chat()` 方法。有点像 TypeScript 的 `interface`。

不管底层是 DeepSeek、Claude 还是你自己搭的模型，上层 Agent 只调用 `chat()`，不关心是谁在回答。

### Agent 编排层（`agent/` 目录）

这是项目的灵魂。三个文件：

| 文件 | 做什么 |
|------|--------|
| `orchestrator.rs` | 控制四步流水线：理解需求 → 筛选商品 → 比价分析 → 生成推荐，每一步完成后通知前端 |
| `intent.rs` | 把用户大白话转成结构化数据。输入"300 以内运动蓝牙耳机"，输出 `{product_name: "蓝牙耳机", budget_max: 300, features: ["运动"]}` |
| `tools.rs` | 三个纯函数：加载商品数据、按关键词粗筛、把商品列表序列化为 JSON 喂给 LLM |
