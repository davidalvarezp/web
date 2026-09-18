# 4.3 Gestión de Volúmenes Lógicos: LVM (PV, VG y LV)

Trabajar con particiones rígidas tradicionales (/dev/sda1, /dev/sdb1) es una receta para el desastre en entornos empresariales. Si un servicio se queda sin espacio, ampliar una partición clásica suele requerir desmontar el disco, alterar la tabla de particiones y rezar para no corromper los datos. Para solucionar esta rigidez, Linux utiliza **LVM (Logical Volume Manager)**, una capa de abstracción entre el hardware físico y el sistema de archivos.

---

## Introducción

LVM agrupa tus discos físicos en un "pool" o fondo común de almacenamiento virtualizado. A partir de ese gran fondo, el Sysadmin puede moldear "particiones virtuales" (Volúmenes Lógicos) que se pueden expandir en caliente en cuestión de milisegundos, fusionar múltiples discos físicos como si fueran uno solo, o incluso tomar capturas de estado (*snapshots*) para realizar copias de seguridad consistentes.

---

## Objetivos de aprendizaje

- Comprender la arquitectura de tres capas de LVM: **PV**, **VG** y **LV**.
- Inicializar discos físicos y agregarlos a grupos de almacenamiento global.
- Crear, formatear y aprovisionar Volúmenes Lógicos desde la CLI.
- Expandir de forma segura y en caliente un volumen lógico y su sistema de archivos.

---

## Conceptos Teóricos

### 1. La Arquitectura de Tres Capas de LVM

Para dominar LVM, debes entender cómo se transforma el almacenamiento a través de sus tres niveles conceptuales:

#### A. PV (Physical Volume - Volumen Físico)

Es la base de la pirámide. Es el hardware real en bruto. Puede ser un disco entero (/dev/sdb), una partición estándar (/dev/sda2) o un disco virtual en la nube. LVM escribe una cabecera especial en este dispositivo para tomar el control de sus bloques.

#### B. VG (Volume Group - Grupo de Volúmenes)

Es la capa intermedia. Imagina el VG como una "bolsa" o un enorme disco virtual que fusiona todos tus PVs. Si metes un disco de 10 GB y otro de 20 GB en el mismo VG, tendrás un fondo común de 30 GB libres. El VG divide este espacio en pequeños bloques idénticos llamados **PE (Physical Extents)**, que por defecto miden 4 MB.

#### C. LV (Logical Volume - Volumen Lógico)

Es la capa superior y lo que el sistema operativo realmente ve como un "disco". Tú le pides al VG que te asigne una cantidad de *Extents* para crear un LV (por ejemplo, un LV de 15 GB). Sobre este LV es donde inyectas el sistema de archivos (ext4 o XFS) y lo montas 
en tu árbol de directorios.

### 2. ¿Por qué LVM es indispensable en producción?

- **Flexibilidad absoluta:** Si el VG se queda sin espacio, compras otro disco duro, lo inicializas como PV, lo metes al VG y listo: el fondo común crece al instante.
- **Ampliación en caliente:** Puedes añadir gigabytes a un LV de producción mientras los usuarios escriben en la base de datos, sin cortes de servicio.
- **Abstracción de nombres:** Tus discos ya no dependen de si son /dev/sda o /dev/nvme0n1. Los volúmenes lógicos adquieren nombres persistentes y profesionales bajo la ruta /dev/mapper/ (ej. /dev/mapper/vg_datos-lv_mysql).

---

## Laboratorio Práctico: Construcción y Expansión Estructural con LVM

### Escenario

Dispones de dos discos nuevos en el servidor: /dev/sdb (10 GB) y /dev/sdc (10 GB). Vas a fusionar ambos discos en un único gran grupo de almacenamiento corporativo. Crearas un volumen lógico de 12 GB para una aplicación, lo formatearas, y posteriormente simularás que te quedas sin espacio para expandirlo a 18 GB **en caliente (sin desmontar nada)**.

### Paso 1: Inicializar los Volúmenes Físicos (PV)

Preparamos los dos discos para que LVM pueda administrarlos de forma nativa.

```bash
# Inicializar ambos dispositivos como PV
sudo pvcreate /dev/sdb /dev/sdc

# Verificar que el Kernel los reconoce como bloques LVM
sudo pvdisplay -c
```

### Paso 2: Crear el Grupo de Volúmenes (VG)

Fusionamos la capacidad de ambos discos creando un grupo llamado vg_infra.

