# 番茄专注计时器 V1

基于 Vanilla JavaScript + Vite 的前端实现。

## 本地运行

```bash
npm install
npm run dev
```

打开本地地址（默认 `http://localhost:5173`）。

## 构建预览

```bash
npm run build
npm run preview
```

## 验收路径（V1）

1. 计时主流程
- 在 `dashboard` 点击开始，确认秒级倒计时。
- 点击暂停后停止，再次点击继续恢复。
- 点击重置后恢复当前模式完整时长。
- 专注/休息结束时（提示音开启）播放提示音。

2. 设置流程
- 在 `settings` 修改专注/休息时长并保存。
- 刷新页面后配置不丢失。
- 提示音开关状态可持久化。

3. 数据流程
- 在 `data` 点击导出，下载 `.json` 备份文件。
- 导入合法备份文件后，设置与统计恢复。
- 导入非法文件时提示失败且不覆盖现有数据。

## 说明

- 存储位置：浏览器 `localStorage`。
- 导出文件包含 `schemaVersion`、`exportedAt` 与完整 `appState`。
