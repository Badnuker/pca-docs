---
title: 快速开始
description: 如何安装和启动跨平台比价智能体
---

## 下载安装

从 [GitHub Release](https://github.com/Badnuker/price-compare-agent/releases) 页面下载最新版本：

- **Windows**: 下载 `.msi` 安装包，双击安装
- **免安装**: 下载 `PriceCompare.exe` 直接运行（需系统已安装 WebView2）

> Windows 10/11 已内置 WebView2，无需额外安装。

## 首次配置

首次打开应用会自动弹出设置面板，需要配置 AI 模型连接信息：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| API 兼容格式 | 选择 OpenAI 或 Anthropic | OpenAI |
| API Key | 模型提供商的密钥 | `sk-xxxx` |
| API Base URL | API 端点地址 | `https://api.deepseek.com` |
| 模型 IDs | 模型标识符 | `deepseek-v4-flash` |

支持的模型服务商：

- **DeepSeek**: Base URL `https://api.deepseek.com`，模型如 `deepseek-v4-flash`
- **Anthropic**: Base URL `https://api.anthropic.com`，模型如 `claude-sonnet-4-6`
- **Ollama 本地**: Base URL `http://localhost:11434/v1`，模型如 `qwen2.5`
- **通义千问**: Base URL `https://dashscope.aliyuncs.com/compatible-mode/v1`

保存后即时生效，无需重启应用。

## 开始比价

1. 在搜索框输入自然语言描述
2. 点击"比价"或按回车
3. 等待 AI 分析（约 5-15 秒）
4. 查看比价结果和推荐

**示例输入**：
- "找一款 300 以内适合运动的蓝牙耳机"
- "有没有 1000 以下的降噪耳机"
- "帮我推荐一款性价比高的蓝牙耳机"

## 切换模型

点击标题栏右侧的齿轮图标，修改设置后点保存，下次查询自动使用新模型。
