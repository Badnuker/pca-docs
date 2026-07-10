---
title: 更新日志
description: 跨平台比价智能体的版本更新记录
---

## v2.0.0 — 2026-07-10

### 新功能
- **流式输出**：OpenAI + Anthropic 双端 SSE streaming，推荐理由实时打字显示
- **暗色主题**：GitHub Dark 风格，CSS 变量体系，全组件覆盖
- **对话历史**：左侧 Sidebar 多轮对话，上下文记忆，支持重命名/删除
- **欢迎页**：带建议卡片和 logo 的 WelcomeScreen
- **缩放支持**：Ctrl+滚轮调整界面（0.75x–1.5x）
- **数据源切换**：移除离线 JSON 数据集，LLM 根据训练数据动态生成商品信息

### 改进
- ResultCard 商品详情卡片 + Drawer 展开
- PriceComparison ECharts 价格对比图表
- ChatInput 底部输入栏 + 快捷模板
- ThinkingBlock 三步进度指示
- 支持中途停止生成（AbortController）
- Agent 编排升级：带上下文的多轮对话

---

## v1.1.0 — 2026-07-09

### 新功能
- **对话式交互**：消息气泡风格，用户消息靠右、Agent 回复靠左
- **底部输入栏**：固定底部输入框 + 发送按钮
- **虚线进度条**：手写 StepsBar 组件，已完成实线、未完成虚线
- **新应用图标**：Lucide 购物车图标

---

## v1.0.0 — 2026-07-08

### 功能
- 自然语言比价：输入描述 → AI 匹配推荐
- 跨平台覆盖：京东 + 淘宝离线商品数据
- 智能匹配：LLM 识别跨平台同一商品
- 价格可视化：结果表格 + ECharts 柱状图
- 实时步骤：Agent 执行进度展示
- 双模型兼容：OpenAI 兼容格式 + Anthropic Claude
- 应用内设置：无需修改配置文件，即时切换模型
