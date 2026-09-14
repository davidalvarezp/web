---
title: "Introducción a LXC y LXD"
slug: "lxc-lxd-inicial"
date: 2025-12-02
lastmod: 2025-12-09
draft: false
author: "dap"
authorLink: "https://davidalvarezp.com"
description: "Guía inicial sobre LXC y LXD: arquitectura, instalación, hardening, clustering, networking, snapshots, troubleshooting y buenas prácticas para entornos de producción."
images: [lxc-lxd-inicial.webp]
resources:
- name: "lxc-lxd-inicial"
  src: "lxc-lxd-inicial.webp"

tags: [
  "Linux",
  "Contenedores",
  "LXC",
  "LXD",
  "Virtualización",
  "Kernel",
  "Cgroups",
  "Namespaces",
  "Hardening",
  "Seguridad",
  "SysAdmin",
  "DevOps",
  "Plataforma",
  "Producción",
  "Clustering",
  "ZFS",
  "Ciberseguridad",
  "Infraestructura",
  "Automatización"
]
categories: [
  "SysAdmin",
  "DevOps"
]

lightgallery: true

---

# Guía Inicial de LXC y LXD: Introducción a Contenedores Linux

## Índice

1. [Introducción: ¿Qué son los contenedores?](#1-introducción-qué-son-los-contenedores)
2. [¿Qué es LXC?](#2-qué-es-lxc)
3. [¿Qué es LXD?](#3-qué-es-lxd)
4. [Diferencias entre contenedores y máquinas virtuales](#4-diferencias-entre-contenedores-y-máquinas-virtuales)
5. [Ventajas de usar LXC/LXD](#5-ventajas-de-usar-lxclxd)
6. [Arquitectura interna de LXC/LXD](#6-arquitectura-interna-de-lxclxd)
7. [Instalación y configuración inicial](#7-instalación-y-configuración-inicial)
8. [Primeros pasos con contenedores](#8-primeros-pasos-con-contenedores)
9. [Redes y almacenamiento básicos](#9-redes-y-almacenamiento-básicos)
10. [Hardening y seguridad inicial](#10-hardening-y-seguridad-inicial)
11. [Snapshots, clones y backups](#11-snapshots-clones-y-backups)
12. [Automatización y DevOps con LXD](#12-automatización-y-devops-con-lxd)
13. [Casos de uso y ejemplos reales](#13-casos-de-uso-y-ejemplos-reales)
14. [Buenas prácticas generales](#14-buenas-prácticas-generales)
15. [Conclusión](#15-conclusión)
16. [Guía avanzada](#16-guia-avanzada)

---

## 1. Introducción: ¿Qué son los contenedores?

Un **contenedor** es un entorno aislado que permite ejecutar aplicaciones o sistemas Linux de manera independiente sobre un mismo kernel.

Piensa en un contenedor como un **“mini-sistema operativo”** que comparte recursos con el host pero que está aislado:

* No puede interferir con otros contenedores.
* Tiene su propio sistema de archivos, red y usuarios.
* Es mucho más ligero que una máquina virtual tradicional.

Los contenedores se han vuelto esenciales en **DevOps, microservicios, laboratorios de seguridad y entornos multi-tenant**.

---

## 2. ¿Qué es LXC?

**LXC (Linux Containers)** es la tecnología que permite crear contenedores en Linux.

Se basa en tres pilares del kernel Linux:

1. **Namespaces**: aíslan procesos, red, sistema de archivos y usuarios.
2. **Cgroups (Control Groups)**: limitan recursos como CPU, memoria y disco.
3. **Seguridad MAC** (AppArmor, SELinux): añade una capa de protección extra.

Con LXC puedes ejecutar sistemas Linux completos sin necesidad de instalar un kernel nuevo ni arrancar una VM.

---

## 3. ¿Qué es LXD?

**LXD** es un sistema de gestión avanzado sobre LXC.

Incluye:

* **Daemon**: corre en segundo plano y gestiona contenedores y VMs.
* **CLI y API REST**: para administración y automatización.
* **Snapshots y clones**: crea copias rápidas de contenedores.
* **Redes y storage pools**: gestión sencilla de recursos.
* **Perfiles y seguridad**: control granular de permisos y recursos.

LXD convierte LXC en una **plataforma completa de virtualización ligera**, ideal para producción y laboratorios.

---

## 4. Diferencias entre contenedores y máquinas virtuales

| Característica | Contenedor (LXC/LXD)         | Máquina Virtual (VM)                    |
| -------------- | ---------------------------- | --------------------------------------- |
| Kernel         | Comparte el kernel host      | Cada VM tiene su propio kernel          |
| Arranque       | Instantáneo                  | Más lento                               |
| Recursos       | Ligero                       | Mayor consumo de CPU/memoria            |
| Aislamiento    | Software                     | Hardware                                |
| Uso típico     | Microservicios, labs, DevOps | Aplicaciones completas, software legacy |

---

## 5. Ventajas de usar LXC/LXD

* Ligero y rápido
* Fácil de crear, clonar y eliminar contenedores
* Flexibilidad en redes y almacenamiento
* Perfecto para DevOps y CI/CD
* Buen nivel de seguridad si se usan contenedores **unprivileged**
* Soporte para clusters y migraciones en producción

---

## 6. Arquitectura interna de LXC/LXD

### 6.1 Namespaces

Cada contenedor tiene su propio espacio aislado para:

* **PID**: procesos
* **NET**: red
* **MOUNT**: sistema de archivos
* **USER**: usuarios y grupos
* **IPC**: comunicación entre procesos

### 6.2 Cgroups

Controlan:

* CPU
* Memoria
* IO
* PIDs

### 6.3 Seguridad MAC

* AppArmor (Ubuntu)
* SELinux (Fedora/RHEL)
* Landlock (experimental)

### 6.4 User Namespaces

El root dentro del contenedor no es root real en el host. Esto evita privilegios excesivos.

---

## 7. Instalación y configuración inicial

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install lxd
sudo lxd init
```

Opciones recomendadas:

* Storage pool: ZFS
* Network: lxdbr0
* IPv4 NAT: sí
* IPv6: opcional
* Clustering: solo si hay varios nodos

### Arch Linux

```bash
sudo pacman -S lxc lxd
sudo lxd init
```

---

## 8. Primeros pasos con contenedores

### Crear contenedor

```bash
lxc launch images:ubuntu/22.04 mi-contenedor
```

### Acceder

```bash
lxc exec mi-contenedor -- /bin/bash
```

### Apagar y reiniciar

```bash
lxc stop mi-contenedor
lxc start mi-contenedor
```

### Comandos útiles

| Comando               | Función               |
| --------------------- | --------------------- |
| `lxc list`            | Lista contenedores    |
| `lxc info <nombre>`   | Información detallada |
| `lxc delete <nombre>` | Elimina contenedor    |

---

## 9. Redes y almacenamiento básicos

### Redes

* Bridge por defecto: `lxdbr0`
* IP estática:

```bash
lxc config device set mi-contenedor eth0 ipv4.address=10.0.3.50
```

* Macvlan: inserta contenedor en la LAN

### Almacenamiento

* Pool ZFS recomendado para producción:

```bash
lxc storage create zfspool zfs source=/dev/sdb
```

* Pool `dir`: solo para pruebas.

---

## 10. Hardening y seguridad inicial

* Contenedores **unprivileged**:

```bash
lxc config set mi-contenedor security.privileged=false
```

* Limitar recursos:

```bash
lxc config set mi-contenedor limits.cpu=2
lxc config set mi-contenedor limits.memory=2GiB
```

* Evitar nesting innecesario:

```bash
lxc config set mi-contenedor security.nesting=false
```

* Snapshots antes de cambios importantes.

---

## 11. Snapshots, clones y backups

* Crear snapshot:

```bash
lxc snapshot mi-contenedor pre-update
```

* Clonar contenedor:

```bash
lxc copy mi-contenedor mi-contenedor-test
```

* Exportar backup:

```bash
lxc export mi-contenedor mi-contenedor.tar.gz
```

---

## 12. Automatización y DevOps con LXD

* **Terraform**: crear contenedores como código
* **Ansible**: gestionar despliegues automáticamente
* **Packer**: crear imágenes endurecidas para producción

---

## 13. Casos de uso y ejemplos reales

* Laboratorios de ciberseguridad: pentesting, honeycontainers
* Desarrollo y pruebas de aplicaciones
* Infraestructura multi-tenant en la nube
* Plataformas DevOps: CI/CD, integración de microservicios
* Migración de workloads de VM a contenedores ligeros

---

## 14. Buenas prácticas generales

* Contenedores **unprivileged**
* Host y LXD actualizados
* Versionar perfiles y configuraciones
* Snapshots frecuentes
* Limpiar imágenes y contenedores viejos
* Monitoreo continuo: Prometheus/Grafana
* Seguridad en redes: ACLs y firewall

---

## 15. Conclusión

LXC y LXD permiten construir **una plataforma de virtualización ligera, flexible y segura**.
Con esta guía completa puedes:

* Entender la arquitectura interna de contenedores
* Instalar y configurar LXD
* Crear y administrar contenedores y VMs
* Aplicar seguridad inicial y buenas prácticas
* Integrar LXD con DevOps y laboratorios de seguridad

> LXD es una herramienta **madura, estable y lista para producción**, ideal tanto para aprendizaje como para entornos profesionales.

## 16. Guia avanzada

Guía técnica  avanzada de LXC: [davidalvarezp.com/blog/lxc-lxd-avanzado](https://davidalvarezp.com/blog/lxc-lxd-avanzado/)
