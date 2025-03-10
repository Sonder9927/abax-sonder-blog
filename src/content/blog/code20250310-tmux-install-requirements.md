---
title: Tmux Install Requirements
date: "2025-03-10"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: custom
tags:
- linux
- lib
description: Installment for tmux.
---

# Intro

[Tmux](https://github.com/tmux/tmux) 安装要求。

# Install

## Requires

`autoconf`, `automake`, `pkg-config`, `libevent`, `yacc`, `curses`:

```sh
sudo apt-get install -y autoconf automake pkg-config
sudo apt-get install -y libevent-dev libncurses5-dev bison byacc
```

## From version control

```sh
git clone https://github.com/tmux/tmux.git
cd tmux
sh autogen.sh
./configure
make && sudo make install
```

## Plugins

Use [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm).

Key bindings:

1. `prefix` + `I`

    - Installs new plugins from GitHub or any other git repository
    - Refreshes TMUX environment

2. `prefix` + `U`

    - updates plugin(s)

3. `prefix` + `alt` + `u`

    - remove/uninstall plugins not on the plugin list
