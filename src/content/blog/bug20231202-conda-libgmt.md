---
title: 使用conda安装pygmt时带来的libgmt坑
date: "2023-12-02"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: bug
tags:
- bug
- conda
- lib
- pygmt
- rye
description: Bug from conda installing pygmt.
---

# 描述
`gmt`是shell命令，`pygmt`是python的API。
我喜欢用`pygmt`，但身边大多数人用的`gmt`。
按照`pygmt`官网推荐的`conda`安装方式，`libgmt`是在虚拟环境目录下，所以不激活虚拟环境运行`gmt`会找不到正确版本的 GMT 共享库 (`libgmt`)。
如果安装了多个版本的 GMT，则可能会发生这种情况。

# 解决方案
## Linux
最简单的办法就是再安装`gmt`，在 arch 里用`pacman -Syu gmt`，会安装在系统路径（`/usr/lib` / `/lib`）里，应该不用再指定变量。如果需要指定环境变量：

```sh
export GMT_LIBRARY_PATH=/path/to/lib
```

这里的目录需要保证能找到`libgmt.so`，官方原文见<a href="https://www.pygmt.org/dev/install.html#finding-the-gmt-shared-library" target="_blank">finding-the-gmt-shared-library</a>

# python项目管理
既然激活conda就好了，那我在折腾什么？可以查阅<a href="/blog/code20231130-rye-project">rye 搭建 python 和 rust 混合项目</a>
我希望 `rye`、`poetry`、`pdm` 能运行，最好不安装`gmt`，利用conda虚拟环境安装的 `pygmt` 来实现：

假设虚拟环境`rose`安装了`pygmt`，那么在`/path/to/miniconda3/envs/rose/lib`里面是能找到`libgmt.so`等文件的。
1. 激活`rose`，然后运行`poetry`等命令。
2. 不激活`rose`，设置环境变量 

    ```sh
    set -x GMT_LIBRARY "/path/to/miniconda3/envs/rose/lib"
    ls $GMT_LIBRARY | grep gmt

    gmt
    libgmt.so -> libgmt.so.6.4.0
    libgmt.so.6 -> libgmt.so.6.4.0
    libgmt.so.6.4.0
    ```

我目前用的第二种方法。
## Windows
windows有个坑，修改了环境变量，但是出现权限问题。
