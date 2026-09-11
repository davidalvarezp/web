---
title: "1.3 Dominio de la Terminal & Pipes"
description: "Arquitectura del kernel, estructura del filesystem (FHS), shell y documentación esencial."
moduleNumber: "01"
moduleTitle: "Fundamentos de Linux"
---

### 1.3 Dominio de la Terminal & Pipes

La filosofía UNIX dicta: *programas pequeños que hacen una sola cosa bien, y se conectan mediante texto plano*.

```bash
# Extraer las 10 IPs con más conexiones concurrentes
ss -tun | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -n 10
```
