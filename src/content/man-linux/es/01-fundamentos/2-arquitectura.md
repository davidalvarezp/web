---
title: "1.2 Arquitectura del Kernel & Syscalls"
description: "Arquitectura del kernel, estructura del filesystem (FHS), shell y documentación esencial."
moduleNumber: "01"
moduleTitle: "Fundamentos de Linux"
---

### 1.2 Arquitectura del Kernel & Syscalls

El Kernel de Linux opera en **Ring 0** (espacio de kernel), mientras que las aplicaciones de usuario se ejecutan en **Ring 3** (espacio de usuario). Cualquier interacción con el hardware (red, disco, memoria) debe canalizarse mediante una llamada al sistema (`syscall`).

```bash
# Rastrear llamadas al sistema de un comando
strace -c ls -la
# Inspeccionar módulos del kernel cargados
lsmod | head -n 10
```

#### Jerarquía del Filesystem Estándar (FHS)
* `/etc`: Configuraciones del sistema en texto plano.
* `/var/log`: Logs del sistema y servicios.
* `/proc` y `/sys`: Pseudofilesystems que exponen el estado del kernel y hardware en tiempo real.
