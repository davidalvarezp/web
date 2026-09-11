---
title: "4.1 LVM: Dynamic Logical Volumes"
description: "GPT partitioning, Logical Volume Manager (LVM), ext4, XFS, Btrfs, and ZFS filesystems."
moduleNumber: "04"
moduleTitle: "Storage, LVM & Filesystems"
---

### 4.1 LVM: Dynamic Logical Volumes

LVM enables online filesystem expansion with zero service interruption.

```bash
# Expand logical volume and grow underlying ext4 filesystem online
lvextend -L +20G /dev/vg_system/lv_data -r
# Inspect available allocation space in Volume Group
vgs
```
