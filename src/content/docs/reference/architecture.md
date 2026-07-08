---
title: 架构设计
description: 项目架构、模块划分和调用流程
---

## 分层架构

| 层 | 内容 |
|------|------|
| **前端** | React + TypeScript — SearchBox · ResultTable · PriceChart · SettingsDrawer |
| **IPC** | Tauri invoke / event |
| **后端** | commands/ (前端入口) → agent/ (Agent 编排) → ai/ (LLM Provider) |

## 模块职责

| 模块 | 路径 | 职责 |
|------|------|------|
| commands | `src-tauri/src/commands/` | Tauri 命令：search_products / get_settings / save_settings |
| agent | `src-tauri/src/agent/` | Agent 编排：意图解析 → 数据筛选 → LLM 匹配推荐 |
| ai | `src-tauri/src/ai/` | LLM Provider 抽象 + OpenAI/Anthropic 实现 |
| models | `src-tauri/src/models/` | 数据结构：Product / ParsedIntent / AgentResult |
| config | `src-tauri/src/config.rs` | 配置加载 |

## 前后端通信

两种方式：

| 方式 | 方向 | 用途 |
|------|------|------|
| `invoke()` | 前端 → 后端 | 触发搜索、读写设置 |
| `listen()` | 后端 → 前端 | Agent 步骤事件实时推送 |

步骤事件格式：

```json
{ "index": 0, "label": "理解需求" }
```

## 数据流

**完整调用链路**：

1. 前端 `invoke("search_products")` → Tauri IPC → `commands/query.rs`
2. `orchestrator.run()` → LLM 意图解析 → 返回 ParsedIntent，emit step 0
3. 关键词粗筛候选商品 → emit step 1
4. LLM 匹配 + 排序 + 推荐 → 返回结果 JSON，emit step 2-3
5. `AgentResult` 返回前端 → 渲染表格 + 柱状图 + 推荐

## 运行时配置切换

AgentOrchestrator 包装在 `Arc<RwLock<T>>` 中，保存设置时重建：

1. 用户保存设置 → `save_settings` 命令
2. 写入 `settings.json`
3. 调用 `create_provider()` 创建新 Provider
4. 创建新 `AgentOrchestrator`
5. `RwLock::write()` 替换旧实例
6. 下次查询使用新配置
