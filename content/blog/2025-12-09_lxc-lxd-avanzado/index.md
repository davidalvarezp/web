---
title: "Guía Avanzada de LXC y LXD"
slug: "lxc-lxd-avanzado"
date: 2025-12-09
lastmod: 2025-12-09
draft: true
author: "davidalvarezp"
authorLink: "https://davidalvarezp.com"
description: "Guía técnica avanzada para SysAdmins y DevOps sobre LXC y LXD: arquitectura, hardening multinivel, clustering, troubleshooting y mejores prácticas de producción."
images: [lxc-lxd-avanzado.webp]
resources:
- name: "lxc-lxd-avanzado"
  src: "lxc-lxd-avanzado.webp"

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

# Guía Avanzada de LXC y LXD

LXC y LXD se han consolidado como dos de las tecnologías más potentes para virtualización ligera en Linux. Frente a Docker o Kubernetes —orientados a contenedores de aplicación— LXC/LXD ofrece **contenedores de sistema completos**, capaces de ejecutar distribuciones enteras con overhead mínimo, tiempos de arranque instantáneos y un nivel de aislamiento que, configurado correctamente, resulta ideal para despliegues persistentes, infraestructura multi-tenant, entornos DevOps y escenarios de ciberseguridad.

Esta guía está pensada para administradores de sistemas y DevOps que necesiten entender LXC/LXD a un nivel **intermedio → avanzado**: arquitectura, seguridad, hardening profundo, redes avanzadas, almacenamiento, clustering, automatización, perfiles, integración CI/CD, troubleshooting y mejores prácticas reales.

---

# Indice

