---
title: 技术栈
description: 跨平台比价智能体使用的技术栈详解
---

## 总览

| 层 | 技术 | 说明 |
|------|------|------|
| 桌面框架 | Tauri 2 | Rust 后端 + WebView 前端，打包体积 ~5MB |
| 后端语言 | Rust | Agent 编排 + LLM 调用 + 配置管理 |
| 前端框架 | React + TypeScript | 函数组件 + Hooks，类型安全 |
| UI 库 | Ant Design 5 | 表格、表单、步骤条、抽屉 |
| 图表 | ECharts | 价格柱状图 |
| AI SDK | async-openai + reqwest | OpenAI 兼容 + Anthropic 双协议 |
| 异步运行时 | tokio | Rust 异步运行时 |
| 序列化 | serde + serde_json | JSON 序列化/反序列化 |

## 为什么选 Tauri

| | Tauri | Electron |
|------|-------|---------|
| 后端语言 | Rust | Node.js |
| 打包体积 | ~5 MB | ~150 MB |
| 内存占用 | 低 | 高 |
| 前后端通信 | IPC invoke | IPC / HTTP |

Tauri 用操作系统内置的 WebView2 渲染界面，不需要打包整个 Chromium。

## 为什么选 Rust

- LLM 调用是 IO 密集型任务，Rust 的 async/await 配合 tokio 性能优异
- Agent 编排逻辑用 Rust trait 系统天然适合抽象不同 LLM Provider
- 编译到原生代码，无需运行时，分发简单
- `include_str!` 编译时嵌入数据文件，零运行时文件依赖

## AI 接入层架构

项目定义了统一的 `LlmProvider` trait，不同服务商只需实现 `chat()` 方法：

```
LlmProvider trait
  ├── OpenAiCompatProvider  (async-openai)
  │     └── DeepSeek / Ollama / vLLM / 通义千问 ...
  └── AnthropicProvider     (reqwest)
        └── Claude Sonnet / Haiku ...
```

上层 Agent 编排代码只依赖 `Arc<dyn LlmProvider>`，不感知底层是哪个模型。
