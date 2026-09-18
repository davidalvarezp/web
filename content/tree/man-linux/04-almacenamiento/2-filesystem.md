# 4.2 Sistemas de Archivos: ext4, XFS e Inodos

Una partición en bruto o un bloque de disco recién creado es simplemente un espacio contiguo de bits. Para que el sistema operativo pueda guardar archivos, organizar directorios y gestionar permisos, necesita inyectar una estructura lógica superior. Esta estructura es el **Sistema de Archivos (Filesystem)**.

---

## Introducción

El sistema de archivos define cómo se almacenan y se recuperan los datos. Sin él, la información en el disco sería un enorme flujo de bytes ilegible donde no sabríamos dónde empieza un archivo y dónde termina otro. Como Sysadmin, tu elección del sistema de archivos e índices afectará directamente al rendimiento del servidor, la tolerancia a fallos ante apagones y la velocidad de recuperación ante desastres.

---

## Objetivos de aprendizaje

- Comprender la anatomía interna de un sistema de archivos Linux y el concepto de **Inodo**.
- Comparar y elegir correctamente entre las tecnologías **ext4** y **XFS** en entornos de producción.
- Entender cómo el mecanismo de **Journaling** protege la integridad de los datos.
- Formatear particiones utilizando herramientas nativas de la CLI (`mkfs`).
- Diagnosticar la saturación oculta de almacenamiento por agotamiento de inodos.

---

## Conceptos Teóricos

### 1. La Anatomía del Almacenamiento: Datos vs. Metadatos

Un sistema de archivos de Linux divide el espacio del disco en dos grandes zonas:

-   **Bloques de Datos:** El contenido real de tus archivos (el código de tu app, las filas de tu base de datos, las imágenes).
-   **Metadatos (Inodos):** La información estructural sobre los archivos.

#### ¿Qué es un Inodo (Index Node)?

En Linux, un archivo no está indizado por su nombre. Cada archivo o directorio del disco tiene asignado un número único llamado **Inodo**. El inodo es una ficha de metadatos que contiene:

-   El tipo de archivo (regular, directorio, enlace, socket).
-   Los permisos POSIX (Lectura, Escritura, Ejecución) y los propietarios (UID/GID).
-   El tamaño del archivo y las marcas de tiempo (creación, modificación, acceso).
-   **Punteros de datos:** Las direcciones físicas exactas del disco donde están guardados los bloques de datos reales.

!!! info "El secreto de los nombres de archivo"
    El inodo **no contiene el nombre del archivo**. Los nombres de archivo se guardan exclusivamente dentro de los archivos de tipo *directorio*, los cuales actúan como una tabla que asocia texto plano con números de inodo.

### 2. El Mecanismo de Journaling (Diario de Transacciones)

En sistemas de archivos antiguos, si el servidor sufría un corte de luz en mitad de una escritura, los metadatos y los bloques de datos quedaban desalineados, corrompiendo el disco. Reparar esto requería un escaneo completo (`fsck`) que tardaba horas.

Los sistemas de archivos modernos utilizan **Journaling**. Antes de realizar cualquier cambio real en los bloques de datos, el Kernel escribe la intención de la operación en una zona reservada del disco llamada *Journal*. 

-   Si la luz se corta, al arrancar de nuevo, el Kernel lee el *Journal* y termina la tarea pendiente o la descarta de forma limpia en milisegundos, evitando corrupciones catastróficas.

### 3. El Estándar Corporativo: ext4 vs. XFS

En el ecosistema Linux profesional, dos tecnologías dominan el mercado de servidores:

| Característica | ext4 (Fourth Extended Filesystem) | XFS (Extensible Filesystem) |
| :--- | :--- | :--- |
| **Origen / Distribución** | Estándar nativo de la comunidad. Predeterminado en Debian/Ubuntu. | Desarrollado por SGI. Predeterminado en la familia RHEL/AlmaLinux. |
| **Reducción de tamaño** | **Sí**. Se puede encoger una partición en caliente o en frío de forma segura. | **No**. Un sistema de archivos XFS solo puede crecer; nunca se puede reducir. |
| **Rendimiento con archivos gigantes** | Bueno, pero sufre con volúmenes de múltiples Terabytes. | Excelente. Diseñado para E/S paralela y archivos masivos. |
| **Gestión de Inodos** | Asignación estática al formatear. Si se agotan, no puedes crear más archivos. | Asignación dinámica sobre la marcha. Es casi imposible agotar sus inodos. |

---

