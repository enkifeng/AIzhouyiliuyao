# 六爻AI断卦 APK 打包说明

## 📱 项目结构
```
liuyao-apk/
├── app/src/main/
│   ├── assets/index.html       ← 主程序（来自 mobile.html）
│   ├── java/com/liuyao/ai/
│   │   └── MainActivity.java   ← WebView 容器
│   ├── res/
│   │   ├── mipmap-*/           ← 各尺寸图标
│   │   └── values/             ← 字符串、主题
│   └── AndroidManifest.xml
├── .github/workflows/
│   └── build-apk.yml           ← GitHub Actions 自动构建
└── gradle/                     ← Gradle 构建工具
```

---

## 🚀 方式一：GitHub Actions 自动构建（推荐，无需本地安装任何环境）

**步骤：**
1. 在 GitHub 创建一个新的**私有仓库**（名称随意，如 `liuyao-apk`）
2. 把整个 `liuyao-apk` 目录推送到该仓库：
   ```bash
   cd liuyao-apk
   git init
   git add .
   git commit -m "初始提交"
   git remote add origin https://github.com/你的用户名/liuyao-apk.git
   git push -u origin main
   ```
3. 推送后，GitHub 会自动触发 Actions 构建
4. 等待 3~5 分钟，在仓库的 **Actions** 标签页查看进度
5. 构建成功后，点击该 workflow run → 下载 **Artifacts** 中的 `六爻AI断卦-debug.zip`
6. 解压得到 `app-debug.apk`，传到手机安装即可

---

## 🛠️ 方式二：Android Studio 本地构建

**前提：** 安装 [Android Studio](https://developer.android.com/studio)（约 1.2GB）

**步骤：**
1. 打开 Android Studio → `File` → `Open` → 选择 `liuyao-apk` 目录
2. 等待 Gradle 同步（首次约 5~10 分钟，需下载依赖）
3. 菜单 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
4. 构建完成后点击通知中的 `locate` 找到 APK 文件
5. APK 位置：`app/build/outputs/apk/debug/app-debug.apk`

---

## ℹ️ 注意事项
- **安装 APK 时手机需开启"允许未知来源"**（设置→安全→允许安装未知应用）
- Debug APK 可直接安装，无需签名；如需上架应用市场需要 Release 签名
- 应用名称：**六爻AI断卦**
- 包名：`com.liuyao.ai`
- 最低支持 Android 5.0（API 21）
