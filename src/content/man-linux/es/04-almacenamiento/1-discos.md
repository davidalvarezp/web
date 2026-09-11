---
title: "4.1 LVM: Volúmenes Lógicos Dinámicos"
description: "Particionado GPT, Logical Volume Manager (LVM), sistemas de archivos ext4, XFS, Btrfs y ZFS."
moduleNumber: "04"
moduleTitle: "Almacenamiento, LVM & Filesystems"
---

### 4.1 LVM: Volúmenes Lógicos Dinámicos

LVM permite expandir sistemas de archivos en caliente sin downtime.

```bash
# Redimensionar un volumen lógico y su filesystem ext4 online
lvextend -L +20G /dev/vg_system/lv_data -r
# Verificar espacio restante en el Volume Group
vgs
```
