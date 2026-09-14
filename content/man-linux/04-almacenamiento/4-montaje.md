# 4.4 Montaje de Discos y Automatización con fstab

Has aprendido a particionar un disco, a inyectarle un sistema de archivos y a flexibilizarlo mediante LVM. Sin embargo, en el ecosistema Unix, un disco con un sistema de archivos sigue siendo inaccesible hasta que se realiza la operación de **Montaje (Mounting)**.

---

## Introducción

El montaje es el proceso por el cual un dispositivo de almacenamiento se acopla de forma orgánica a un punto específico del árbol de directorios global de Linux (conocido como *Punto de Montaje*). Como Sysadmin, dominar el montaje manual, entender las opciones de seguridad del sistema de archivos y automatizar este proceso de forma indestructible a través del archivo /etc/fstab es una competencia crítica para garantizar que los servicios sobrevivan a un reinicio del servidor.

---

## Objetivos de aprendizaje

- Asociar de forma manual sistemas de archivos a directorios mediante el comando mount.
- Utilizar identificadores únicos universales (**UUID**) para referenciar almacenamiento de forma persistente.
- Dominar la sintaxis y las directrices de configuración del archivo crítico /etc/fstab.
- Implementar flags de seguridad (noexec, nosuid, nodev) para securizar particiones.
- Recuperar un servidor que ha entrado en pánico o bucle de arranque por un error en la configuración de montaje.

---

## Conceptos Teóricos

### 1. El Árbol de Directorios Unificado

A diferencia de otros sistemas operativos que asignan letras independientes a cada disco (como C:, D: o E:), Linux unifica absolutamente todo el almacenamiento bajo una única raíz: el directorio / (root).
Cuando montas la partición de un disco en un directorio como /var/www/, el Kernel intercepta de forma transparente cualquier escritura o lectura en esa ruta y la redirige físicamente hacia las celdas de memoria o platos magnéticos de ese disco específico.

### 2. Anatomía de /etc/fstab (File System Table)

El comando mount es volátil: si reinicias la máquina, el montaje desaparece. Para que el sistema operativo monte tus discos automáticamente durante el proceso de arranque, debes registrarlos en el archivo de configuración /etc/fstab.
Este archivo se compone de líneas estructuradas estrictamente en **6 columnas** separadas por espacios o tabuladores:

```text
# <Dispositivo>         <Punto Montaje>    <Tipo FS>    <Opciones>             <Dump>  <Pass>
UUID=b3a2...-43af       /data/produccion   ext4         defaults,noatime       0       2
```

#### Desglose de las 6 Columnas:

1. **Dispositivo:** El bloque físico o lógico que se va a montar. **Regla de oro senior:** Nunca uses el nombre de archivo directo (/dev/sdb1), ya que puede cambiar tras un reinicio. Usa siempre el **UUID** (identificador único del sistema de archivos) o la ruta de mapeo persistente de LVM.
2. **Punto de Montaje:** El directorio existente donde se acoplará el disco (ej. /mnt/respaldos).
3. **Tipo de Sistema de Archivos:** La tecnología con la que se formateó (ext4, xfs, vfat, ntfs-3g, btrfs).
4. **Opciones de Montaje:** Flags que modifican el comportamiento y la seguridad del disco:

    - defaults: Aplica un conjunto estándar (rw, suid, dev, exec, auto, nouser, async).
    - noatime: Desactiva la actualización de la marca de tiempo de último acceso cada vez que se lee un archivo. **Eleva drásticamente el rendimiento de E/S del disco**.
    - ro: Monta el disco en modo *Solo Lectura* (útil para backups o auditorías forenses).
    - noexec: Prohíbe la ejecución de binarios dentro de esa partición (ideal para securizar /tmp o directorios de subida de usuarios).

5. **Dump (Respaldo):** Un valor binario (0 o 1). Indica si la herramienta obsoleta dump debe hacer copia de seguridad de la partición. En la actualidad, **siempre se configura en 0**.
6. **Pass (Revisión fsck):** Determina el orden en que el sistema operativo escaneará el disco en busca de errores durante el arranque:

    - 1: Reservado exclusivamente para la partición raíz /.
    - 2: Para el resto de tus particiones de datos o discos secundarios.
    - 0: Desactiva por completo el escaneo automático para ese disco.

---

## Laboratorio Práctico: Montaje Seguro y Automatización de un Volumen Lógico

### Escenario

Tienes el volumen lógico elástico /dev/vg_infra/lv_app que creamos y expandimos en el capítulo anterior. Tu objetivo es obtener su identificador UUID, crear un punto de montaje dedicado, configurarlo en /etc/fstab con flags de rendimiento y verificar la persistencia de forma segura.

