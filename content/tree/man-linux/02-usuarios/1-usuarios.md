# 2.1 Gestión de Usuarios, Grupos y Ficheros Críticos de Cuentas

En Linux, la seguridad y el aislamiento de procesos se basan en la identidad. El sistema no ve nombres de personas o aplicaciones; ve identificadores numéricos. 
Como Sysadmin, gestionar estas identidades de forma segura es el primer paso para proteger la integridad de cualquier infraestructura corporativa.

---

## Introducción

Linux es un sistema operativo multiusuario y multitarea desde su concepción. Esto significa que múltiples usuarios y servicios de fondo (daemons) se ejecutan simultáneamente compartiendo hardware. 
Para evitar que un usuario interfiera con otro, o que un servicio comprometido (como un servidor web) tome el control de la máquina, el sistema implementa fronteras estrictas basadas en usuarios y grupos.

---

## Objetivos de aprendizaje

- Analizar la estructura interna de los ficheros críticos `/etc/passwd`, `/etc/shadow` y `/etc/group`.
- Comprender la asignación de **UID (User ID)** y **GID (Group ID)** y sus rangos profesionales.
- Gestionar identidades mediante comandos nativos en modo lote (low-level y high-level).
- Implementar políticas básicas de caducidad y bloqueo de cuentas.

---

## Conceptos Teóricos

### 1. Los Ficheros Críticos de Identidad

Toda la gestión de usuarios locales se apoya en tres ficheros de texto plano. Si estos ficheros se corrompen o tienen permisos laxos, el sistema entero queda expuesto.

#### A. `/etc/passwd` (Fichero de cuentas de usuario)

A pesar de su nombre, **no contiene contraseñas** (por motivos de seguridad). Contiene la configuración básica de cada cuenta. 
Cada línea representa a un usuario y está dividida en 7 campos separados por dos puntos (`:`):

```text
root:x:0:0:root:/root:/bin/bash
```

1. **Nombre de usuario:** root (Identificador único de texto).
2. **Contraseña:** x (Indica que la contraseña real está cifrada dentro de /etc/shadow).
3. **UID (User ID):** 0 (El número que el Kernel usa para asignar privilegios).
4. **GID (Group ID):** 0 (El grupo principal al que pertenece el usuario).
5. **GECOS / Comentarios:** root (Información del usuario, nombre completo, etc.).
6. **Home Directory:** /root (El directorio personal del usuario al iniciar sesión).
7. **Shell predeterminado:** /bin/bash (El entorno de comandos que se le asigna).

#### B. /etc/shadow (Fichero de contraseñas seguras)

Solo es legible por el superusuario root. Contiene los hashes cifrados de las contraseñas y las políticas de caducidad. Campos clave:

```text
sysadmin:$6$rounds=4096$...:19842:0:90:7:::
```

- **Hash de contraseña:** El segundo campo contiene el método de cifrado (ej: $6$ indica SHA-512) y el hash con su sal (*salt*). Si empieza por ! o *, la cuenta está bloqueada.
- **Parámetros temporales:** Días transcurridos desde 1970 hasta el último cambio, días mínimos/máximos de validez de la contraseña y días de aviso antes de que expire.

#### C. /etc/group (Fichero de definición de grupos)

Estructura los grupos del sistema para permitir la gestión colectiva de accesos:

```text
developers:x:1005:ana,pedro,sysadmin
```

Muestra el nombre del grupo, el GID y los usuarios que pertenecen a él como **grupo secundario o suplementario**.

### 2. Clasificación y Rangos de UIDs

Al crear cuentas, el SysAdmin debe respetar los estándares de la industria para evitar solapamientos:

| Rango de UID | Tipo de Usuario | Propósito |
|---|---|---|
| **0** | **Root** | Superusuario. Privilegios totales directos en el Kernel. |
| **1 - 999** | **System Users** | Cuentas sin login usadas por servicios (ej: nginx, mysql, systemd). |
| **1000+** | **Regular Users** | Usuarios humanos del sistema (empleados, administradores). |

