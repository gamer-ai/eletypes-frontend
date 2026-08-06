# Eletypes 打字

> **一款优雅、开源的打字工具 —— 最初只是一个打字测试，后来慢慢长大：词卡（不少英语学习者在用）、3D 键盘设计工坊、Markdown 编辑器，以及免注册排行榜和成就徽章。** 练习历史数据存在本地浏览器。排行榜只需你自选一个昵称，无需邮箱、无需密码、无需账号。

**🌐 [English](./README.md) · [中文](./README.zh-CN.md)**

[![线上](https://img.shields.io/badge/www-eletypes.com-6ec6ff)](https://www.eletypes.com)
![版本](https://img.shields.io/github/v/release/gamer-ai/eletype-frontend?include_prereleases)
![Stars](https://img.shields.io/github/stars/gamer-ai/eletype-frontend?style=social)
![Discord](https://img.shields.io/discord/993567075589181621)
[![许可](https://img.shields.io/badge/license-GPL--3.0-blue)](LICENSE)

<img width="1000" alt="Eletypes" src="https://user-images.githubusercontent.com/39578778/187084111-97d69aa7-53e4-46b9-b156-3ecc4d180d08.png" />

## 为什么选择 Eletypes？

最初只是一个受 [monkeytype.com](https://www.monkeytype.com/) 启发的打字测试，后来慢慢长大。现在的四根支柱是 **打字测试**、**词卡**（英语学习者在用）、**键盘实验室**（3D 键盘设计工坊）、以及 **Markdown 编辑器** —— 全部整合在同一个干净、开源的应用里。基于 React 18 + Vite，排行榜使用 Supabase。

## 功能

### 模式
- **打字测试** —— 支持英文与中文拼音，单词与句子模式，15/30/60/90 秒计时或不计时，可叠加数字 / 符号，脉冲与光标两种节奏样式，中文模式支持隐藏汉字/拼音
- **词卡** *（英语学习者常用）* —— GRE、TOEFL、CET4 / CET6 词书；边打边学，支持"背诵模式"（隐藏单词、显示例句）
- **键盘实验室**（`/keyboardlab`，*Beta*）—— 在浏览器里设计 3D 键盘：7 种布局、8 种键帽轮廓、参数化外壳编辑器、KLE 导入、完整 JSON Schema 编辑。→ [详细文档](src/components/features/KeyboardLab/KEYBOARD_LAB.md)
- **Markdown 编辑器**（`/markdown`）—— 实时预览、语法高亮、导出 `.md`
- **QWERTY 练习** —— 盲打训练

### 社交与进阶
- **免注册排行榜** —— 各模式前 50 名；自选昵称即可；浏览器指纹仅用于防刷
- **徽章与段位** —— 30+ 成就，覆盖速度、准确率、稳定性、探索
- **统计面板** —— 活动热力图、WPM 趋势、异常检测、历史会话
- **挑战链接** —— 基于种子的确定性词序，和朋友打完全一样的测试
- **战绩分享卡** —— 一键生成图片，分享到 X / Discord / WhatsApp / LinkedIn / 微博 / 微信

### 体验
- **18 种主题**，包含 WebGL 动态背景（Tranquiluxe、Lumiflex、Opulento、Velustro）
- **自定义主题** —— 实时预览，可调颜色、渐变、字体、文字阴影；本地保存并归入主题选择器里的"我的主题"分组。可从底部主题选择器旁的调色盘按钮打开，或从**个人中心 → 主题**进入。
- **自定义词组** —— 把你自己的词库（英文或中文拼音）带进限时测试。词组严格按你写下的顺序循环到计时结束；支持 JSON 导出 / 导入，方便在不同设备间携带；内置一份机械键盘相关示例。可从**个人中心 → 词组**，或测试界面上方的「自定义词组」按钮打开。
- **打字音效** —— 樱桃青轴、机械键盘、打字机
- **专注 / 超静 模式** —— 无干扰界面
- **PWA** —— 可安装、可离线
- **中英双语 UI**
- **键盘快捷键** —— `Tab+Space` 重做 · `Tab+Enter` 重开

### 让它更像你
从配色到屏幕上出现的词，都可以由你定义。如果你恰好是位键盘博主，**自定义主题**和**自定义词组**或许能让视频更接近你心里的样子 —— 调出贴合频道的色调，挑出想展示的词（型号、轴体、自己的话），按你写下的顺序循环出现。或者，你只是像我一样，单纯喜欢漂亮的色彩。

### 隐私
无账号、无广告、无追踪。练习历史与设置仅保存在浏览器 localStorage。唯一离开你设备的是你主动提交的排行榜记录 —— 包括你自选的昵称（无需邮箱、无需密码、无需账号），以及仅用于防刷/去重的浏览器指纹。

## 图集

<table>
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/0ab9989a-260a-4b63-95be-b994f3a0b493" alt="Keyboard Lab" /><br/><sub><b>键盘实验室</b> —— 在浏览器里设计 3D 键盘</sub></td>
    <td width="50%"><img src="https://github.com/gamer-ai/eletypes-frontend/assets/39578778/d716a287-6f59-4568-8276-1ee6b5f5850a" alt="Dynamic themes" /><br/><sub><b>WebGL 动态主题</b> —— Tranquiluxe · Lumiflex · Opulento · Velustro</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/bf5fa8c6-26d9-439f-b284-0d1620b09fdc" alt="Markdown editor" /><br/><sub><b>Markdown 编辑器</b> —— 实时预览 + 语法高亮</sub></td>
    <td width="50%"><img src="https://github.com/user-attachments/assets/ab3e7c94-4f38-4607-86aa-1cd3d8296381" alt="Ultra Zen mode" /><br/><sub><b>超静模式</b> —— 自动高亮、自动淡出、无干扰</sub></td>
  </tr>
</table>

## 快速开始

```bash
npm install
npm run dev      # localhost:3000
npm run build    # 生产构建，输出到 build/
npm run preview  # 本地预览生产构建
```

部署：把 `build/` 目录里的内容推送到任何静态托管即可。`npm run deploy` 只是 `npm run build` 的别名，**本身并不会部署到任何地方**。

## 文档

- [键盘实验室 —— 架构与路线图](src/components/features/KeyboardLab/KEYBOARD_LAB.md)
- [Claude / Agent 协作指南](CLAUDE.md)

## 社区

- **Discord** —— 在应用页脚点击 Discord 图标加入
- **[问题反馈 / 需求提交](https://github.com/gamer-ai/eletype-frontend/issues)**

## 鸣谢

特别感谢 [@rendi12345678](https://github.com/rendi12345678) 长期以来的贡献 —— 包括打字数据可视化功能。

## 赞助

如果 Eletypes 帮到了你，或者只是让你会心一笑，欢迎请作者喝杯咖啡：

[☕ Buy Me A Coffee](https://www.buymeacoffee.com/daguozi)

## 许可

[GPL-3.0](LICENSE) —— 可自由使用、修改、再分发。派生作品须以同样的许可保持开源。
