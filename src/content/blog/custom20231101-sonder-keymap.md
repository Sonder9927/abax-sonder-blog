---
title: 'Keymap: ctrl, move, switch input method'
date: "2023-11-01"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: custom
tags:
- config
- keyboard
description: 'Keymap: caps绑定ctrl、tab配合移动、esc自动切换输入法中英文'
---

# 痛点

经常使用 vim，喜欢用`hjkl`进行移动操作。`ctrl` 不容易按到，所以绑定到不常使用的大小写锁定键。

在使用笔记和编程软件如 [obsidian](https://obsidian.md/) 和 [vscode](https://code.visualstudio.com/)时配置了vim的插件。如果在按下`Esc`退出插入模式返回normal时能自动切换英文输入就不必每次按一下`shift`了。

# 设置

## 方法

1. 重新映射
`<caps>` $rightarrow$ Ctrl
  `<shift caps>` $\rightarrow$ CapsLock
2. 像vim一样移动
  `<Tab>` $\rightarrow$ Tab
  `<Tab h>` $\rightarrow$ 左
  `<Tab j>` $\rightarrow$ 下
  `<Tab k>` $\rightarrow$ 上
  `<Tab l>` $\rightarrow$ 右
3. 按下`Esc`的同时切换到英文输入，这里使用的搜狗输入法。
    借用了 [vscode 下 vim 配置及输入法自动切换](https://blog.csdn.net/pdx_ll/article/details/124095712)。
  需要对搜狗输入法进行设置：
    1. `设置-常用-默认状态-中文/英文`，勾选为英文。（貌似不做这一步也行）
    2. `<ctrl G>-搜狗输入法快捷键`，设一个不易冲突的快捷键。
原文使用的`F8`，但是`<ctrl F8>`在 pycharm里面是断点开关的快捷键。
我在多次尝试后选择了`<ctrl )>`(`<ctrl shift 0>`)。

---
后续
obsidian 和 vscode又出bug了，pycharm目前用的少，改回F8了。
pycharm好像有插件能设置normal模式保持英文输入法。

---

## Windows

使用了[autohotkey](https://www.autohotkey.com/)，脚本：

```autohotkey
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

Shift & CapsLock:: CapsLock
CapsLock:: Ctrl

Tab & h:: Left
Tab & j:: Down
Tab & k:: Up
Tab & l:: Right
Tab:: Tab

~Esc::
 Send, ^{)} ; 搜狗输入法启动快捷键
 Send, {Shift} ; 中英文切换
return
```

有需要的话可以使用`if`语句选择在特定的软件中按键生效。

##### 设为开机启动

`<win r>` 打开运行窗口，在输入框输入 `shell:startup` 回车打开启动目录，将快捷方式放入即可。

## Linux

联合 `xmodmap` 和 `xcape` 实现。

```bash
#! /bin/bash

# make caps => ctrl
# and <shift-caps> => caps
xmodmap -e "clear lock"
xmodmap -e "clear control"
xmodmap -e "add control = Caps_Lock Control_L Control_R"
xmodmap -e "keycode 66 = Control_L Caps_Lock NoSymbol NoSymbol"

# make <tab-h/j/k/l> => left/down/up/right
# need xcape downloaded from github
spare_modifier="Mode_switch"  # no space around = in the bash script

xmodmap -e "keycode 23 = $spare_modifier"
xmodmap -e "keycode 43 = h H Left Left"
xmodmap -e "keycode 44 = j J Down Down"
xmodmap -e "keycode 45 = k K Up Up"
xmodmap -e "keycode 46 = l L Right Right"

# set a keysym for xcape
xmodmap -e "keycode any = Tab"
# run xcape
./path/to/xcape -e "$spare_modifier=Tab"  # notice that there is no space around =
```

**注意** `xcape` 的存储路径。
同样可以在开机启动时自动加载这个脚本。