### Paso 1: Obtener el UUID del Dispositivo con blkid

El comando blkid (Block ID) interroga las cabeceras de los discos para extraer sus atributos únicos de bajo nivel.

```bash
sudo blkid /dev/vg_infra/lv_app
```

*Copia de forma exacta la cadena de texto larga dentro de las comillas de UUID="..." (ej. UUID="a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6").*

### Paso 2: Crear el Directorio de Destino

El punto de montaje debe existir en el sistema antes de ejecutar la acción.

```bash
sudo mkdir -p /srv/app_data
```

### Paso 3: Edición Quirúrgica de /etc/fstab

Abre el archivo con privilegios de superusuario:

```bash
sudo nano /etc/fstab
```

Ve al final del archivo y añade una nueva línea estructurada utilizando el UUID que copiaste en el Paso 1 (reemplaza el ejemplo con tu UUID real) y aplicando la directiva de rendimiento noatime:

```text
UUID=a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6  /srv/app_data  ext4  defaults,noatime  0  2
```

*Guarda el archivo y sal del editor.*

### Paso 4: La Prueba de Fuego (mount -a)

!!! warning "NUNCA reinicies un servidor inmediatamente después de editar /etc/fstab"
    Si cometiste una errata tipográfica o pusiste un UUID incorrecto, el servidor fallará en el próximo arranque, tirando los servicios abajo y obligándote a resolverlo mediante una consola de rescate física.

```bash
# Ordenar al Kernel que monte TODO lo que esté registrado en /etc/fstab
sudo mount -a
```

*Si este comando no devuelve ningún mensaje de error en la consola, tu configuración es perfecta e indestructible. El disco se ha montado correctamente y sobrevivirá a futuros reinicios.*

### Paso 5: Confirmar el Éxito de la Operación

Verifica que el almacenamiento está acoplado en la ruta correcta:

```bash
df -h | grep /srv/app_data
```

---

## Errores Comunes y Troubleshooting

1. **El servidor no arranca y entra en "Emergency Mode":** Editaste /etc/fstab, no pasaste el control de calidad con mount -a y reiniciaste. El servidor se queda colgado en una pantalla negra pidiendo la contraseña de root.

  **El motivo:** El Kernel ha intentado buscar un UUID o una ruta inexistente durante el boot y, al ser una partición obligatoria (pass 2), detiene todo el sistema por seguridad.

  > **Solución:** Introduce la contraseña de root para acceder a la CLI de emergencia. El sistema de archivos raíz estará probablemente montado como *Solo Lectura*, por lo que no te dejará corregir el archivo. Ejecuta el siguiente comando para remontar la raíz en modo escritura:

```bash
mount -o remount,rw /
```
  >  Abre /etc/fstab, comenta la línea errónea añadiendo un # al principio, guarda y reinicia con reboot. El servidor volverá a la vida.

2. **Uso de la opción nofail para discos externos o de red:** Si configuras en /etc/fstab un disco duro USB externo o un montaje de red NFS, y por alguna razón el cable se desconecta o la red no está disponible en el arranque, el servidor fallará y no encenderá.

  > **Solución:** Añade la opción nofail en la cuarta columna de opciones. Esto le indica al Kernel: *"Intenta montar este disco; si no está presente, ignora el error y continúa arrancando el sistema operativo normalmente"*.

```text
UUID=1234-ABCD  /mnt/disco_usb  ext4  defaults,nofail  0  0    
```

---

## Buenas Prácticas

- **Securiza las particiones públicas:** Si configuras un disco separado para que los usuarios suban archivos (como un servidor FTP o un directorio temporal /tmp), bloquéales la capacidad de subir scripts maliciosos ejecutables combinando las opciones noexec,nosuid,nodev.
- **Desmontaje Forzado:** Si intentas desmontar un disco con sudo umount /srv/app_data y el sistema te devuelve el error target is busy, significa que hay un proceso o un usuario con una terminal abierta leyendo ese directorio. Encuentra al culpable usando lsof o fuser:
  ```bash
  # Ver qué procesos retienen el disco
  sudo fuser -vm /srv/app_data
  
  # Terminar de forma segura los procesos que bloquean el punto de montaje
  sudo fuser -km /srv/app_data 
  ```

---

## Resumen del Módulo 4

Has terminado el **Módulo 4: Almacenamiento Estructural y Persistencia**. Has recorrido todo el camino del flujo de datos en Linux: desde entender cómo el Kernel interactúa con bloques de hardware crudos, particionar bajo esquemas modernos GPT, inyectar e interrogar sistemas de archivos ext4/XFS, virtualizar discos elásticos mediante LVM, hasta anclarlos de forma automatizada y segura en el corazón del sistema operativo.