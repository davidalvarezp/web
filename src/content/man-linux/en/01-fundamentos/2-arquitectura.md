---
title: "1.2 Kernel Architecture & Syscalls"
description: "Kernel architecture, filesystem hierarchy (FHS), shell, and essential documentation."
moduleNumber: "01"
moduleTitle: "Linux Fundamentals"
---

### 1.2 Kernel Architecture & Syscalls

The Linux Kernel executes in **Ring 0** (kernel space), whereas user applications run in **Ring 3** (user space). Any interaction with hardware (networking, storage, memory) must traverse through a system call (`syscall`).

```bash
# Trace system call execution metrics
strace -c ls -la
# Inspect loaded kernel modules
lsmod | head -n 10
```

#### Filesystem Hierarchy Standard (FHS)
* `/etc`: System-wide plain-text configuration files.
* `/var/log`: System and daemon logs.
* `/proc` and `/sys`: Virtual filesystems exposing live kernel state and hardware metrics.
