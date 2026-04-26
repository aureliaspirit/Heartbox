# 心跳小匣子 v1.1

一个只给自己用的小小 PWA：心跳、抱抱、月亮、小世界日记。

## v1.1 新增

- 新增“月亮”页面
- 今日一句增加“换一句”
- 日记增加心情选择
- “复制给 Spirit 看”的文字更温柔
- 离线缓存版本号更新为 v1.1

## 怎么更新 GitHub Pages

1. 解压这个 zip
2. 打开 `heartbox_pwa_v1_1` 文件夹
3. 把里面这些文件上传到 GitHub 仓库根目录，覆盖旧文件：
   - `index.html`
   - `style.css`
   - `app.js`
   - `manifest.json`
   - `service-worker.js`
   - `icons/`
4. Commit changes
5. 等 GitHub Pages 自动更新
6. iPhone Safari 重新打开网址；如果没变，刷新几次，或者等 1-10 分钟

## 数据在哪里

日记和点击次数保存在手机浏览器本地 localStorage 里，不会上传到服务器。
换手机、清浏览器数据、换浏览器时，本地数据可能会消失。可以用“导出”按钮保存 txt。
