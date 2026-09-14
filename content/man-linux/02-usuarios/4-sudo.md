# 2.4 Escalada de Privilegios: Configuración Segura de sudo y el Fichero /etc/sudoers

En un entorno corporativo, compartir la contraseña del superusuario `root` es un pecado capital contra la seguridad y la trazabilidad. La herramienta **`sudo` (superuser do)** es el mecanismo estándar en Linux para delegar privilegios administrativos de forma controlada, granular y totalmente auditable.

---

## Introducción

El principio de menor privilegio dicta que ningún usuario o proceso debe tener más poder del estrictamente necesario para realizar su función. Si un técnico de soporte solo necesita reiniciar el servidor web, darle acceso completo como `root` es un riesgo inaceptable. `sudo` permite al Sysadmin definir con precisión quirúrgica qué comandos específicos puede ejecutar un usuario (o grupo de usuarios), en qué máquinas y bajo la identidad de qué otra cuenta, registrando cada acción en los logs del sistema.

---

## Objetivos de aprendizaje

- Comprender la diferencia arquitectónica entre `su` y `sudo`.
- Operar de forma segura sobre el fichero de configuración utilizando `visudo`.
- Desglosar y dominar la sintaxis de las directivas en **/etc/sudoers**.
- Diseñar políticas de escalada basadas en alias (User, Host, Runas y Cmnd).
- Configurar excepciones seguras de contraseña (`NOPASSWD`) para tareas de automatización.
- Evitar vulnerabilidades de escalada inversa provocadas por malas configuraciones.

---

## Conceptos Teóricos

### 1. La batalla del control: `su` vs. `sudo`

-   **`su` (Switch User):** Cambia la identidad de la shell actual. Si se ejecuta a secas (`su -`), solicita la **contraseña de root**. Si se comparte, no hay forma de saber qué persona física ejecutó un comando destructivo, ya que en los logs solo aparecerá el usuario `root`.
-   **`sudo` (Superuser Do):** Ejecuta un único comando con privilegios elevados utilizando la **contraseña del propio usuario**. Esto garantiza el "no repudio": sabemos exactamente qué usuario del sistema solicitó la elevación.

### 2. Anatomía de una Directiva en `/etc/sudoers`

La sintaxis de este fichero es famosa por parecer críptica al principio, pero sigue una estructura lógica estricta. Analicemos la línea predeterminada por excelencia:
```text
root    ALL=(ALL:ALL) ALL
```

La regla se lee de izquierda a derecha siguiendo este esquema:

1. **User:** root \rightarrow ¿Quién solicita la elevación? (Puede ser un usuario o un %grupo).
2. **Host:** ALL \rightarrow ¿Desde qué máquina se permite? (Útil si el fichero se comparte por red mediante LDAP, en local siempre es ALL).
3. **RunAs (User:Group):** (ALL:ALL) \rightarrow ¿Bajo la identidad de quién se ejecutará el comando? El primer ALL es el usuario (usualmente root) y el segundo el grupo.
4. **Command:** ALL \rightarrow ¿Qué binarios o scripts específicos se le permite ejecutar? (Debe especificarse con la **ruta absoluta**).

### 3. El Poder de los Alias (Organización Corporativa)

Para evitar que el fichero /etc/sudoers se vuelva ilegible, se agrupan los elementos mediante alias:

- User_Alias: Agrupa cuentas de usuarios humanos (ej: User_Alias SOPORTE = juan, maria).
- Cmnd_Alias: Agrupa rutas absolutas de comandos prohibidos o permitidos (ej: Cmnd_Alias RED = /usr/sbin/ip, /usr/sbin/nftables).

---

## Laboratorio Práctico: Delegación de Privilegios para un Equipo de Operaciones

### Escenario

Disponemos de un grupo en el sistema llamado %net_operators. Necesitamos configurar el servidor para que cualquier miembro de este grupo pueda:

1. Ver y reiniciar el servicio de red (NetworkManager) usando systemctl.
2. Ejecutar el sniffer de red tcpdump para diagnosticar tráfico, pero **sin que el sistema les pida su contraseña** (requerido para scripts de monitorización rápidos).
3. No deben poder ejecutar ningún otro comando como root.

### Paso 1: Crear el entorno de pruebas

Aseguramos la existencia del grupo y añadimos a un técnico de pruebas.

```bash
sudo groupadd net_operators
sudo useradd -m -s /bin/bash -G net_operators tecnico_redes
sudo passwd tecnico_redes
```

### Paso 2: Editar de forma segura con visudo

!!! danger "Regla de oro del Sysadmin"
    **NUNCA** abras /etc/sudoers directamente con nano o vim. Si cometes un error sintáctico, el comando sudo se romperá por completo y te quedarás fuera del sistema sin privilegios. Usa siempre sudo visudo. Este comando abre un editor temporal y, al guardar, valida la sintaxis. Si hay un error, te avisará y te impedirá guardar.

