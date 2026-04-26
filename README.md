# 心跳小匣子

一个只给自己用的小小 PWA：心跳、抱抱、小世界日记。

## 怎么打开

### 最简单预览
直接双击 `index.html` 可以看大部分界面，但离线缓存 / 安装能力需要通过 HTTPS 或本地服务器打开。

### 本地服务器预览
如果电脑有 Python：

```bash
cd heartbox_pwa
python3 -m http.server 5173
```

然后浏览器打开：

```text
http://localhost:5173
```

### 放到手机主屏幕
把这个文件夹托管到 GitHub Pages / Netlify / Vercel 这类 HTTPS 静态网站后：

1. 用 iPhone Safari 打开网址
2. 点分享按钮
3. 选择“添加到主屏幕”
4. 桌面上会出现“心跳小匣子”

## 数据在哪里

日记和点击次数保存在手机浏览器本地 localStorage 里，不会上传到服务器。
换手机、清浏览器数据、换浏览器时，本地数据可能会消失。可以用“导出”按钮保存 txt。
