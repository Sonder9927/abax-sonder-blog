---
title: nodejs (npm) manage
date: "2025-11-16"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: code
tags:
- nodejs
description: Use nvm/nrm to manage nodejs and npm.
---

# Nodejs

[Node.js®](https://nodejs.org/) is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.

# nvm manage version

[nvm](https://github.com/nvm-sh/nvm) is a node version manager.

## Install

Install nvm:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Windows: see [NVM for Windows](https://github.com/coreybutler/nvm-windows)

## Usage

```sh
nvm install node
node -v
npm -v

nvm ls
```

# nrm mnage registry

[nrm](https://github.com/Pana/nrm) can help you switch different npm registries easily and quickly.

## Install

```sh
# npm
npm install -g nrm

# yarn 
yarn global add nrm

# pnpm
pnpm add -g nrm
```

## Usage

```sh
nrm ls
nrm use <registry>
nrm add <registry> <url>
nrm remove <registry>
```