```bash
# Crear el VG metiendo ambos discos dentro
sudo vgcreate vg_infra /dev/sdb /dev/sdc

# Comprobar el tamaño total combinado del pool
sudo vgdisplay vg_infra | grep "VG Size"
```

*Output esperado:* Verás que el tamaño del grupo roza los 20 GB lógicos disponibles.

### Paso 3: Desplegar el Volumen Lógico (LV)

Cortaremos una porción de 12 GB de nuestra bolsa virtual para asignársela a la aplicación.

```bash
# Crear un LV llamado lv_app de 12 Gigabytes extraídos de vg_infra
sudo lvcreate -L 12G -n lv_app vg_infra

# Verificar la creación y su ruta persistente en el sistema
sudo lvdisplay /dev/vg_infra/lv_app
```

### Paso 4: Formatear el Volumen Lógico

A partir de este momento, tratamos al LV como si fuera una partición normal. Lo formatearemos con ext4.

```bash
sudo mkfs.ext4 /dev/vg_infra/lv_app
```

### Paso 5: Expansión Quirúrgica en Caliente

Imagina que la aplicación se ha llenado y necesitas estirar el espacio a 18 GB inmediatamente. Gracias a LVM, no necesitas detener el servidor ni desmontar el disco. Usaremos el comando lvextend con el flag -r (el cual es crítico, ya que le ordena a LVM que amplíe el Volumen Lógico y **automáticamente redimensione el sistema de archivos interno** en un solo paso).

```bash
# Expandir el LV a 18G exactos y redimensionar el sistema de archivos al vuelo
sudo lvextend -r -L 18G /dev/vg_infra/lv_app
```

Si ejecutas un df -h, comprobarás con asombro que el almacenamiento ha crecido en tiempo real a 18 GB sin alterar los archivos existentes ni detener procesos.

---

## Errores Comunes y Troubleshooting

1. **Olvidar redimensionar el Filesystem:** Ejecutas lvextend -L +5G /dev/vg_infra/lv_app (sin el flag -r). LVM te dice que la operación fue un éxito. Sin embargo, entras con df -h y sigues viendo el espacio antiguo.

  **El motivo:** Has ampliado el contenedor virtual (el LV), pero no has estirado la estructura lógica interna (el sistema de archivos).
  
  > **Solución:** Ejecuta el comando manual de expansión de sistema de archivos según tu tecnología:
  >   - Si es **ext4**: sudo resize2fs /dev/vg_infra/lv_app
  >   - Si es **XFS**: sudo xfs_growfs /dev/vg_infra/lv_app (Nota: XFS requiere pasarle el punto de montaje en lugar del archivo de bloque).

2. **Intentar encoger un volumen XFS:** Tu jefe te pide reducir un volumen lógico formateado en XFS para recuperar espacio para otro servicio. Ejecutas un comando de reducción y el sistema arroja un error crítico.

  **El motivo:** Como aprendimos en el capítulo anterior, el sistema de archivos **XFS no soporta la reducción bajo ninguna circunstancia**.

  > **Solución:** Con XFS, la única opción es hacer un backup de los datos, destruir el LV, crearlo más pequeño y restaurar los datos. Si vas a necesitar encoger volúmenes habitualmente, utiliza siempre **ext4**.

---

## Buenas Prácticas

- **Nunca llenes el VG al 100% desde el primer día:** Si tus discos suman 100 GB, no crees un LV de 100 GB. Crea volúmenes ajustados a la necesidad real actual (ej: 20 GB). Dejar espacio libre en el VG te permite reaccionar ante crisis ampliando el volumen que se sature en segundos o crear *snapshots* temporales de seguridad antes de actualizaciones críticas de software.
- **Nomenclatura Estandarizada:** Utiliza prefijos claros siempre. Nombra tus grupos como vg_[nombre] (ej: vg_sistema, vg_datos) y tus volúmenes lógicos como lv_[servicio] (ej: lv_root, lv_backups). Esto evitará confusiones cuando herede tu infraestructura otro administrador.

---

## Resumen

Has alcanzado el cenit de la flexibilidad en el almacenamiento: sabes unificar discos físicos y crear volúmenes elásticos capaces de crecer en caliente. No obstante, para que los usuarios y el propio sistema operativo puedan empezar a escribir archivos en /dev/vg_infra/lv_app, necesitas anclar de forma permanente este dispositivo dentro del árbol de directorios de Linux.