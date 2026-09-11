---
title: "2.1 Gestión de Usuarios y Grupos"
description: "Modelo DAC, bits especiales (SUID, SGID, Sticky Bit), sudoers y listas de control de acceso POSIX."
moduleNumber: "02"
moduleTitle: "Usuarios, Permisos & ACLs"
---

### 2.1 Gestión de Usuarios y Grupos

Linux gestiona la autenticación mediante `/etc/passwd`, `/etc/shadow` y `/etc/group`.

```bash
# Crear usuario sin shell para un servicio
useradd -r -s /usr/sbin/nologin -d /var/lib/myapp -c "MyApp Service User" myapp
# Verificar UID, GID y pertenencia a grupos
id myapp
```