## Laboratorio Práctico: Inyección y Auditoría de Sistemas de Archivos

### Escenario

Tomaremos la partición `/dev/sdb1` de 10 GB que creamos en el capítulo anterior. Vamos a formatearla primero como `ext4`, auditaremos su estructura interna, y posteriormente la reformatearemos como `XFS` para comprobar los cambios de metadatos.

### Paso 1: Formatear en ext4 con `mkfs.ext4`

La familia de comandos `mkfs` (Make Filesystem) es la encargada de escribir la estructura lógica sobre la partición vacía.

```bash
# Formatear la partición con el sistema de archivos ext4
sudo mkfs.ext4 /dev/sdb1
```

*Observa el output: el comando te indicará cuántos bloques de datos ha creado y el número exacto de inodos asignados de forma fija.*

### Paso 2: Auditar los metadatos ocultos con tune2fs

El comando tune2fs te permite interrogar e incluso modificar parámetros del sistema de archivos ext4 sin alterar los datos.

```bash
# Leer el superbloque del sistema de archivos
sudo tune2fs -l /dev/sdb1
```

*Busca en el output campos como Filesystem features (donde verás activo el flag has_journal) y Reserved block count (el espacio protegido para root).*

### Paso 3: Reformatear en XFS con mkfs.xfs

Ahora cambiaremos de tecnología. Lanzar un mkfs sobre un disco que ya tiene datos requiere habitualmente el flag de fuerza (-f) para sobreescribir la firma antigua.

```bash
# Forzar el formateo a XFS
sudo mkfs.xfs -f /dev/sdb1
```

*Verás que la salida de XFS es diferente: desglosa la información en secciones llamadas "Allocation Groups" (AG), que permiten realizar lecturas y escrituras simultáneas usando múltiples hilos de la CPU.*

## Errores Comunes y Troubleshooting

1. **El misterio de "No space left on device" con el disco vacío:** Tu monitor de alertas indica que un servidor no puede escribir archivos porque el disco está al 100%. Entras, ejecutas df -h y ves que tienes 50 GB libres en la partición.

  **El motivo:** Tienes espacio de almacenamiento físico, pero has agotado la tabla de inodos estática (típico en servidores de correo con millones de micro-archivos de 1 byte). Si no hay inodos libres, no se pueden registrar nuevos archivos.

  > **Solución:** Audita tus inodos con el comando:

```bash
df -i    
```

  Si la columna IUse% está al 100%, tendrás que buscar el directorio que contiene los millones de archivos temporales olvidados y borrarlos, o migrar ese almacenamiento a un sistema de archivos **XFS** (que gestiona inodos dinámicos).

2. **Formatear el disco equivocado en producción:** Ejecutar un mkfs destructivo sobre una partición activa de datos por una errata de nomenclatura.

  > **Solución:** mkfs se negará a formatear si detecta que la partición está montada o en uso por el sistema. El peligro real ocurre si el disco está desmontado. Acostúmbrate a usar lsblk -f antes de lanzar un formateo para comprobar visualmente si la partición tiene una firma (FSTYPE) activa.

---

## Buenas Prácticas

- **Ajusta el espacio reservado para Root (En ext4):** Por defecto, mkfs.ext4 reserva un **5%** del tamaño total del disco de forma exclusiva para el usuario root. Esto se hace para que, si un usuario llena el disco al 100%, los servicios del sistema operativo tengan un margen para seguir escribiendo logs y el Sysadmin pueda entrar por SSH a resolver la crisis. Sin embargo, en un disco de datos puro de 2 TB, un 5% son 100 GB desperdiciados. Reduce este espacio al 1% o de forma quirúrgica:

  ```bash
  # Reducir el espacio reservado al 1% en la partición especificada
  sudo tune2fs -m 1 /dev/sdb1
  ```

- **Asigna etiquetas descriptivas (Labels):** En lugar de recordar que /dev/sdb1 contiene las bases de datos, asígnale una etiqueta interna al formatear. Esto facilitará enormemente las tareas de montaje automatizado:

  ```bash
  sudo mkfs.ext4 -L DATA_PROD /dev/sdb1 
  ```

---

## Resumen

Has estructurado de forma lógica la partición convirtiéndola en un almacén de datos real y eficiente mediante sistemas de archivos modernos. Sin embargo, en la infraestructura moderna, trabajar con particiones rígidas es un riesgo: si te quedas sin espacio en un sistema de archivos tradicional, ampliar el disco físico requiere paradas de servicio complejas.