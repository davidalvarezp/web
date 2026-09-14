# 2.2 Permisos de Archivos: chmod, chown y Modos Especiales (SUID, SGID, Sticky Bit)

Si la gestión de usuarios define *quién* es una identidad en el sistema, la matriz de permisos determina *qué* acciones exactas puede realizar esa identidad sobre los recursos del disco duro. En Linux, la seguridad a nivel de sistema de archivos es estricta, predecible y altamente eficiente.

---

## Introducción

Cada archivo y directorio en Linux pertenece a un **usuario propietario** y a un **grupo propietario**. A partir de ahí, el Kernel evalúa los accesos basándose en una estructura de tres capas: Dueño, Grupo y Otros (el resto del mundo). Como Sysadmin, dominar esta lógica y sus modos avanzados es crítico para evitar fugas de información o escaladas de privilegios no autorizadas.

---

## Objetivos de aprendizaje

- Descifrar la salida de `ls -l` y entender la representación simbólica y octal de los permisos.
- Comprender el impacto diferencial de los permisos `rwx` en archivos frente a directorios.
- Cambiar propiedades y accesos con `chown`, `chgrp` y `chmod`.
- Dominar e implementar los permisos especiales: **SUID**, **SGID** y **Sticky Bit**.

---

## Conceptos Teóricos

### 1. La Matriz de Permisos Básicos (UGO)

Los permisos se dividen en tres tripletas asignadas a: **U**ser (Dueño), **G**roup (Grupo) y **O**thers (Otros). Cada tripleta puede combinar tres derechos fundamentales:

-   **r (Read / Lectura):** Valor numérico **4**.
-   **w (Write / Escritura):** Valor numérico **2**.
-   **x (Execute / Ejecución):** Valor numérico **1**.

La suma de estos valores define el acceso en **modo octal**. Por ejemplo, un permiso `rwx` suma $4+2+1 = 7$.

#### Diferencia crucial: Archivos vs. Directorios

Un error muy común de nivel junior es pensar que un permiso significa lo mismo para un archivo que para una carpeta:

| Permiso | En un Archivo | En un Directorio |
| :--- | :--- | :--- |
| **r (Lectura)** | Ver el contenido del archivo (ej. con `cat`). | Listar los archivos que contiene (ej. con `ls`). |
| **w (Escritura)** | Modificar el contenido del archivo. | Crear, renombrar o **borrar** archivos dentro de él. |
| **x (Ejecución)** | Ejecutar el archivo como un programa/script. | **Entrar** al directorio (ej. con `cd`) y acceder a sus metadatos. |

!!! warning "¡Peligro con la escritura en directorios!"
    Si un usuario tiene permiso de escritura (`w`) en un directorio, **puede borrar cualquier archivo dentro de él**, incluso si no es el dueño de ese archivo y no tiene permisos sobre el archivo en sí.

### 2. Permisos Especiales (Nivel Avanzado)

Para escenarios corporativos complejos, los permisos estándar se quedan cortos. Linux introduce tres bits adicionales:

#### A. SUID (Set User ID - Valor 4000)

Aplicado a **archivos ejecutables**. Cuando un usuario ejecuta este archivo, el proceso no se ejecuta con los privilegios del usuario, sino con los del **dueño del archivo** (habitualmente `root`).

-   *Ejemplo real:* El comando `passwd` (para cambiar contraseñas) tiene el bit SUID activo porque necesita modificar el archivo `/etc/shadow`, el cual solo es accesible por root.
-   *Representación:* Aparece como una `s` en la posición de ejecución del dueño (ej: `-rwsr-xr-x`).

#### B. SGID (Set Group ID - Valor 2000)

-   **En ejecutables:** El proceso se ejecuta con los privilegios del grupo propietario del archivo.
-   **En directorios (Muy usado):** Cualquier archivo o carpeta que se cree dentro de este directorio **heredará automáticamente el grupo propietario del directorio padre**, ignorando el grupo principal del usuario que lo creó. Es vital para carpetas compartidas entre equipos de trabajo.
-   *Representación:* Aparece como una `s` en la posición de ejecución del grupo (ej: `drwxrwsr-x`).

#### C. Sticky Bit (Bit de Permanencia - Valor 1000)

Aplicado a **directorios**. Garantiza que **solo el propietario de un archivo pueda borrarlo o renombrarlo**, a pesar de que otros usuarios tengan permisos de escritura en ese directorio.