Lanzamos el editor seguro:

```bash
sudo visudo
```

### Paso 3: Implementar la lógica de Alias y Permisos

Desplázate hasta el final del archivo y añade las siguientes líneas limpias:

```text
# 1. Definición de Alias de Comandos
Cmnd_Alias NET_SERVICES = /usr/bin/systemctl restart NetworkManager, /usr/bin/systemctl status NetworkManager
Cmnd_Alias NET_TOOLS = /usr/sbin/tcpdump

# 2. Asignación de permisos al grupo (Mantenemos contraseña para los servicios)
%net_operators ALL=(root) NET_SERVICES

# 3. Asignación con exención de contraseña para herramientas de diagnóstico
%net_operators ALL=(root) NOPASSWD: NET_TOOLS
```

Guarda y cierra el editor (si usas el visudo por defecto de Ubuntu/Debian que abre nano, guarda con Ctrl+O y sal con Ctrl+X).

### Paso 4: Validar el entorno como el usuario delegado

Cambiamos de sesión a nuestro técnico para comprobar que la seguridad funciona:

```bash
# Cambiar al usuario de pruebas
su - tecnico_redes

# Comprobar qué poderes de sudo tenemos asignados
sudo -l
```

*El flag sudo -l (list) es la herramienta de auditoría que muestra al usuario sus privilegios efectivos reales.*

Prueba ahora a ejecutar un comando con contraseña y el otro sin ella:

```bash
# Solicitará la contraseña de tecnico_redes
sudo systemctl restart NetworkManager

# Se ejecutará instantáneamente sin pedir credenciales
sudo tcpdump -i eth0 -c 5
```

---

## Errores Comunes y Troubleshooting (Vulnerabilidades de Escalada Inversa)

1. **La trampa de dar sudo a binarios interactivos:** Si configuras una línea en sudoers que permite a un usuario ejecutar sudo vim /etc/exports o sudo less /var/log/syslog, has comprometido el servidor por completo.

  **El motivo:** Tanto vim como less permiten abrir una shell interactiva desde su interior (ej: si pulsas : y luego escribes !bash dentro de vim, abrirá una consola). Como el programa padre corría como root, esa nueva consola será **una terminal de root con acceso total**.

  > **Solución:** Usa herramientas específicas de edición controlada como sudoedit en lugar de dar acceso directo al editor de texto.

2. **Romper el archivo /etc/sudoers por saltarse visudo:** Si el archivo se corrompe por una edición descuidada, cualquier intento de hacer sudo devolverá un error de sintaxis y bloqueará la elevación.

  > **Solución:** No entres en pánico. Si tienes acceso físico o mediante hipervisor, puedes resolverlo si la herramienta pkexec (PolicyKit) está instalada ejecutando:

```bash
pkexec visudo 
```

  > Si esto falla, tendrás que reiniciar el servidor, entrar en **Modo Single User (Grub single)** modificando los parámetros de arranque del Kernel para montar el sistema de archivos en lectura/escritura (rw init=/bin/bash) y reparar el fichero a mano.

---

## Buenas Prácticas

- **Utiliza el directorio /etc/sudoers.d/:** En lugar de engrosar el archivo principal /etc/sudoers, las distribuciones modernas permiten crear archivos independientes dentro de la carpeta sudoers.d/. Crea un archivo por cada necesidad corporativa (ej: /etc/sudoers.d/developers o /etc/sudoers.d/monitoring). Esto mantiene el sistema modular y limpio.
- **Mantén las directivas NOPASSWD al mínimo absoluto:** Solo debes usar NOPASSWD para scripts automatizados específicos (como agentes de monitorización Zabbix/Prometheus o playbooks de Ansible) que requieran ejecutar un binario muy concreto. Nunca lo uses para bloques genéricos de comandos.
- **Audita los logs de sudo:** Cada vez que un usuario ejecuta algo mediante sudo, el evento queda registrado. Acostúmbrate a revisar periódicamente dónde se centralizan estos eventos para detectar intentos de uso no autorizados:
  - En familias Debian/Ubuntu: **/var/log/auth.log**
  - En familias RHEL/AlmaLinux: **/var/log/secure**

---

## Resumen del Módulo 2
Has finalizado por completo el **Módulo 2: Administración de Usuarios y Permisos**. Ahora posees un conocimiento profundo y profesional sobre cómo gestionar el ciclo de vida de las identidades locales, proteger los recursos del almacenamiento mediante la matriz tradicional POSIX y las listas de control de acceso extendidas (ACLs), y delegar la autoridad del sistema de forma segura mediante sudo.
