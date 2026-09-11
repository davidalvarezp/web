---
title: "2.1 User and Group Management"
description: "DAC model, special bits (SUID, SGID, Sticky Bit), sudoers, and POSIX access control lists."
moduleNumber: "02"
moduleTitle: "Users, Permissions & ACLs"
---

### 2.1 User and Group Management

Linux handles local authentication through `/etc/passwd`, `/etc/shadow`, and `/etc/group`.

```bash
# Create an unprivileged system daemon user without interactive shell
useradd -r -s /usr/sbin/nologin -d /var/lib/myapp -c "MyApp Service User" myapp
# Inspect UID, GID, and supplemental groups
id myapp
```
