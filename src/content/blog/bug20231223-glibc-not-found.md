---
title: /lib/x86_64-linux-gnu/libc.so.6:version `GLIBC_2.32' not found
date: "2023-12-23"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: bug
tags:
- bug
- lib
description: libc.so.6:version `GLIBC_2.32' not found.
---

# Problem
ubuntu 系统的最高版本没到要求，得手动更新源。
1. 检查版本
    ```sh
    strings /lib/x86_64-linux-gnu/libc.so.6 | grep GLIBC_
    ```

# Solve
添加一个高级版本系统的源，直接升级libc6

1. 打开源文件：`sudo nano /etc/apt/sources.list`
2. 添加内容：
    ```list
    deb http://th.archive.ubuntu.com/ubuntu jammy main
    ```
3. 升级
    ```sh
    sudo apt-get update
    sudo apt-get install libc6
    ```
