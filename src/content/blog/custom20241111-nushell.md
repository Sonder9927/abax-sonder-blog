---
title: Wezterm + Nushell + starship on Windows
date: "2024-11-11"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: custom
tags:
- shell
- windows
- wezterm
- config
description: Config Nushell on windows.
---

# 介绍

[Nushell](https://nushell.sh) 的启动非常快，决定在 Windows 上使用 Wezterm + Nushell + starship。

## 安装

```sh
winget install nushell
# or
cargo install --locked nushell

# start
nu
```

初次启动 Nushell，会提示你下载 `default env.nu` 和 `default config.nu`，默认保存在你的用户文件夹下面。
两个文件的路径可以通过调用 `echo $nu.env-path` 和 `echo $nu.config-path` 找到。`env.nu` 是用来定义环境变量的，定义的环境变量将在 `config.nu` 中可用，`config.nu` 可以用来在全局命名空间中添加定义、别名等等。

# 相关配置

## starship 美化

`env.nu`:

```nu
mkdir ~/.cache/starship
starship init nu | save -f ~/.cache/starship/init.nu
```

`cofig.nu`:

```nu
source ~/.cache/starship/init.nu
```

## Wezterm

修改 Wezterm 配置文件，设置 Nushell 为默认 shell。

`~/.wezterm.lua`:

```lua
-- Using shell
config.set_environment_variables = {
    COMSPEC = 'C:\\Users\\lenovo\\AppData\\Local\\Programs\\nu\\bin\\nu.exe',
}
```

可能有每次按键换行的bug。可以查看官方的 [issue](https://github.com/nushell/nushell/issues/5585)。
解决办法：

找到 nushell 的配置文件目录，在 `config.nu` 文件中找到 `$env.config` 下的 `shell_integration`，把 `osc133` 的值改成 `false`，默认是`true`。

## vscode

首先添加 Nushell 的路径。

```json
"terminal.integrated.profiles.windows": {
    "Nushell": {
      "path": "C:\\Users\\lenovo\\AppData\\Local\\Programs\\nu\\bin\\nu.exe",
      "args": []
    }
}
```

然后，设置 Nushell 为默认 shell。
