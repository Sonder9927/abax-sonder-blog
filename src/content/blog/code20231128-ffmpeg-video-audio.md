---
title: 使用 ffmpeg 处理视频音频合并
date: "2023-11-28"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: code
tags:
- ffmpeg
description: Use `ffmpeg` to merge video and audio.
---

# ffmpeg
[FFMPEG](https://ffmpeg.org/) 堪称自由软件中最完备的一套多媒体支持库，它几乎实现了所有当下常见的数据封装格式、多媒体传输协议以及音视频编解码器。


# 代码

将音频`audio.mp4`和视频`video.mp4`文件合并。
```sh
ffmpeg -i audio.mp4 -i video.mp4 -acodec copy -vcodec copy output.mp4
```
