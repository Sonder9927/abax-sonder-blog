---
title: Linux `ls -d *` bug in script.
date: "2024-04-08"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: bug
tags:
- bug
- script
- ls
description: `ls -d *` bug in script.
---

# 问题
在终端直接运行 `ls -d 20*` 时，终端会自动将结果格式化成多列显示，因此看起来有 236 个条目，但实际上输出中可能只有 8 行（或一行），而在脚本中使用反引号，输出不会保持原来的列格式，而是一个长字符串，然后再根据 IFS（默认按空白字符拆分）分割成若干“词”。如果文件夹名中没有空格，那么每一行通常会对应一个文件夹名；但如果 `ls` 的输出是按多列排列的，那么每一行包含多个名称，而又由于空格被作为分隔符，这就会导致结果不如预期（有可能合并成较少的“单词”）。

# 解决

**不要用 ls 做循环的基础，而是直接使用 shell 的通配符！**

```sh
for evt in 20*; do
    echo "$evt"
    # process evt ...
done
```