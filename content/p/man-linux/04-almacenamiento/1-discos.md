# 4.1 Gestión de Discos y Particiones: MBR, GPT y Herramientas

Para un administrador de sistemas, el almacenamiento es el recurso más crítico: los servidores y el código se pueden replicar en segundos, pero los datos de una compañía son irremplazables. Antes de que el sistema operativo pueda guardar un solo byte, el Sysadmin debe saber cómo el Kernel identifica el hardware de almacenamiento y cómo estructurar divisiones lógicas seguras mediante tablas de particiones.

---

## Introducción

En Linux, el acceso al hardware de almacenamiento está totalmente estandarizado. Da igual si trabajas con un disco mecánico antiguo, una cabina de almacenamiento en red (SAN), un disco de estado sólido de última generación o un disco virtual en la nube; el Kernel mapeará el dispositivo como un **archivo de bloque** especial. En este capítulo aprenderás a identificar estos dispositivos, a elegir la arquitectura de particionado adecuada y a manipular el mapa del disco de forma segura.

---

## Objetivos de aprendizaje

- Comprender la nomenclatura que usa el Kernel para identificar discos magnéticos, de estado sólido y virtuales.
- Diferenciar las ventajas y limitaciones de las tablas de particiones **MBR** y **GPT**.
- Dominar las herramientas de particionado profesionales de la CLI (`fdisk`, `gdisk` y `parted`).
- Modificar la tabla de particiones en caliente y notificar al Kernel sin reiniciar el servidor.

---

## Conceptos Teóricos

### 1. Nomenclatura de Dispositivos de Almacenamiento

En Linux, la filosofía de "todo es un archivo" se aplica al almacenamiento dentro del directorio `/dev/`. El Kernel nombra a los discos basándose en su tecnología y su orden de detección:

-   **`/dev/sdX` (SATA/SCSI/SAS/USB):** La `sd` proviene de *SCSI Disk*. La `X` es una letra secuencial. El primer disco detectado será `/dev/sda`, el segundo `/dev/sdb`, y así sucesivamente.
-   **`/dev/nvmeXnY` (Discos NVMe M.2/U.2):** Discos de estado sólido de alta velocidad conectados al bus PCIe. El formato indica el controlador (`nvme0`) y el número de espacio de nombres (`n1`).
-   **`/dev/vdX` (Discos Virtuales VirtIO):** Discos optimizados para entornos de virtualización (KVM/QEMU). Son extremadamente eficientes en entornos Cloud.

#### Las Particiones

Cuando divides un disco, Linux añade un número al final del nombre del dispositivo. Por ejemplo, la primera partición del primer disco SATA se llamará `/dev/sda1`. La segunda partición del primer disco NVMe se llamará `/dev/nvme0n1p2`.

### 2. MBR vs. GPT: La Arquitectura del Disco

Antes de crear particiones, debes inicializar el disco con una "tabla de particiones". Existen dos estándares en la industria:

| Característica | MBR (Master Boot Record) | GPT (GUID Partition Table) |
| :--- | :--- | :--- |
| **Antigüedad / Estándar**| Legacy (Desde 1983). Vinculado a BIOS. | Moderno (Estándar UEFI actual). |
| **Límite de Tamaño** | Máximo **2 TB** por disco. | Prácticamente ilimitado (Zettabytes). |
| **Número de Particiones**| Máximo 4 primarias (o 3 primarias y 1 extendida con lógicas). | Hasta **128 particiones** nativas directas. |
| **Redundancia** | Cero. Si el primer sector del disco se corrompe, pierdes el acceso a todo. | Almacena copias de seguridad de la tabla al final del disco de forma nativa. |

!!! info "Decisión Senior"
    En entornos modernos de producción, **GPT es el estándar por defecto**. Solo utilizarás MBR si estás administrando sistemas heredados (*legacy*) muy antiguos o sistemas embebidos de hardware muy limitado.

---

## Laboratorio Práctico: Particionado de un Disco Nuevo

### Escenario

Has conectado un nuevo disco duro de estado sólido virtualizado de 20 GB a tu servidor de base de datos. El disco ha sido detectado como `/dev/sdb`. Debes inicializarlo usando una tabla **GPT**, crear una partición de 10 GB para datos y forzar al Kernel a leer los cambios sin reiniciar la máquina de producción.

