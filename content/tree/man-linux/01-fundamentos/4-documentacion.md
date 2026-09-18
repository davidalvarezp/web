# 1.4 Ayuda y Documentación: Uso Profundo de man, info y tldr

Un falso mito en la administración de sistemas es que un Sysadmin Senior lo sabe todo de memoria. La realidad es que un buen profesional no destaca por memorizar cientos de flags de comandos, sino por su **capacidad para interrogar al sistema** y encontrar la documentación exacta en segundos, incluso en entornos aislados sin conexión a internet.

---

## Introducción

Linux es un sistema operativo autodocumentado. Toda la información necesaria para levantar un servicio, entender un archivo de configuración o diagnosticar un error ya está instalada en el disco duro. 
En este capítulo aprenderás a moverte por las páginas de manual (man), a entender sus secciones, a exprimir el sistema info y a usar herramientas modernas como tldr para acelerar tu flujo de trabajo diario.

---

## Objetivos de aprendizaje

- Comprender y navegar por las 8 secciones estructuradas de las páginas man.
- Buscar comandos mediante palabras clave utilizando apropos.
- Utilizar info para documentación detallada de herramientas GNU.
- Instalar y beneficiarse de tldr para consultas de sintaxis rápidas.
- Localizar documentación y ejemplos oficiales en /usr/share/doc.

---

## Conceptos Teóricos

### 1. La Estructura de las Páginas de Manual (man)

El manual de Linux está dividido en **secciones numeradas**. Esto es vital porque existen comandos que comparten el mismo nombre que un archivo de configuración o una llamada al sistema.

| Sección | Contenido | Ejemplo Práctico |
|---|---|---|
| **1** | Comandos de usuario general | man 1 passwd (Modificar la contraseña) |
| **2** | Llamadas al sistema (System Calls) | man 2 fork (Funciones del Kernel) |
| **3** | Funciones de librerías de C | man 3 malloc (Gestión de memoria) |
| **4** | Archivos especiales y dispositivos | man 4 null (El dispositivo /dev/null) |
| **5** | Formatos de archivos de configuración | man 5 passwd (Estructura de /etc/passwd) |
| **6** | Juegos y salvapantallas | man 6 fortune |
| **7** | Miscelánea (Protocolos, convenios) | man 7 ip (Estructura del protocolo IP) |
| **8** | Comandos de administración del sistema | man 8 useradd (Comandos exclusivos de root) |

Si ejecutas simplemente man passwd, el sistema te devolverá la primera coincidencia que encuentre (la sección 1). 
Si lo que buscas es entender cómo se estructura el archivo por dentro, debes especificar la sección 5: man 5 passwd.

### 2. El sistema GNU info

Mientras que man ofrece una referencia rápida y estática, las páginas info fueron diseñadas por el proyecto GNU como un sistema de **hipertexto en terminal** (similar a una web con enlaces). 
Es la documentación oficial y más profunda para herramientas troncales como tar, grep, coreutils o el compilador gcc.

### 3. tldr (Too Long; Didn't Read)

Las páginas man pueden ser abrumadoras debido a su extensión. En el día a día moderno, la comunidad utiliza **tldr**, un cliente que resume cualquier manual en apenas 5 o 6 ejemplos prácticos con los casos de uso más comunes.

---

## Laboratorio Práctico: Navegación de Documentación

### Escenario

Necesitas configurar las cuotas de disco en un servidor. No recuerdas qué comandos gestionan esto, necesitas ver cómo se estructura un archivo de configuración específico y ver un ejemplo rápido de cómo comprimir una carpeta con tar sin leerte 4.000 líneas de manual.

### Paso 1: Descubrir comandos con apropos

Cuando no sabes el nombre exacto de un comando, puedes buscar en las descripciones del manual usando apropos (o su equivalente man -k).

```bash
# Buscar cualquier comando relacionado con "quota"
apropos quota
```

*El sistema te listará todos los comandos y la sección a la que pertenecen.*

### Paso 2: Forzar la lectura de una sección específica

Queremos entender la estructura del archivo /etc/fstab (el encargado de montar los discos). Si hacemos man fstab, nos llevará a su documentación, pero para asegurarnos de que leemos el formato de archivo de la sección 5:

```bash
man 5 fstab
```

??? tip "Atajos indispensables dentro de man"
    El comando man utiliza el paginador less por defecto. Muévete como un profesional con estos atajos:
    - /palabra : Busca "palabra" hacia adelante.
    - n : Va a la siguiente coincidencia de la búsqueda.
    - N : Va a la coincidencia anterior.
    - g : Va al principio del documento.
    - G : Va al final del documento.
    - q : Sale del manual inmediatamente.

### Paso 3: Sintaxis instantánea con tldr

Si necesitas usar tar para extraer un archivo .tar.gz y no recuerdas si las flags eran -xf o -czf:

```bash
# Instalar tldr (requiere node/npm o usar versiones nativas en Go/Rust)
# En distribuciones basadas en Debian/Ubuntu: sudo apt install tldr
tldr tar
```

*Output esperado:* Una lista limpia con los 5 comandos tar más usados en el mundo real.

---

## Errores Comunes y Troubleshooting

1. **"No manual entry for..." en contenedores Docker o entornos mínimos:** Para ahorrar espacio, las imágenes base de Docker (Ubuntu, Alpine, Debian) eliminan las páginas man.

  > **Solución:** En sistemas Ubuntu/Debian, puedes restaurarlas ejecutando el comando unminimize. En RHEL/AlmaLinux, asegúrate de no tener configurado tsflags=nodocs en /etc/dnf/dnf.conf.

2. **Confundir la sección del manual:** Buscar la sintaxis de un comando de administración y frustrarse porque man 1 no muestra las opciones de configuración avanzada del demonio.

  > **Solución:** Recuerda siempre usar man 8 para servicios/daemons y man 5 para los ficheros .conf.

## Buenas Prácticas

- **Explora /usr/share/doc:** Cuando configures servicios complejos (como un servidor web Nginx, un servidor de correo Postfix o un firewall), ve a /usr/share/doc/nombre-paquete/. Casi todos los desarrolladores incluyen ahí archivos de configuración de ejemplo llamados configuration.example.gz que puedes copiar y adaptar. Te ahorrarán horas de búsqueda en Google.
- **Mantén tldr actualizado:** Los comandos evolucionan. Si usas tldr, acostúmbrate a lanzar tldr --update en tu script de mantenimiento mensual para bajarte los últimos esquemas de la comunidad.
- **Genera tus propios manuales:** En infraestructuras grandes, los Sysadmins Senior escriben scripts y crean pequeños archivos de manual en /usr/local/share/man/man1/ para que los técnicos juniors puedan consultar las herramientas internas de la empresa usando el comando man nativo.

## Resumen del Módulo 1

Has completado el **Módulo 1: Fundamentos y Supervivencia en la CLI**. Ahora sabes qué es Linux, entiendes cómo se organiza su arquitectura y el FHS, eres capaz de manipular y buscar archivos con precisión quirúrgica, y sabes cómo extraer documentación del sistema sin depender de una conexión externa. Estás listo para empezar a gestionar sistemas reales.