-   *Ejemplo real:* El directorio temporal `/tmp` tiene este bit para evitar que un usuario borre los archivos temporales de otro.
-   *Representación:* Aparece como una `t` al final de la cadena de permisos (ej: `drwxrwxrwt`).

---

## Laboratorio Práctico: Configuración de un Directorio Compartido Profesional

### Escenario

El equipo de desarrollo necesita un directorio común en `/srv/shared_dev`. Se requieren las siguientes directivas de producción:

1. Todos los miembros del grupo `developers` deben poder crear y modificar archivos allí.
2. Todo archivo nuevo debe pertenecer automáticamente al grupo `developers` (SGID).
3. Ningún desarrollador debe poder borrar o modificar los archivos de un compañero (Sticky Bit).

### Paso 1: Creación y asignación de propiedades

Creamos la estructura y nos aseguramos de que pertenezca al grupo correcto.

```bash
# Crear el directorio
sudo mkdir -p /srv/shared_dev

# Cambiar el propietario a root y el grupo a developers
sudo chown root:developers /srv/srv/shared_dev
```

### Paso 2: Aplicación de la matriz de permisos avanzada

Usaremos el modo octal combinando los permisos especiales (2000 \text{ (SGID)} + 1000 \text{ (Sticky Bit)} = 3000). Los accesos estándar serán 770 (Todo para root y el grupo, nada para el resto).

```bash
# Aplicar permisos: Especiales (3) + Dueño (7) + Grupo (7) + Otros (0)
sudo chmod 3770 /srv/shared_dev
```

### Paso 3: Verificación del Laboratorio

Analizamos el resultado con un listado detallado:

```bash
ls -ld /srv/shared_dev
```

*Output esperado:*
```text
drwxrws--t 2 root developers 4096 may 18 08:30 /srv/shared_dev
```

Observemos la s en el grupo (SGID activo) y la t al final (Sticky Bit activo).

---

## Errores Comunes y Troubleshooting

1. **La falacia del chmod 777:** Cuando algo no funciona (un script, un servidor web), la tentación junior es aplicar chmod -R 777. Esto es un fallo crítico de seguridad que permite a cualquier usuario o servicio local (incluso comprometido) inyectar código o destruir datos.

  > **Solución:** Identifica qué usuario corre el servicio (ej. www-data para Nginx) y cambia el propietario del archivo con chown en lugar de abrir los permisos a todo el mundo.

2. **"Permission Denied" al entrar en una carpeta con permisos de lectura:** Un usuario tiene permisos r-- en un directorio pero al hacer cd recibe un error.

  > **Solución:** Para poder entrar en una carpeta y leer sus archivos, el directorio necesita obligatoriamente el permiso de ejecución (x). Aplica chmod +x directorio.

3. **SUID en scripts de Bash:** Intentar poner el bit SUID a un script .sh no funcionará en la mayoría de distros modernas por motivos de seguridad del Kernel.

  > **Solución:** Si un script requiere privilegios de root, la vía correcta y segura es mapearlo en el archivo /etc/sudoers (lo veremos en el Módulo 2.4).

---

## Buenas Prácticas

- **Principio de Menor Privilegio:** Los archivos deben tener la configuración más restrictiva posible que les permita funcionar. Por defecto, los archivos de configuración no deberían tener más de 640 o 600.
- **Usa el flag --reference para clonar permisos:** Si tienes un archivo que funciona perfectamente en producción y quieres replicar exactamente sus propietarios y permisos en uno nuevo, usa:
  ```bash
  sudo chmod --reference=archivo_ok.conf archivo_nuevo.conf
  sudo chown --reference=archivo_ok.conf archivo_nuevo.conf
  ```
- **Audita los archivos SUID periódicamente:** Un atacante que consiga acceso raíz temporal intentará dejar un binario con SUID activo para volver a escalar privilegios en el futuro. Búscalos con find:
  ```bash
  find / -perm /4000 -type f 2>/dev/null
  ```

---

## Resumen

Has dominado el núcleo del sistema de permisos tradicional de Linux (POSIX). Sin embargo, este modelo de tres capas (Dueño-Grupo-Otros) a veces se queda corto si necesitas dar permisos a un segundo grupo o a un usuario específico sin cambiar el propietario.