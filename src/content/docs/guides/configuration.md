---
title: 设置与配置
description: 模型设置、API 配置和持久化说明
---

## 设置面板

点击标题栏右侧齿轮图标打开设置面板，支持以下配置：

| 配置项 | 类型 | 说明 |
|--------|------|------|
| API 兼容格式 | 下拉选择 | OpenAI / Anthropic |
| API Key | 密码框 | 模型提供商的密钥 |
| API Base URL | 文本框 | API 端点地址 |
| 模型 IDs | 文本框 | 模型标识符 |

## 配置持久化

设置保存后写入系统数据目录：

- **Windows**: `C:\Users\<用户名>\AppData\Roaming\net.badnuker.price-compare-agent\settings.json`
- **macOS**: `~/Library/Application Support/net.badnuker.price-compare-agent/settings.json`

保存后即时重建 Agent 编排器，下次查询使用新配置，**无需重启**。

## 首次使用

首次启动时 API Key 为空，设置面板会自动弹出，引导用户完成初始配置。

## 环境变量（开发模式）

开发时可在 `src-tauri/.env` 中配置默认值：

```env
LLM_PROVIDER=openai
LLM_API_KEY=sk-xxxx
LLM_BASE_URL=https://api.deepseek.com
LLM_MODEL=deepseek-v4-flash
```

Release 版本不依赖 `.env`，完全通过应用内设置页管理。
