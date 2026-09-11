---
title: "3.1 Package Managers in Debian & RHEL"
description: "APT, DNF/RPM, custom repositories, GPG verification, and building software from source."
moduleNumber: "03"
moduleTitle: "Package Management & Compilation"
---

### 3.1 Package Managers in Debian & RHEL

Dependency governance and deterministic updates across enterprise operating systems.

```bash
# On Debian/Ubuntu: check package origin and pinning priority
apt-cache policy openssh-server
# On RHEL/AlmaLinux: inspect transaction history with rollback capability
dnf history list
```
