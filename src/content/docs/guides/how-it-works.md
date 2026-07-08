---
title: 一个搜索请求的旅程
description: 跟着一次比价请求，走完从前端到后端再回来的完整路径
---

这篇文章跟着一个具体例子走完全程，适合想理解整体数据流的读者。

假设用户在底部输入栏输入了 **"找一款 300 以内适合运动的蓝牙耳机"**，然后点了发送按钮。

## 第一站：前端（底部输入栏 → App.tsx）

1. 用户在底部输入栏输入并回车或点击发送
2. `App.tsx` 里的 `handleSend` 函数接手：
   - `setLoading(true)` — 显示加载状态
   - `listen("agent-step")` — 开始监听后端的进度推送
   - `searchProducts(question)` — 调用后端

## 第二站：跨越进程边界（Tauri IPC）

`searchProducts` 函数只有一行：

```typescript
return invoke("search_products", { question });
```

`invoke` 是 Tauri 的魔法——它把 JavaScript 函数调用变成 Rust 函数调用，跨过进程边界。不需要 HTTP、不需要端口、不需要 CORS。

## 第三站：后端入口（commands/query.rs）

`search_products` 命令被触发。它的工作很简单：从 Tauri 状态管理中取出 `AgentOrchestrator`，调用它的 `run()` 方法。

```rust
let orch = orchestrator.read().await;
orch.run(&app_handle, &question)
```

## 第四站：Agent 大脑（orchestrator.rs）

`run()` 方法是整个系统的核心，执行四步流水线。每一步完成后都通过 Tauri event 通知前端：

### Step 0：理解需求

调用 `intent.rs` → LLM。把用户的大白话变成结构化数据：

```
输入："找一款 300 以内适合运动的蓝牙耳机"
输出：{
  product_name: "蓝牙耳机",
  budget_max: 300,
  features: ["运动"],
  is_complete: true
}
```

emit `agent-step { index: 0, label: "理解需求" }`

### Step 1：筛选商品

调用 `tools.rs` → 本地关键词匹配。不调 LLM，省钱省时间：

- 把 10 条商品数据拼接成文本
- 用 "蓝牙耳机"、"运动"、"300" 做关键词匹配
- 按命中分数排序，取前 30 条

emit `agent-step { index: 1, label: "筛选商品" }`

### Step 2：比价分析

把用户意图 + 候选商品列表拼成 prompt → 调 LLM：

```
你是一个电商比价助手。根据用户需求和候选商品列表：

1. 匹配跨平台相同商品（京东"Redmi Buds 5" vs 淘宝"红米Buds5" → 同一商品）
2. 标注每个商品的匹配类型（完全匹配 / 相似 / 替代推荐）
3. 按价格从低到高排序
4. 写 2-3 句话的推荐理由

返回 JSON：{ products: [...], recommendation: "..." }
```

emit `agent-step { index: 2, label: "比价分析" }`

### Step 3：完成

emit `agent-step { index: 3, label: "生成推荐" }`

返回 `AgentResult { products, recommendation }`

## 第五站：回到前端（渲染结果）

`App.tsx` 收到 `AgentResult`：

1. 设置 `result` 状态
2. `setLoading(false)` — 隐藏加载动画

React 自动重新渲染：

- `<Alert>` 组件显示推荐理由（绿色框）
- `<ResultTable>` 显示比价表格（商品、平台标签、价格、匹配类型）
- `<PriceChart>` 显示柱状图（不同平台不同颜色）

## 总结

整个旅程中：

- **代码做的事情**：流程控制、数据传递、JSON 解析
- **LLM 做的事情**：意图理解、商品匹配、排序推荐
- **通信方式**：前端 `invoke` 调后端，后端 `emit` 通知前端

代码量不大（每个文件职责单一），但把前端、后端、AI 三者有机串联了起来。
