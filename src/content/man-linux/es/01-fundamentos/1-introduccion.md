---
title: "1.1 Introducción al Ecosistema Linux"
description: "Arquitectura del kernel, estructura del filesystem (FHS), shell y documentación esencial."
moduleNumber: "01"
moduleTitle: "Fundamentos de Linux"
---

### 1.1 Introducción al Ecosistema Linux

Linux no es solo un sistema operativo; es la columna vertebral de la infraestructura tecnológica moderna. Desde superordenadores y servidores en la nube hasta dispositivos embebidos y smartphones, Linux domina el entorno profesional. Para un administrador de sistemas (SysAdmin), comprender su ecosistema no es opcional, es la base de su carrera.

```bash
# Comprobación de versión del kernel y release
uname -mrs
cat /etc/os-release
uptime -p
```

#### Componentes Esenciales del Sistema

* **Kernel (Núcleo)**: Gestiona el hardware, memoria, CPUs e interfaces de entrada/salida.
* **Init System (Systemd)**: Primer proceso del espacio de usuario (PID 1) encargado de iniciar todos los servicios del sistema.
* **GNU Userland**: Herramientas básicas de línea de comandos (`coreutils`, `bash`, `grep`, `awk`).
* **Shell**: Interfaz intérprete de comandos entre el usuario/scripts y las llamadas al sistema (*syscalls*).

> **Aviso de Rendimiento**:
> En entornos de producción modernos, la configuración por defecto de los parámetros del kernel (`sysctl`) suele estar orientada a propósito general. Aprenderemos a ajustarla para baja latencia y alta concurrencia en el Módulo 05.
