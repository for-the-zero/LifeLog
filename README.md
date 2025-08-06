# LifeLog

记录手机和电脑的使用情况

Record the usage of mobile phones and computers

---

这个主要是给我自己做的项目，所以比较潦草

This is mainly for my own project, so it is a bit rough.

---

# 使用 / Usage

懒得写，只有大致步骤

Too lazy to write, only rough steps

## 服务器端 / Server

使用 Cloudflare Workers + kv

Use Cloudflare Workers + kv

修改`server/src/index.js`中的密钥，更改`server/wrangler.jsonc`中对kv的绑定，然后执行`npm run deploy`

Modify the secret key in `server/src/index.js`, change the binding of kv in `server/wrangler.jsonc`, and then execute `npm run deploy`

## 手机(Android) / Mobile(Android)

随便找个这种app，我这里用[自动任务](https://github.com/xjunz/AutoTask)，按照那两个文件做就行了，不难

Use any app like that, I use [AutoTask](https://github.com/xjunz/AutoTask), just follow the two files, not difficult

~~别的我都用不上手，这个基本上想要的功能缺了一半，我还得用shell获取。这就算了，shell执行功能有bug（不然你猜为什么要用这种奇怪的方式进行请求），不知道怎么解决，它会把命令分为多行给到curl，报错里面全是`application`不是主机、一串数字（时间戳之类的）不是主机……~~

~~If you want to know what i wrote above, translate it yourself!~~

## 电脑(Windows) / Computer(Windows)

改一下`windows/config.json`就运行`npm run build`，然后安装就行了

Modify `windows/config.json` and run `npm run build`, then install it.

~~里面夹带了截图功能，这是我的个人需求，不想要就删掉代码~~

~~There is a screenshot function, it's my personal demand, if you don't want it, delete the code~~

---

# Data

请求`{server_url}/get`，返回json数组，每个子项是一个对象

Request `{server_url}/get`, Return json array, each item is an object.

电脑： / Computer:

```jsonc
{
    "device": "laptop",
    "app_title": "Window Title",
    "app_exe": "exe name",
    "used": 114514, // 使用时长(秒) / Used time(seconds)
    "time": "1145141919810", // 时间戳(毫秒) / Timestamp(ms)
}
```

手机: / Mobile:

```jsonc
{
    "device": "phone",
    "app_name": "App Name",
    "app_pn": "package name",
    "battery": 100, // 电量 / Battery
    "is_charging": true, // 是否充电 / Is charging?
    "time": "1145141919810", // 时间戳(毫秒) / Timestamp(ms)
}
```

---

# 另一个README / Another README

怕你看不惯我这种README，于是使用Gemini Cli生成~~，懒得人工审核，不知道对不对~~

I'm afraid you won't like this README, so I use Gemini Cli to generate it~~, lazy to review it manually, don't know if it's correct~~

[GO!!!](README_GC.md)

```txt
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                            │
│  Agent powering down. Goodbye!                                                                                             │
│                                                                                                                            │
│  Interaction Summary                                                                                                       │
│  Tool Calls:                 6 ( ✔ 6 ✖ 0 )                                                                                │
│  Success Rate:               100.0%                                                                                        │
│  User Agreement:             100.0% (1 reviewed)                                                                           │
│                                                                                                                            │
│  Performance                                                                                                               │
│  Wall Time:                  9m 51s                                                                                        │
│  Agent Active:               3m 29s                                                                                        │
│    » API Time:               3m (86.0%)                                                                                    │
│    » Tool Time:              29.4s (14.0%)                                                                                 │
│                                                                                                                            │
│                                                                                                                            │
│  Model Usage                  Reqs   Input Tokens  Output Tokens                                                           │
│  ───────────────────────────────────────────────────────────────                                                           │
│  gemini-2.5-pro                  9        138,386          6,626                                                           │
│                                                                                                                            │
│  Savings Highlight: 73,306 (53.0%) of input tokens were served from the cache, reducing costs.                             │
│                                                                                                                            │
│  » Tip: For a full token breakdown, run `/stats model`.                                                                    │
│                                                                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

---

# 图标 / Icon

windows/icon.png

Generated by [AppIcon Forge](https://zhangyu1818.github.io/appicon-forge/)

Author: [Siemens AG](https://github.com/siemens/ix-icons)

Licence: [MIT](https://github.com/siemens/ix-icons/blob/main/LICENSE.md)