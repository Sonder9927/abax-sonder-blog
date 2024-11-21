---
title: 家目录用户权限
date: "2024-03-23"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: bug
tags:
- bug
- permission
description: Permission on home directory.
---

# Permission
如果遇到不能在家目录下自由操作文件的情况，要检查权限，不要轻易使用 `sudo`，尤其是安装软件的时候，避免安装到根目录下去。

# Check
检查家目录权限：运行以下命令来查看家目录的权限设置：
```sh
ls -ld ~
```

1. 确保您是家目录的所有者。如果不是，可以使用`chown`命令将其更改为自己。
2. 确保您是家目录的所有者。如果不是，可以使用`chown`命令将其更改为自己。

```sh
sudo chown -R your_username:your_username ~
sudo chgrp -R your_groupname ~
```
