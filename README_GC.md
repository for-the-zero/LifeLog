# LifeLog

LifeLog is a personal project for tracking and recording computer and mobile phone usage. It consists of a server-side component and client-side applications for Windows and Android.

LifeLog 是一个用于追踪和记录电脑及手机使用情况的个人项目。它由一个服务器端组件和适用于 Windows 及 Android 的客户端应用程序组成。

## 功能特性/Features

- **Cross-platform Tracking:** Monitors application usage on both Windows and Android devices.

- **跨平台追踪:** 监控 Windows 和 Android 设备上的应用程序使用情况。

- **Server-side Storage:** A Cloudflare Worker handles data storage, providing a centralized log.

- **服务器端存储:** 使用 Cloudflare Worker 处理数据存储，提供集中的日志记录。

- **Data Retrieval API:** Simple RESTful API to get the logged data.

- **数据检索 API:** 通过简单的 RESTful API 获取记录的数据。

- **Windows Application:** An Electron-based client for Windows that automatically tracks active applications.

- **Windows 应用程序:** 一个基于 Electron 的 Windows 客户端，可自动追踪活动的应用程序。

- **Android (Pseudo-code):** A reference implementation for Android using a macro application.

- **Android (伪代码):** 一个使用宏应用程序的 Android 参考实现。

- **Screenshot functionality:** The Windows client can optionally take screenshots.

- **截图功能:** Windows 客户端可以选择性地进行截图。

## 架构/Architecture

The project is divided into three main parts:

该项目分为三个主要部分：