---

## Laboratorio Práctico: Provisión y Bloqueo Corporativo

### Escenario

Debes dar de alta a una nueva ingeniera de sistemas (identificada como developer_ana). Su cuenta debe pertenecer al grupo secundario developers, 
usar la shell bash, y debes forzarla a cambiar su contraseña en su primer inicio de sesión. Además, daremos de alta un servicio automatizado sin acceso a login.

### Paso 1: Creación del Grupo y el Usuario Humano

Usaremos los comandos estándar de administración (man 8).

```bash
# 1. Crear el grupo de trabajo secundario
sudo groupadd developers

# 2. Crear el usuario con su carpeta home, shell especificada y añadirlo al grupo
sudo useradd -m -s /bin/bash -G developers developer_ana

# 3. Asignar una contraseña temporal segura
sudo passwd developer_ana
```

### Paso 2: Forzar Directivas de Seguridad (Password Aging)

Queremos que cambie esa contraseña inmediatamente al loguearse por primera vez:

```bash
sudo chage -d 0 developer_ana
```

*El parámetro -d 0 le dice al sistema que la contraseña cambió por última vez en 1970, por lo que expira de forma inmediata.*

### Paso 3: Crear un Usuario de Sistema (Service Account)

Si despliegas una aplicación propia, nunca debes ejecutarla como root. Necesita su propio usuario de sistema aislado.

```bash
sudo useradd -r -s /usr/sbin/nologin app_monitoreo
```

*El flag -r le asigna automáticamente un UID en el rango de sistema (< 1000) y /usr/sbin/nologin bloquea cualquier intento de inicio de sesión interactivo.*

### Paso 4: Auditoría rápida de la cuenta

Verificamos las identidades y pertenencias a grupos con el comando id:

```bash
id developer_ana
```

*Output esperado: Muestra el UID de Ana, su GID principal (que coincide con su nombre) y su GID secundario (developers).*

---

## Errores Comunes y Troubleshooting

1. **Modificar /etc/passwd o /etc/shadow directamente con un editor:** Si cometes una errata de sintaxis o de espacios usando vim, puedes bloquear el acceso de todos los usuarios al servidor, incluido root.

  > **Solución:** Usa siempre las herramientas de verificación específicas del sistema tras cualquier cambio manual:

```bash
sudo pwck   # Verifica la consistencia de passwd y shadow
sudo grpck  # Verifica la consistencia de los grupos   
```

2. **Eliminar un usuario dejando sus archivos huérfanos:** Si haces useradd y luego userdel usuario, sus archivos en el disco siguen existiendo pero ahora pertenecen a un UID numérico huérfano. Si en el futuro creas otro usuario que herede ese mismo UID, tendrá acceso automático a los archivos antiguos del anterior empleado.

  > **Solución:** Al eliminar un usuario de forma definitiva, usa el flag -r para borrar también su directorio home y sus colas de archivos: sudo userdel -r developer_ana.

---

## Buenas Prácticas

- **Entornos Sin Login:** Asegúrate de que todas las cuentas de servicios tengan asignado /usr/sbin/nologin o /bin/false como shell. Esto mitiga de forma drástica los ataques de ejecución remota de código (RCE).
- **Centralización:** Para infraestructuras de más de 5 servidores, la gestión de usuarios locales (/etc/passwd) se vuelve insostenible. Automatiza esto mediante **Ansible** (Módulo 9) o centraliza las identidades usando soluciones empresariales como **LDAP**, **FreeIPA** o **Active Directory**.
- **Políticas Globales Predeterminadas:** Configura el archivo **/etc/login.defs** para establecer que, por defecto, todas las contraseñas nuevas expiren a los 90 días y requieran una longitud mínima segura.

---

## Resumen

Has dominado el funcionamiento interno de las cuentas y la creación controlada de identidades en Linux. El sistema ya sabe quién es quién. El siguiente paso lógico es definir qué puede hacer cada uno de esos usuarios en el disco duro.