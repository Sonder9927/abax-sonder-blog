---
title: docker 安装后无法启动服务
date: "2023-12-20"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: bug
tags:
- bug
- docker
description: Can't start docker server.
---

# docker
docker 安装成功后，可能无法启动服务，推荐下面几个 debug 的指令，找到错误后针对性地上网找解决方法。

```sh
# `sudo` maybe needed
dockerd --debug
systemctl status docker
systemctl restart docker
journalctl -xe | grep docker
vi /etc/docker/daemon.json
systemctl daemon-reload
freee -h
df -h
```
确保 docker 是 `active(running)` 的。

<img src="/images/post-images/docker-status.png" alt="docker-status" width="72%" />

部署时最好不要在挂载盘上启动 docker-compose，我当时报了`Error executing action 'run' on resource 'ruby_block[directory resource: /data/GitLab]'`这种错，换到系统盘启动 docker-compose.yml 就没事了。数据文件可以放在挂载盘。

# compose

docker 已经有 compose 子命令。不需要再安装`docker-compose`。

写好`compose.yaml`文件后执行`docker compose up -d`，中间没有 `-`。
