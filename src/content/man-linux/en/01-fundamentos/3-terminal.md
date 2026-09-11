---
title: "1.3 Terminal Mastery & Pipes"
description: "Kernel architecture, filesystem hierarchy (FHS), shell, and essential documentation."
moduleNumber: "01"
moduleTitle: "Linux Fundamentals"
---

### 1.3 Terminal Mastery & Pipes

The UNIX philosophy states: *write programs that do one thing and do it well, communicating over plain text pipes*.

```bash
# Extract top 10 IPs with highest concurrent connections
ss -tun | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -n 10
```
