---
title: Linux 好用命令行工具 - zshell 版
date: "2024-03-30"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: custom
tags:
- shell
- linux
- config
description: Apps for linux commandline.
---

# 简介
Linux 新装系统配置，常用命令行工具安装记录。
关于zshell的配置详见，[zsh 配置](https://www.jianshu.com/p/a179930202a8)。

# 软件
## rust
用 `rustup` 安装 [rust](https://www.rust-lang.org/):
```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

如果需要添加 `PATH`:

```sh
export PATH="$HOME/.cargo/bin:$PATH"
```

用 `cargo` 安装 `rust` 软件：
```sh
cargo install eza
cargo install --locked bat
cargo install fd-find
cargo install git-delta
cargo install procs
cargo install sd
cargo install ripgrep
cargo install du-dust
cargo install starship --locked
cargo install tealdeer
cargo install choose
cargo install --locked --git https://github.com/sxyazi/yazi.git
cargo install tokei
cargo install --locked difftastic
cargo install jnv

cargo install zoxide --locked 
# Add `eval "$(zoxide init zsh)"` to the end of zshell config file (usually ~/.zshrc)
```

## golang
下载 [go 安装包](https://go.dev/doc/install) 安装 [go](https://go.dev/):
```sh
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
go version
```

go 安装软件:

```sh
env CGO_ENABLED=0 go install -ldflags="-s -w" github.com/gokcehan/lf@latest
go install github.com/charmbracelet/freeze@latest
```

## python
使用 `miniconda` 和 `rye` 管理。
- [miniconda](https://docs.anaconda.com/free/miniconda/): 官网下载脚本安装。
- [rye](https://rye-up.com/): 管理方法详见 [rye搭建python和rust混合项目](/blog/code20231130-rye-project)。

## npm
用 [nvm](https://github.com/nvm-sh/nvm) 管理 [npm](https://www.npmjs.com/) 版本。
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# restart shell
nvm install node # "node" is an alias for the latest version

# check version
node -v
npm -v
```
`npm` 安装软件:
- projj 管理 git 仓库，参考[Manage git repository 仓库管理](/blog/code20240127-manage-repos)
- nrm 管理源

```sh
npm i -g projj nrm
```

## lua
下载 [lua 源码](https://www.lua.org/download.html) 安装 [lua](https://www.lua.org/)

```sh
curl -L -R -O https://www.lua.org/ftp/lua-5.4.7.tar.gz
tar zxf lua-5.4.7.tar.gz
cd lua-5.4.
make all test
make all install
```
