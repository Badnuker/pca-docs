---
title: 数据模型
description: Product、ParsedIntent、AgentResult 等核心数据结构的定义与使用场景
---

## 概述

项目使用 Rust 的 `struct` 定义核心数据结构，通过 `serde` 实现 JSON 序列化/反序列化。前端 TypeScript 侧有对应的 `interface` 镜像定义。

## Product（商品）

商品数据的核心载体，与 `data/products.json` 中的每条记录一一对应。LLM 匹配后会在 `match_type` 字段标注匹配类型。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String | 唯一标识，格式 `{平台前缀}-{序号}`，如 `jd-001` |
| `name` | String | 商品完整名称 |
| `platform` | String | 平台来源：`京东` 或 `淘宝` |
| `price` | f64 | 当前售价（元） |
| `original_price` | Option\<f64\> | 原价，可为空 |
| `specs` | String | 规格参数描述 |
| `category` | String | 商品品类 |
| `features` | Vec\<String\> | 功能特征标签 |
| `rating` | Option\<f64\> | 用户评分（0-5），可为空 |
| `review_count` | Option\<u32\> | 累计评价数，可为空 |
| `shipping` | Option\<f64\> | 运费（元），0 表示包邮，可为空 |
| `link` | String | 商品详情页 URL |
| `match_type` | Option\<String\> | LLM 标注的匹配类型：`exact` / `similar` / `alternative` |

> **源码**：[`src-tauri/src/models/product.rs`](https://github.com/Badnuker/price-compare-agent/blob/main/src-tauri/src/models/product.rs)

## ParsedIntent（意图解析结果）

LLM 将用户自然语言转换为结构化数据的结果。`is_complete` 和 `missing_fields` 用于判断是否需要追问。

| 字段 | 类型 | 说明 |
|------|------|------|
| `product_name` | Option\<String\> | 商品类型，如"蓝牙耳机" |
| `brand` | Option\<String\> | 品牌偏好 |
| `model` | Option\<String\> | 具体型号 |
| `budget_min` | Option\<f64\> | 预算下限 |
| `budget_max` | Option\<f64\> | 预算上限 |
| `features` | Vec\<String\> | 功能要求列表 |
| `usage_scenario` | Option\<String\> | 使用场景 |
| `is_complete` | bool | 是否足够进行比价 |
| `missing_fields` | Vec\<String\> | 缺失的关键字段 |

`missing_info()` 方法：当 `is_complete == false` 且 `missing_fields` 非空时，自动生成追问文案：`"请补充以下信息以获取更准确的比价结果：品牌、预算范围"`。

> **源码**：[`src-tauri/src/models/product.rs`](https://github.com/Badnuker/price-compare-agent/blob/main/src-tauri/src/models/product.rs)

## AgentResult（返回结果）

Agent 流水线完成后返回给前端的最终结构。

| 字段 | 类型 | 说明 |
|------|------|------|
| `products` | Vec\<Product\> | LLM 匹配标注后的商品列表 |
| `recommendation` | String | LLM 生成的推荐理由（2-3 句话） |

## Settings（用户配置）

持久化到 `settings.json` 的配置结构，`get_settings`/`save_settings` 命令读写此结构。

| 字段 | 类型 | 说明 |
|------|------|------|
| `llm_provider` | String | 模型厂商：`openai` 或 `anthropic` |
| `llm_api_key` | String | API 密钥 |
| `llm_base_url` | String | API 端点地址 |
| `llm_model` | String | 模型标识符 |

存储位置：
- **Windows**: `C:\Users\<用户名>\AppData\Roaming\net.badnuker.price-compare-agent\settings.json`
- **macOS**: `~/Library/Application Support/net.badnuker.price-compare-agent/settings.json`

> **源码**：[`src-tauri/src/commands/settings.rs`](https://github.com/Badnuker/price-compare-agent/blob/main/src-tauri/src/commands/settings.rs)

## StepEvent（步骤事件）

通过 Tauri event `agent-step` 推送给前端的实时进度结构。

| 字段 | 类型 | 说明 |
|------|------|------|
| `index` | usize | 步骤序号：0-3 |
| `label` | String | 步骤中文描述 |

> **源码**：[`src-tauri/src/agent/orchestrator.rs:12-16`](https://github.com/Badnuker/price-compare-agent/blob/main/src-tauri/src/agent/orchestrator.rs#L12-L16)

## 前后端类型对应

| Rust (`src-tauri/src/models/`) | TypeScript (`src/types/`) | 用途 |
|------|------|------|
| `Product` | `Product` | 商品数据 |
| `ParsedIntent` | （仅后端使用） | LLM 意图解析中间产物 |
| `AgentResult` | `AgentResult` | 返回给前端的最终结果 |
| `Settings` | `Settings` | 用户配置 |
| `StepEvent` | `StepPayload` | 实时步骤推送 |
