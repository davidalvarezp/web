# 10.1 Virtualización con KVM: Fundamentos y Operación en Linux

---

## Introducción

La virtualización es un pilar fundamental en cualquier infraestructura moderna. Permite ejecutar múltiples sistemas operativos aislados sobre un mismo hardware físico, optimizando recursos y facilitando la gestión.

En el ecosistema Linux, **KVM (Kernel-based Virtual Machine)** es la solución estándar para virtualización de tipo 1 integrada en el propio kernel. Permite convertir un servidor Linux en un **hypervisor completo**, capaz de ejecutar máquinas virtuales con alto rendimiento y aislamiento.

Para un Sysadmin senior, dominar KVM implica poder construir entornos reproducibles, aislar cargas de trabajo críticas y desplegar infraestructura eficiente sin depender de soluciones propietarias.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender la arquitectura de KVM y su integración con el kernel.
- Identificar los componentes clave del stack de virtualización.
- Instalar y configurar KVM en un sistema Linux.
- Crear y gestionar máquinas virtuales desde CLI.
- Aplicar buenas prácticas en entornos de producción.

---

## Conceptos Teóricos

### 1. ¿Qué es KVM?

KVM es un módulo del kernel de Linux que permite transformar el sistema en un **hypervisor tipo 1 (bare-metal)**.

Componentes clave:

- **kvm.ko** → módulo principal
- **kvm-intel.ko / kvm-amd.ko** → soporte de CPU
- **QEMU** → emulación de hardware
- **libvirt** → capa de gestión

!!! info "Concepto clave"
KVM proporciona virtualización, pero la gestión se realiza mediante herramientas como **libvirt** y **virsh**.

---

### 2. Tipos de virtualización

#### Virtualización completa

- El sistema huésped no sabe que está virtualizado.
- Usa extensiones de CPU (Intel VT-x / AMD-V).

#### Paravirtualización

- Mejora rendimiento mediante drivers optimizados (virtio).

---

### 3. Arquitectura del stack

```text
Hardware
  │
Kernel (KVM)
  │
QEMU
  │
libvirt
  │
Herramientas (virsh, virt-manager)
```

Roles:

- **QEMU** → ejecuta la VM
- **libvirt** → gestión centralizada
- **virsh** → CLI administrativa

---

### 4. Requisitos del sistema

Verificar soporte de virtualización:

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
```

Resultado:

- `0` → no soportado
- `>0` → soportado

---

### 5. Tipos de almacenamiento en KVM

- archivos (`.qcow2`, `.raw`)
- LVM
- NFS / iSCSI

Formato recomendado:

- **qcow2** → flexible (snapshots, compresión)

---

## Laboratorio Práctico

### Escenario

Configurar un servidor Linux como hypervisor:

- instalar KVM
- crear una máquina virtual
- arrancarla y comprobar su estado

---

## Parte 1: Instalación de KVM

```bash
sudo apt update
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients virtinst
```

---

## Paso 2: Verificar instalación

```bash
systemctl status libvirtd
```

```bash
lsmod | grep kvm
```

---

## Paso 3: Añadir usuario a grupo

```bash
sudo usermod -aG libvirt $USER
```

Aplicar cambios:

```bash
newgrp libvirt
```

---

## Parte 2: Crear máquina virtual

### Paso 1: Descargar ISO

```bash
wget https://releases.ubuntu.com/22.04/ubuntu-22.04.iso
```

---

### Paso 2: Crear VM con virt-install

```bash
virt-install \
--name test-vm \
--ram 2048 \
--vcpus 2 \
--disk path=/var/lib/libvirt/images/test-vm.qcow2,size=10 \
--os-type linux \
--os-variant ubuntu22.04 \
--cdrom ubuntu-22.04.iso \
--network network=default \
--graphics none
```

---

### Explicación clave

- **--name** → nombre VM
- **--ram** → memoria
- **--vcpus** → CPU
- **--disk** → almacenamiento
- **--network** → red virtual

---

## Parte 3: Gestión de la VM

### Listar máquinas

```bash
virsh list --all
```

---

### Arrancar VM

```bash
virsh start test-vm
```

---

### Apagar VM

```bash
virsh shutdown test-vm
```

---

### Acceder a consola

```bash
virsh console test-vm
```

Salir:

```text
Ctrl + ]
```

---

## Output esperado

```text
 Id   Name      State
--------------------------------
 1    test-vm   running
```

---

## Errores Comunes y Troubleshooting

### 1. CPU sin soporte de virtualización

```text
KVM acceleration not available
```

-*Causa:**

- VT-x/AMD-V deshabilitado en BIOS

-*Solución:**

activar en BIOS/UEFI.

---

### 2. Permisos insuficientes

Errores al usar `virsh`.

-*Solución:**

```bash
usermod -aG libvirt usuario
```

---

### 3. Servicio libvirt caído

```bash
systemctl restart libvirtd
```

---

### 4. Red no funcional

```bash
virsh net-list
```

Reiniciar red:

```bash
virsh net-start default
```

---

### 5. Disco no encontrado

Verificar ruta y permisos en:

```text
/var/lib/libvirt/images/
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Uso de virtio

Mejora rendimiento:

```bash
--disk bus=virtio
--network model=virtio
```

---

### 2. Separación de almacenamiento

- sistema → disco principal
- datos → volúmenes independientes

---

### 3. Snapshots

Permiten rollback rápido:

```bash
virsh snapshot-create-as test-vm snap1
```

---

### 4. Networking avanzado

- bridges para integración real
- VLANs en entornos complejos

---

### 5. Automatización

Integrar con:

- Ansible
- Terraform

---

### 6. Seguridad

- aislar redes virtuales
- limitar acceso a libvirt
- usar SELinux/AppArmor

---

### 7. Monitorización

- uso de CPU/RAM
- I/O discos
- latencias

---

### 8. Backup de VMs

- copiar discos apagados
- usar snapshots coherentes

---

### 9. Overcommit controlado

Evitar saturar host:

- CPU overcommit moderado
- RAM con ballooning

---

## Resumen y Siguiente Paso

Has aprendido a desplegar y gestionar virtualización con KVM, comprendiendo su arquitectura, instalación y operación en entornos Linux. Este conocimiento es la base para construir infraestructuras virtualizadas eficientes y escalables.

El siguiente paso es evolucionar hacia modelos más ligeros y portables:

➡️ **10.2 Containers** — Virtualización a nivel de sistema operativo con Docker y tecnologías relacionadas.
