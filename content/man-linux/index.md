---
title: Manual SysAdmin Linux | dap.gal
description: Ruta completa de aprendizaje para administradores de sistemas Linux, de fundamentos a producción.
hide:
  - navigation
  - toc
---

# Manual del Administrador de Sistemas Linux

![Status](https://img.shields.io/badge/Estado-Actualizado-green?logo=github)
![Linux](https://img.shields.io/badge/S.O.-Linux-orange?logo=linux)
![Rol](https://img.shields.io/badge/Rol-SysAdmin-blue?logo=person)

Bienvenido al **Manual SysAdmin Linux**, un recurso técnico exhaustivo diseñado para transformar a entusiastas y técnicos en Administradores de Sistemas y profesionales de Infraestructura de nivel avanzado.

Esta documentación ha sido estructurada como un itinerario de aprendizaje progresivo, cubriendo desde los cimientos del kernel hasta la orquestación moderna de contenedores y la automatización de sistemas distribuidos.

---

## Objetivo

El propósito de este proyecto es proporcionar un marco de aprendizaje **pragmático y profesional**. No se limita a listar comandos; explica el *porqué* de cada configuración, siguiendo las mejores prácticas de la industria y estándares de seguridad corporativos.

Al finalizar, serás capaz de desplegar, asegurar y mantener infraestructuras Linux complejas, preparándote para roles como **Sysadmin Senior**, **DevOps Engineer** o **SRE (Site Reliability Engineer)**.

---

## Roadmap de Aprendizaje

El manual se divide en bloques modulares que cubren todas las facetas de la administración moderna:

| Módulo | Enfoque | Temas Clave |
| :--- | :--- | :--- |
| **01. Fundamentos** | Supervivencia | CLI, Arquitectura, FHS, Editores (Vim/Nano). |
| **02. Usuarios y Permisos** | Seguridad | Permisos octales, ACLs, Sudoers, Hardening de cuentas. |
| **03. Gestión de Software** | Paquetes | APT, DNF, Compilación, Repositorios corporativos. |
| **04. Almacenamiento** | Datos | LVM, Particionado, RAID, File Systems (EXT4, XFS, BTRFS). |
| **05. Gestión del Sistema** | Control | Systemd, Procesos, Cron, Tareas programadas. |
| **06. Redes (Networking)** | Comunicación | Stack TCP/IP, SSH Pro, Troubleshooting de red. |
| **07. Hardening y Seguridad** | Protección | Firewalls (NFTables/UFW), SELinux, Auditoría. |
| **08. Servicios de Servidor** | Producción | Nginx, Bases de Datos, Proxy Inverso, SSL. |
| **09. Automatización** | Eficiencia | Bash Scripting Avanzado, Introducción a Ansible (IaC). |
| **10. Virtualización** | Modernización | Docker, Podman, Containers, Introducción a K8s. |
| **11. Observabilidad** | Troubleshooting | Logs, Monitoreo (Prometheus/Grafana), Diagnóstico. |
| **11. Cloud** | Cloud computing | Conceptos, Infraestructura, Servicios. |

---

## Requisitos del Laboratorio
Para seguir esta guía, te recomendamos disponer de un entorno donde puedas experimentar sin miedo a romper el sistema:

- **Virtualización:** VirtualBox, VMware o Proxmox.
- **Contenedores:** LXC o Docker.
- **Entorno Local:** Una distribución base (se recomiendan **Debian** o **Ubuntu** por su estabilidad en servidores).

---

## Cómo leer este manual
Cada artículo está estructurado para maximizar el aprendizaje técnico:

- **Teoría Profunda:** Entender los conceptos antes de ejecutar.
- **Laboratorio Práctico:** Comandos reales con explicaciones línea por línea.
- **Errores Comunes:** Sección de troubleshooting para evitar fallos típicos en producción.
- **Tips de Senior:** Consejos de optimización y automatización.

---

!!! info "Créditos y Herramientas"
    Esta documentación ha sido redactada por [dap](https://dap.gal) con el apoyo de un LLM local entrenado específicamente para esta documentación, garantizando un flujo de trabajo privado, rápido y técnico.