1. [Introducción a LXC y LXD](#1-introducción-a-lxc-y-lxd)
2. [Estado actual del proyecto (2025)](#2-estado-actual-del-proyecto-2025)
3. [Instalación y Configuración Inicial](#3-installación-y-configuración-inicial)
4. [Arquitectura interna: cómo funciona realmente LXC/LXD](#4-arquitectura-interna-cómo-funciona-realmente-lxclxd)
5. [Hardening Avanzado de LXC/LXD](#5-hardening-avanzado-de-lxclxd)
6. [Redes Avanzadas en LXD (Networking)](#6-redes-avanzadas-en-lxd-networking)
7. [Almacenamiento Avanzado (Storage Pools)](#7-almacenamiento-avanzado-storage-pools)
8. [Perfiles Avanzados (Profiles)](#8-perfiles-avanzados-profiles)
9. [Snapshots, Clones, Backups y Migración](#9-snapshots-clones-backups-y-migración)
10. [Clustering y Alta Disponibilidad](#10-clustering-y-alta-disponibilidad)
11. [Virtual Machines en LXD](#11-virtual-machines-en-lxd)
12. [Integración con DevOps y CI/CD](#12-integración-con-devops-y-cicd)
13. [LXD para Ciberseguridad](#13-lxd-para-ciberseguridad)
14. [Troubleshooting Avanzado](#14-troubleshooting-avanzado)
15. [Buenas Prácticas Finales](#15-buenas-prácticas-finales)
16. [Conclusiones](#16-conclusiones)

---

# 1. Introducción a LXC y LXD

## 1.1 ¿Qué es LXC?
LXC (Linux Containers) es una tecnología de virtualización ligera basada en **namespaces**, **cgroups**, **chroot**, **capabilities** y **seguridad MAC**, que permite crear contenedores de sistema completos que comparten el kernel del host, pero con aislamiento fuerte a nivel de:

- procesos  
- red  
- montaje  
- usuarios  
- IPC  
- PID  
- cgroups  

Es la forma más cercana que existe a tener una VM sin la sobrecarga de un hypervisor.

## 1.2 ¿Qué es LXD?
LXD es un **daemon + API REST + CLI** que actúa como “manager” avanzado sobre LXC. Añade:

- Imágenes eficientes  
- Redes virtuales  
- Storage Pools  
- Snapshots/clones  
- Migración  
- Perfiles  
- Clustering  
- Virtual Machines (opcional)  
- Control granular de seguridad  
- Integración en automatización  

LXD convierte LXC en una plataforma de infraestructura moderna.

---

# 2. Estado actual del proyecto (2025)

Desde 2023, **Canonical entregó el proyecto LXD a Linux Containers**, la misma organización detrás de LXC. Actualmente:

- LXD sigue extremadamente activo y maduro  
- Las versiones vía Snap son las recomendadas en Ubuntu  
- En Debian, Arch, Fedora… puede instalarse desde repositorios de la comunidad  
- LXD mantiene soporte para contenedores **y para VMs ligeras**  

Si vas a usarlo en producción, asegúrate de usar una versión **soportada** y con parches recientes.

---

# 3. Installación y Configuración Inicial

## 3.1 Instalación estándar
Ubuntu / Debian:

```bash
sudo apt update
sudo apt install lxd
````

Arch Linux:

```bash
sudo pacman -S lxc lxd
```

## 3.2 Inicialización

Ejecuta:

```bash
sudo lxd init
```

Opciones recomendadas:

* Storage Pool: **ZFS** o **btrfs**
* Network: bridge administrado por LXD (`lxdbr0`)
* IPv4 NAT: sí
* IPv6: opcional
* Clustering: solo si tienes varios nodos

---

# 4. Arquitectura interna: cómo funciona realmente LXC/LXD

LXC/LXD usa un conjunto de primitivas del kernel Linux:

## 4.1 Namespaces utilizados

| Namespace | Aislamiento             |
| --------- | ----------------------- |
| PID       | Procesos                |
| UTS       | Hostname                |
| IPC       | Comunicaciones internas |
| NET       | Stacks de red           |
| MOUNT     | Filesystem              |
| USER      | UIDs/GIDs               |
| CGROUP    | Recursos                |

## 4.2 Cgroups (v2 recomendado)

Controlan:

* CPU
* Memoria
* IO
* PIDs
* Redes

## 4.3 Seguridad MAC

Dependiendo del host:

* **AppArmor** (Ubuntu/LXD por defecto)
* **SELinux** (RHEL/Fedora)
* **Landlock** (nuevo enfoque)

## 4.4 Aislamiento de usuario (userns)

El UID 0 dentro del contenedor no es root real: se mapea a un UID sin privilegios.

Este es el corazón de la seguridad en LXD.

---

# 5. Hardening Avanzado de LXC/LXD

Este apartado es clave para usar LXC/LXD de forma segura en entornos sensibles.

## 5.1 Contenedores “unprivileged”: obligatorio

NUNCA uses contenedores privilegiados salvo que sepas exactamente lo que haces.

Revisa:

```bash
lxc config show <instancia>
```

Debe aparecer:

```
security.privileged: "false"
```

## 5.2 Aislamiento de mapeo de usuarios

Actívalo:

```bash
lxc config set <instancia> security.idmap.isolated true
```

## 5.3 Desactivar nesting

Evita permitir contenedores dentro de contenedores:

```bash
lxc config set <instancia> security.nesting false
```

## 5.4 Limitar recursos

### CPU

```bash
lxc config set web limits.cpu=2
```

### Memory

```bash
lxc config set web limits.memory=4GiB
```

### Procesos

```bash
lxc config set web limits.processes=500
```

## 5.5 Seccomp

LXD aplica un profile seccomp restrictivo por defecto.
Puedes aplicar uno propio:

```bash
lxc config set <instancia> security.syscalls.deny_compat 32bit
```

## 5.6 AppArmor/SELinux reforzado

Usa perfiles personalizados solo si tienes requisitos especiales.

## 5.7 Desmontar capacidades innecesarias

Ejemplo:

```bash
lxc config set db security.drop_capabilities "sys_admin sys_ptrace"
```

---

# 6. Redes Avanzadas en LXD (Networking)

LXD ofrece una red extremadamente flexible.

## 6.1 Bridge administrado por LXD (estándar)

Recomendada para la mayoría de escenarios:

```bash
lxc network create lxdbr0 ipv4.address=auto ipv6.address=none ipv4.nat=true
```

## 6.2 IPs estáticas con DHCP

```bash
lxc config device set web eth0 ipv4.address=10.0.3.50
```

## 6.3 Modo macvlan (inserta contenedores en la LAN)

El host NO puede hablar con el contenedor:

```bash
lxc profile create macvlan
lxc profile device add macvlan eth0 nic nictype=macvlan parent=enp3s0
```

## 6.4 Routed Mode (recomendado en producción)

El contenedor recibe una IP enrutable sin usar bridge:

```bash
lxc network create routed0 --type=bridge ipv4.address=none ipv6.address=none
```

Configura rutas estáticas en el host.

## 6.5 VLANs

```bash
lxc network create vlan100 parent=eth0 vlan=100
```

## 6.6 Firewall + ACLs

```bash
lxc network acl create backend
lxc network acl rule add backend ingress action=allow destination=10.0.3.100
lxc network acl rule add backend ingress action=deny
```

---

# 7. Almacenamiento Avanzado (Storage Pools)

## 7.1 Backends recomendados

| Backend   | Uso recomendado                            |
| --------- | ------------------------------------------ |
| **ZFS**   | Producción, snapshots, clones, rendimiento |
| **btrfs** | Entornos ligeros, snapshots rápidos        |
| **LVM**   | Robustez + control fino                    |
| **dir**   | No usar en producción                      |

## 7.2 Crear un pool ZFS

```bash
lxc storage create zfspool zfs source=/dev/sdb
```

## 7.3 Afinado ZFS recomendado

```
recordsize=16k (para bases de datos)
compression=zstd
atime=off
```

---

# 8. Perfiles Avanzados (Profiles)

## 8.1 Perfil Hardened (recomendado)

```bash
lxc profile create hardened
lxc profile set hardened limits.cpu=2
lxc profile set hardened limits.memory=2GiB
lxc profile set hardened security.idmap.isolated=true
lxc profile set hardened security.nesting=false
lxc profile set hardened security.privileged=false
```

## 8.2 Perfil DB

```bash
lxc profile create db
lxc profile set db limits.cpu=4
lxc profile set db limits.memory=8GiB
lxc profile set db linux.kernel_modules="loop"
lxc profile set db security.drop_capabilities="sys_admin"
```

## 8.3 Perfil Routed

```bash
lxc profile create routed
lxc profile device add routed eth0 nic nictype=routed parent=eth0
```

---

# 9. Snapshots, Clones, Backups y Migración

## 9.1 Snapshot

```bash
lxc snapshot web pre-update
```

## 9.2 Clonar contenedor

```bash
lxc copy web web-test
```

## 9.3 Migrar contenedor a otro nodo del cluster

```bash
lxc move web nodo2:
```

## 9.4 Backup

```bash
lxc export web web.tar.gz
```

---

# 10. Clustering y Alta Disponibilidad

## 10.1 Crear clúster

NODO 1:

```bash
lxd init --cluster
```

NODO 2:

```bash
lxd init --cluster-join
```

## 10.2 Funcionamiento interno

LXD usa:

* **dqlite** para la base de datos distribuida
* Heartbeats
* Scheduler
* Storage distribuido (opcional: Ceph)

## 10.3 Ceph para storage distribuido

```bash
lxc storage create cephpool ceph
```

Recomendado para nubes privadas y producción seria.

---

# 11. Virtual Machines en LXD

LXD soporta VMs con kernel aislado:

```bash
lxc launch images:debian/12 vm1 --vm
```

Ideal para:

* Análisis de malware
* Servicios de alta seguridad
* Cargas que requieren kernel propio

---

# 12. Integración con DevOps y CI/CD

## 12.1 Terraform

```hcl
resource "lxd_container" "web" {
  name  = "web"
  image = "images:ubuntu/22.04"
}
```

## 12.2 Ansible

```yaml
- name: Deploy LXD container
  community.general.lxd_container:
    name: web
    state: started
    source:
      alias: ubuntu/22.04
```

## 12.3 Packer → imágenes personalizadas

Ideal para generar imágenes endurecidas.

---

# 13. LXD para Ciberseguridad

## 13.1 Sandboxing de malware

Usa:

* VMs LXD
* Redes aisladas
* Snapshots automáticos
* No usar contenedores privilegiados

## 13.2 Laboratorios de pentesting

* VLANs
* Routed mode
* Segmentación por perfiles
* Contenedores efímeros

## 13.3 Honeycontainers

Crear contenedores que simulen servicios vulnerables.

---

# 14. Troubleshooting Avanzado

## 14.1 Logs

```bash
lxc info --show-log web
```

## 14.2 Problemas de red

```bash
lxc network list
lxc network show lxdbr0
```

## 14.3 Ver reglas generadas por nftables

```bash
nft list ruleset
```

---

# 15. Buenas Prácticas Finales

* Contenedores SIEMPRE unprivileged
* Actualizar host + LXD + kernel
* Mantener perfiles versionados en Git
* Evitar macvlan salvo casos especiales
* Limpiar imágenes y contenedores viejos
* Network ACLs + firewall del host
* Monitorización continua (Prometheus + Grafana)
* Backups regulares + pruebas de restauración

---

# 16. Conclusiones

LXC y LXD permiten construir una plataforma de virtualización ligera extremadamente potente, flexible y eficiente para entornos profesionales. Con un hardening adecuado, perfiles bien diseñados, redes segmentadas, almacenamiento apropiado y automatización avanzada, se convierte en una alternativa ideal para:

* Infraestructuras de alta densidad
* Plataformas DevOps
* Entornos multi-tenant
* Laboratorios de seguridad
* Nubes privadas y entornos híbridos
* Workloads persistentes y reproducibles

> LXD es una herramienta madura, estable y lista para producción, especialmente cuando se combina con buenas prácticas de ingeniería de plataforma.