1.  **Server:** A [Cloudflare Worker](https://workers.cloudflare.com/) that exposes a simple REST API. It uses [Cloudflare KV](https://developers.cloudflare.com/workers/learning/how-kv-works/) to store the usage data as a JSON array.

    **服务器:** 一个暴露简单 REST API 的 [Cloudflare Worker](https://workers.cloudflare.com/)。它使用 [Cloudflare KV](https://developers.cloudflare.com/workers/learning/how-kv-works/) 将使用数据存储为 JSON 数组。

2.  **Windows Client:** An [Electron](https://www.electronjs.org/) application that runs in the background. It identifies the currently active window and sends the application title, executable name, and usage duration to the server every 5 minutes.

    **Windows 客户端:** 一个在后台运行的 [Electron](https://www.electronjs.org/) 应用程序。它会识别当前活动的窗口，并每5分钟将应用程序标题、可执行文件名和使用时长发送到服务器。

3.  **Android Client:** The project provides a pseudo-code example for an Android client. It's designed to be implemented using a macro application like [AutoTask](https://github.com/xjunz/AutoTask) to send the current app's name and package name to the server.

    **Android 客户端:** 项目提供了一个 Android 客户端的伪代码示例。它设计为使用像 [AutoTask](https://github.com/xjunz/AutoTask) 这样的宏应用程序来实现，将当前应用程序的名称和包名发送到服务器。

## 安装与使用/Setup and Usage

### 1. 服务器/Server

The server is a Cloudflare Worker.

服务器是一个 Cloudflare Worker。

**Prerequisites:**

**先决条件:**

- A Cloudflare account.

- 一个 Cloudflare 帐户。

- [Node.js](https://nodejs.org/) and npm installed.

- 已安装 [Node.js](https://nodejs.org/) 和 npm。

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) installed.

- 已安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)。

**Setup:**

**设置:**

1.  **Clone the repository.**

    **克隆仓库。**

2.  Navigate to the `server` directory.

    进入 `server` 目录。

3.  Install dependencies: `npm install`

    安装依赖: `npm install`

4.  **Configure `server/src/index.js`:**

    **配置 `server/src/index.js`:**

    -   Replace `"SECRET_KEY"` with a strong, private key of your choice. This key will be used to authenticate requests from your clients.

    -   将 `"SECRET_KEY"` 替换为您选择的强私钥。此密钥将用于验证来自您客户端的请求。

5.  **Configure `server/wrangler.jsonc`:**

    **配置 `server/wrangler.jsonc`:**

    -   Update the `kv_namespaces` binding to match your Cloudflare KV namespace.

    -   更新 `kv_namespaces` 绑定以匹配您的 Cloudflare KV 命名空间。

6.  **Deploy the worker:**

    **部署 Worker:**

    ```bash
    npm run deploy
    ```

### 2. Windows 客户端/Windows Client

The Windows client is an Electron application.

Windows 客户端是一个 Electron 应用程序。

**Setup:**

**设置:**

1.  Navigate to the `windows` directory.

    进入 `windows` 目录。

2.  **Configure `windows/config.json`:**

    **配置 `windows/config.json`:**

    -   `server_url`: Set this to the URL of your deployed Cloudflare Worker (e.g., `https://your-worker.your-subdomain.workers.dev`).

    -   `server_url`: 将此设置为您部署的 Cloudflare Worker 的 URL (例如, `https://your-worker.your-subdomain.workers.dev`)。

    -   `key`: Set this to the same secret key you configured on the server.

    -   `key`: 将此设置为您在服务器上配置的相同密钥。

    -   `ss_save_path`: (Optional) The path where screenshots will be saved.

    -   `ss_save_path`: (可选) 截图保存的路径。

3.  Install dependencies: `npm install`

    安装依赖: `npm install`

4.  Build the application: `npm run build`

    构建应用程序: `npm run build`

5.  The installer will be located in the `windows/builds` directory. Run the installer to install the application. The application will automatically start on login.

    安装程序将位于 `windows/builds` 目录中。运行安装程序以安装应用程序。该应用程序将在登录时自动启动。

### 3. Android 客户端/Android Client

The Android client is not a standalone application but a script for a macro tool. The provided `android/reference.pseudo.js` is a template.

Android 客户端不是一个独立的应用程序，而是一个用于宏工具的脚本。提供的 `android/reference.pseudo.js` 是一个模板。

**Setup:**

**设置:**

1.  Install a macro application on your Android device (e.g., [AutoTask](https://github.com/xjunz/AutoTask)).

    在您的 Android 设备上安装一个宏应用程序 (例如, [AutoTask](https://github.com/xjunz/AutoTask))。

2.  Create a new task/script based on the `android/reference.pseudo.js` file.

    基于 `android/reference.pseudo.js` 文件创建一个新任务/脚本。

3.  **Update the script:**

    **更新脚本:**

    -   Replace `'https://your-api-url.com/post'` with your actual server URL.

    -   将 `'https://your-api-url.com/post'` 替换为您的实际服务器 URL。

    -   Replace `'your-auth-key'` with your secret key.

    -   将 `'your-auth-key'` 替换为您的密钥。

4.  Set up the macro to run periodically (e.g., every 5 minutes) when the screen is on.

    设置宏以在屏幕开启时定期运行 (例如, 每5分钟)。

## API 端点/API Endpoints

The server provides the following API endpoints:

服务器提供以下 API 端点：

-   `GET /get`: Retrieves all stored log data.

-   `GET /get`: 检索所有存储的日志数据。

-   `POST /post`: Adds a new log entry. Requires the `X-Auth-Key` header for authentication.

-   `POST /post`: 添加一个新的日志条目。需要 `X-Auth-Key` 请求头进行身份验证。

-   `POST /edit`: Overwrites the entire log data with the new data provided in the request body. Requires the `X-Auth-Key` header.

-   `POST /edit`: 使用请求正文中提供的新数据覆盖整个日志数据。需要 `X-Auth-Key` 请求头。

## 数据格式/Data Format

The data is stored and retrieved as a JSON array. Each object in the array represents a log entry.

数据以 JSON 数组的形式存储和检索。数组中的每个对象代表一个日志条目。

**Windows Log Entry:**

**Windows 日志条目:**

```json
{
    "device": "laptop",
    "app_title": "Window Title",
    "app_exe": "exe name",
    "used": 12345,
    "time": "1678886400000"
}
```

**Android Log Entry:**

**Android 日志条目:**

```json
{
    "device": "phone",
    "app_name": "App Name",
    "app_pn": "package.name",
    "battery": 80,
    "is_charging": false,
    "time": "1678886400000"
}
```

## 图标许可/Icon License

The icon used in the Windows application is from the [Siemens IX Icons](https://github.com/siemens/ix-icons) library, which is licensed under the [MIT License](https://github.com/siemens/ix-icons/blob/main/LICENSE.md). The icon was generated using the [AppIcon Forge](https://zhangyu1818.github.io/appicon-forge/).

Windows 应用程序中使用的图标来自 [Siemens IX Icons](https://github.com/siemens/ix-icons) 库，该库根据 [MIT 许可证](https://github.com/siemens/ix-icons/blob/main/LICENSE.md) 授权。该图标是使用 [AppIcon Forge](https://zhangyu1818.github.io/appicon-forge/) 生成的。