### Paso 1: Identificar el Hardware con `lsblk`

El comando `lsblk` (List Blocks) te da un mapa visual limpio de la jerarquía de almacenamiento del servidor.

```bash
lsblk
```

*Busca en el output un dispositivo llamado sdb de 20G que no tenga líneas colgando debajo (lo que indica que no está particionado todavía).*

### Paso 2: Entrar al Gestor de Particiones GPT (gdisk)

Para MBR se suele usar fdisk, pero para discos GPT, la herramienta interactiva profesional por excelencia de la CLI es gdisk.

```bash
sudo gdisk /dev/sdb
```

*Entrarás en una terminal interactiva especializada.*

### Paso 3: Flujo de Creación de la Partición

Dentro de la consola de gdisk, ejecuta secuencialmente los siguientes comandos de una sola letra:

1. Pensa en la seguridad: Pulsa **p** y dale a *Enter* para imprimir la tabla actual y verificar que el disco está vacío.
2. Crear tabla GPT: Si el disco era completamente nuevo, gdisk lo convertirá a GPT automáticamente.
3. Nueva partición: Pulsa **n** (New partition).
  - *Number:* Dale a *Enter* para aceptar el valor por defecto (1).
  - *First sector:* Dale a *Enter* para aceptar el sector de inicio por defecto (alineación automática).
  - *Last sector:* Introduce el tamaño deseado de forma exacta: **+10G**.
  - *Hex code:* Dale a *Enter* para aceptar el tipo por defecto (8300 - Linux filesystem).
4. Verificar cambios: Vuelve a pulsar **p** para ver tu nueva partición virtual /dev/sdb1 en la lista.
5. Escribir en el disco de forma definitiva: Pulsa **w** (Write) y confirma con Y. **Este es el único paso destructivo**.

### Paso 4: Notificar al Kernel en Caliente (partprobe)

A veces, al particionar un disco en producción, el Kernel sigue usando el mapa antiguo en memoria y lanza un aviso indicando que el dispositivo está ocupado. **Nunca reinicies un servidor por esto**.

```bash
# Sincronizar las particiones del disco con la memoria viva del Kernel
sudo partprobe /dev/sdb
```

Comprueba el resultado volviendo a lanzar un lsblk. Verás que ahora /dev/sdb1 aparece listado de forma oficial y el sistema está listo para trabajar con él.

## Errores Comunes y Troubleshooting

1. **Alineación incorrecta de sectores:** Si creas particiones indicando sectores manuales desalineados (no divisibles por 4096 bytes), el rendimiento de lectura/escritura de tus discos SSD se puede degradar hasta un 50% debido al fenómeno de *Write Amplification*.

  > **Solución:** Confía siempre en los sectores de inicio que las herramientas modernas como gdisk o fdisk te ofrecen por defecto (usualmente arrancan en el sector 2048).

2. **El desastre del disco equivocado:** Equivocarse de letra al lanzar el comando (ej: poner gdisk /dev/sda en lugar de sdb) y machacar la tabla de particiones del sistema operativo en producción.

  > **Solución:** Antes de pulsar w, usa siempre el comando p para revisar el tamaño del disco y sus particiones actuales. Si ves que tiene datos, pulsa q para salir sin guardar cambios.

---

## Buenas Prácticas

- **Respaldar Tablas de Particiones:** Antes de realizar tareas de mantenimiento en caliente sobre discos críticos, saca un volcado binario de la tabla de particiones actual. Si metes la pata, podrás restaurarla en un milisegundo:
  ```bash
  # Hacer backup de la estructura
  sudo sfdisk --dump /dev/sdb > sdb_tabla.bak
  
  # Restaurar en caso de catástrofe
  sudo sfdisk /dev/sdb < sdb_tabla.bak 
  ```

- **Utiliza nombres persistentes (WWN):** En servidores empresariales conectados a cabinas de discos, las letras sdb, sdc pueden cambiar tras un reinicio si un cable se detecta antes que otro. Nunca te fíes de las letras de los discos para tareas críticas o automatizaciones de scripts.

## Resumen

Has tomado un bloque de hardware en bruto, has establecido las reglas del juego usando una tabla GPT moderna y has creado una partición limpia de 10 GB. Sin embargo, en este estado, el disco sigue siendo inutilizable; es como un terreno vallado pero sin parcelar ni asfaltar.