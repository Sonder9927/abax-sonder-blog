---
title: '沙箱写文件后 permission denied：Windows ACL 与完整性级别排查'
date: "2026-09-28"
author: Sonder
authorGithub: sonder9927
authorImage: /images/uploads/zard-think.jpg
category: bug
tags:
- bug
- windows
- acl
- sandbox
- permission
description: 沙箱写入改写文件安全属性，导致普通进程 permission denied 的排查与修复。
---

# 现象

事情的顺序是这样的：

1. agent 在项目里改了几个文件（一个 notebook、`.gitignore`），并为一次验证在项目内创建了一个子目录。
2. 之后我在终端跑 `uv run marimo edit ...`，执行原本正常的代码时收到 `permission denied`。
3. 反直觉的是：单独写一个最小脚本、做同样的操作，运行完全正常。

同一份代码、同一个解释器，**脚本成功、notebook 失败**——差别不在代码，而在文件本身的安全属性。顺着这个方向去查，问题就清楚了。

# 对照实验

排查期间还遇到过一个更吓人的现象：在受限沙箱里启动任何子进程，都会返回 `0xC0000142`。

| 子进程 | 沙箱内（受限） | 完整权限 |
| --- | --- | --- |
| `cmd.exe /c echo` | `0xC0000142` | OK |
| `where.exe` | `0xC0000142` | OK |
| `.venv\Scripts\python.exe` | `0xC0000142` | OK |

`0xC0000142` 即 `STATUS_DLL_INIT_FAILED`。**不是 Python 的问题，而是所有子进程都起不来**，这是写受限令牌 + Low 完整性常见的副作用：令牌的受限 SID 列表不完整时，子进程会在早期 DLL 初始化阶段直接挂掉。

这一步给出的方法论是：**同一个命令，在受限环境与完整权限下各跑一遍**。能立刻排除解释器、依赖、环境变量的嫌疑，把范围缩小到环境与权限。

# 定位

Windows 上两个命令就够：

```powershell
icacls .\notebooks\some_file.py
(Get-Acl .\notebooks\some_file.py).Sddl
```

被污染的文件和目录长这样：

```text
E:\...\vs\notebooks\some_file.py
  S-1-4-248325-214519557:(I)(W,D,DC)
  DESKTOP-...\me:(I)(F)
  Mandatory Label\Low Mandatory Level:(I)(NW)

E:\...\vs\.gmt
  Everyone:(I)(CI)(DENY)(DELETE)
  S-1-4-248325-214519557:(I)(OI)(CI)(W,D,DC)
  Mandatory Label\Low Mandatory Level:(I)(OI)(CI)(NW)
```

再用规范化 SDDL 确认一次：

```text
D:AI(D;CI;DT;;;WD)(A;OICI;0x110156;;;S-1-4-248325-214519557)...
```

逐条解读：

- `Mandatory Label\Low Mandatory Level:(NW)`：对象被标记为 **Low 完整性**，`NW` = No-Write-Up。这是创建它的那个 Low 完整性进程遗传下来的。
- `S-1-4-248325-214519557`：沙箱注入的**能力 SID**，带着写和删权限（`0x110156` 约等于 Write + Delete）。
- `(D;CI;DT;;;WD)`：对 `Everyone` 的 **DENY DELETE**，容器继承，会一路传到子目录。

# 原因

- **DENY 优先于 ALLOW**。即使你的账户对目录有完全控制，只要有一条 `Everyone:(DENY)(DELETE)`，删除、替换（很多编辑器和工具用写临时文件再 rename 的方式保存）就会被拒绝。
- **继承范围大**。`CI`（container inherit）让这条 DENY 从工作区根一路继承到所有子目录。
- **Low 完整性标签**会让创建、替换、删除这类操作在不同完整性级别之间出现意料之外的拒绝。
- **能力 SID 的 ALLOW ACE 本身无害**（只有沙箱令牌携带该 SID），真正伤人的是那条 DENY 和 Low 标签。

在本例里，触发报错的只是一个需要在项目目录下创建会话子目录的库；报错的根因和那个库无关，它只是恰好第一个撞上了被改过的 ACL。

# 修复

```powershell
# 1) 被污染的目录：先去 DENY，再改完整性，最后删除
icacls .\.gmt /remove:d Everyone /T /C
icacls .\.gmt /setintegritylevel (OI)(CI)Medium /T /C
Remove-Item .\.gmt -Recurse -Force

# 2) 整个工作区：清掉沙箱留下的 DENY，并恢复 Medium
icacls . /remove:d Everyone /T /C
icacls . /setintegritylevel (OI)(CI)Medium /T /C

# 3) 复查
icacls .\notebooks\some_file.py
```

要点：

- `Everyone:(DENY)(...)` 用 `/remove:d Everyone` 删除；
- `Mandatory Label\Low` 用 `/setintegritylevel ... Medium` 恢复；
- 能力 SID 的 ALLOW ACE 可以保留，删除它反而可能影响沙箱自身的写权限；
- 先处理 ACL 再删除被污染的目录，否则 `Remove-Item` 本身就会被那条 DENY 挡住；
- `/T` 会递归整个目录树，在仓库根上执行前先确认范围，节点多时会比较慢。

# 预防

- **让 agent 在完整权限下改工作区文件**。受限沙箱适合跑只读命令；一旦它要写你的仓库，就可能顺带改掉文件的安全属性。
- 如果必须用沙箱，让沙箱只写临时目录，不要写仓库。
- agent 跑完之后，用 `icacls` 抽查关键文件，成本很低。
- 记住两条能省很多时间的规律：**DENY 优先**，以及**受限令牌会让子进程 `0xC0000142`**。

# 清单

- `permission denied` 先分成两类：程序自己抛的，还是操作系统 ACL 拒绝的。
- Windows 上查文件权限，两把刀就够：`icacls <path>` 看强制完整性标签和 DENY；`(Get-Acl <path>).Sddl` 看规范化 DACL。
- 看到 `Mandatory Label\Low` 或陌生的 `S-1-4-...` SID，基本可以断定是某个沙箱写下的痕迹。
- 判断是不是环境问题，用同一命令在受限与完整权限下对照，比逐个猜依赖快得多。
- 任何会写文件的自动化（包括 AI agent）跑完后，都值得做一次权限抽查。
