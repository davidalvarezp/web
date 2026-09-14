# 1.2 Arquitectura del Sistema: El Kernel y el FHS

Entender cómo se organiza Linux "bajo el capó" es lo que diferencia a un usuario que copia comandos de un **SysAdmin** capaz de diagnosticar problemas complejos. 
En esta sección analizaremos la jerarquía del sistema de archivos y cómo el Kernel interactúa con el hardware.

---

## Introducción

La arquitectura de Linux se basa en la separación de privilegios y en una estructura de archivos predecible. 
Mientras que el **Kernel** actúa como el director de orquesta gestionando los recursos, el **FHS (Filesystem Hierarchy Standard)** asegura 
que cualquier administrador sepa dónde encontrar una configuración o un log, independientemente de la distribución que esté utilizando.

---

## Objetivos de aprendizaje

- Diferenciar entre **Kernel Space** y **User Space**.
- Comprender el flujo de una **System Call** (Llamada al sistema).
- Memorizar la jerarquía del **FHS** y el propósito de cada directorio raíz.
- Explorar los sistemas de archivos virtuales /proc y /sys.

---

## Conceptos Teóricos

### 1. El Kernel y la Protección por Anillos

El Kernel de Linux opera en el nivel más privilegiado del hardware (denominado **Ring 0**). El software de usuario (navegadores, bases de datos, editores) corre en el **Ring 3**.

- **User Space:** Donde residen tus aplicaciones. No tienen acceso directo al hardware por razones de seguridad y estabilidad.
- **Kernel Space:** Donde reside el núcleo. Gestiona la memoria, el tiempo de CPU para cada proceso y los controladores de dispositivos (drivers).
- **System Calls:** Es el puente. Cuando una aplicación necesita escribir un archivo en el disco, "llama" al Kernel mediante una SysCall para que este realice la operación en su nombre.

### 2. El Estándar de Jerarquía del Sistema de Archivos (FHS)

En Linux, **"todo es un archivo"**. Esta filosofía se organiza bajo una estructura de árbol que cuelga de la raíz (/).

| Directorio | Propósito Profesional |
|---|---|
| **/bin** y **/sbin** | Binarios esenciales del sistema. sbin contiene comandos para el administrador (root). |
| **/etc** | El "centro de control". Aquí residen todos los archivos de configuración del sistema y servicios. |
| **/var** | Datos variables. Aquí encontrarás los **logs** (/var/log) y colas de impresión o correo. |
| **/home** | Directorios personales de los usuarios. |
| **/root** | El hogar del superusuario (separado de /home por seguridad). |
| **/tmp** | Archivos temporales (se suelen borrar al reiniciar). |
| **/usr** | Contiene la mayoría de las utilidades y aplicaciones de usuario (solo lectura en entornos endurecidos). |
| **/boot** | Archivos necesarios para el arranque (Kernel, Grub, Initrd). |
| **/proc** y **/sys** | **Sistemas de archivos virtuales**. No ocupan espacio en disco; son ventanas directas al Kernel y al hardware. |

---

## Laboratorio Práctico: Explorando las entrañas del Sistema

Como administrador, utilizarás los directorios virtuales para obtener información en tiempo real sin necesidad de herramientas externas.

### Escenario

Necesitas verificar cuánta memoria RAM tiene el servidor y qué procesador está utilizando sin instalar paquetes adicionales.

### Paso 1: Consultar el hardware desde /proc

El directorio /proc contiene archivos de texto que representan el estado del Kernel.

```bash
# Ver información detallada del procesador
cat /proc/cpuinfo

# Ver estadísticas de memoria en tiempo real
cat /proc/meminfo
```

### Paso 2: Analizar dispositivos con /sys

A diferencia de /proc, el directorio /sys está más enfocado a la estructura del hardware físico (buses, drivers).

```bash
# Listar las clases de dispositivos detectadas
ls /sys/class/
```

### Paso 3: La importancia de /etc

Casi cualquier problema de un servicio (como Nginx o SSH) se resuelve editando un archivo aquí.

```bash
# Listar archivos de configuración (busca extensiones .conf)
ls /etc/*.conf | head -n 5
```

---

## Errores Comunes y Troubleshooting

1. **Llenar la partición /var:** Si los logs crecen descontroladamente, el sistema puede dejar de arrancar o bloquear servicios críticos.

  > **Solución:** Implementar logrotate (lo veremos en el Módulo 7) y tener /var en una partición separada.

2. **Modificar archivos en /proc o /sys manualmente:** Algunos archivos permiten escritura para cambiar parámetros del Kernel en caliente, pero un valor erróneo puede causar un *Kernel Panic*.

  > **Solución:** Usar la herramienta sysctl para cambios persistentes y seguros.

3. **Confundir /bin con /usr/bin:** En distros modernas, suele haber un enlace simbólico que los une (Usr-merge), pero en sistemas antiguos son distintos.

---

## Buenas Prácticas

- **Particionado Inteligente:** En servidores de producción, nunca instales todo en una sola partición /. Separa al menos /var, /home y /boot. Esto evita que un usuario llenando su "home" tumbe el sistema entero.
- **Principio de Inmutabilidad:** En entornos de alta seguridad, se monta /usr como **Read-Only** para evitar que un atacante modifique binarios esenciales.
- **Limpieza de /tmp:** No asumas que el sistema limpia /tmp automáticamente. Configura tareas de limpieza o usa tmpfs (RAM) para este directorio para mejorar la velocidad.

---

## Resumen

Entender el FHS y la separación entre User y Kernel Space es fundamental para el troubleshooting. Ahora sabes dónde reside cada pieza del puzzle.
