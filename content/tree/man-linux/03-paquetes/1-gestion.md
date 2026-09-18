# 3.1 Gestión de Paquetes y Repositorios: APT y DNF

En los sistemas operativos modernos, instalar software recopilando binarios sueltos de internet es una práctica obsoleta y peligrosa. Linux introdujo hace décadas el concepto de **Gestores de Paquetes** y **Repositorios Centralizados**, un ecosistema que garantiza la autenticidad del software, la resolución automática de dependencias y la actualización masiva y segura de todo el servidor.

---

## Introducción

Para un Sysadmin, la gestión del ciclo de vida del software es una tarea diaria crítica. Ya sea para instalar un servidor web, aplicar parches de seguridad urgentes o auditar qué versiones de software corren en una infraestructura, es indispensable dominar las dos herramientas troncales de la industria: **APT** (la infraestructura de Debian/Ubuntu) y **DNF** (el motor de la familia RHEL/AlmaLinux).

---

## Objetivos de aprendizaje

- Comprender la arquitectura de un sistema de paquetes tradicional y el problema del *Dependency Hell*.
- Dominar la sintaxis de **APT** y **DNF** para operaciones de administración diaria.
- Configurar, añadir y securizar repositorios oficiales y de terceros.
- Gestionar el historial de transacciones y realizar reversiones (*rollbacks*).
- Automatizar la verificación de actualizaciones de seguridad desde la CLI.

---

## Conceptos Teóricos

### 1. ¿Qué es un Paquete y un Repositorio?

- **El Paquete (.deb o .rpm):** Es un archivo comprimido que contiene los binarios del programa, los archivos de configuración por defecto, las páginas de manual y, lo más importante, un archivo de **metadatos** que especifica las dependencias (qué otras librerías necesita para funcionar).
- **El Repositorio:** Es un servidor web o FTP centralizado que almacena miles de estos paquetes junto con un índice firmado digitalmente.

### 2. El "Infierno de las Dependencias" (Dependency Hell)

En sistemas antiguos, si instalabas el paquete A, este te decía que requería la librería B v2.1. Al intentar instalar B, descubrías que requería la librería C. Los gestores de paquetes modernos de alto nivel (**APT/DNF**) solucionan esto interrogando a los índices de los repositorios, calculando el árbol de dependencias completo y descargando todo el conjunto en el orden correcto de forma automatizada.

### 3. Comparativa de Comandos de Alto Nivel

Aunque las arquitecturas internas difieren, las operaciones del día a día son análogas entre ambas familias de distribuciones:

| Operación Profesional | Comando en APT (Debian/Ubuntu) | Comando en DNF (RHEL/AlmaLinux) |
|---|---|---|
| Actualizar los índices de repositorios | sudo apt update | No es necesario (lo hace automáticamente) |
| Actualizar todos los paquetes del sistema | sudo apt upgrade | sudo dnf upgrade |
| Instalar un paquete específico | sudo apt install <paquete> | sudo dnf install <paquete> |
| Eliminar un paquete manteniendo config. | sudo apt remove <paquete> | sudo dnf remove <paquete> |
| Eliminar un paquete y sus configuraciones | sudo apt purge <paquete> | N/A (DNF borra config. por defecto) |
| Buscar un paquete en los repositorios | apt search <término> | dnf search <término> |
| Limpiar la caché local de descargas | sudo apt clean | sudo dnf clean all |

---

## Laboratorio Práctico: Gestión Avanzada de Repositorios y Paquetes

### Escenario

Tienes que desplegar el analizador de rendimiento htop en dos servidores de producción distintos (uno basado en Ubuntu Server 24.04 y otro en AlmaLinux 9). Además, en el servidor Ubuntu necesitas añadir un repositorio externo oficial del equipo de desarrollo de otra herramienta para obtener la última versión estable.

### Paso 1: Instalación Estándar y Limpieza en la Familia Debian/Ubuntu

Nos conectamos al servidor Ubuntu. Antes de instalar, sincronizamos los índices locales con los servidores remotos.

```bash
# 1. Descargar los últimos índices de los repositorios oficiales
sudo apt update

# 2. Instalar la herramienta
sudo apt install -y htop

# 3. Eliminar paquetes que se instalaron como dependencias en el pasado y ya no son necesarios
sudo apt autoremove
```

### Paso 2: Añadir un repositorio PPA (Personal Package Archive) seguro en Ubuntu

Imagina que necesitas la versión de vanguardia de un software que no está en los repositorios nativos de la distribución.

```bash
# Instalar el gestor de propiedades de software si no está presente
sudo apt install -y software-properties-common

# Añadir el repositorio externo firmado (Ejemplo: repositorio del equipo de git)
sudo add-apt-repository -y ppa:git-core/ppa

# El sistema actualiza automáticamente los índices. Ahora podemos actualizar el software
sudo apt install -y git
```

### Paso 3: Instalación y Auditoría de Historial en la Familia RHEL (AlmaLinux/Rocky)

Nos movemos al servidor basado en RHEL. Aquí dnf gestiona de forma nativa un histórico de transacciones muy potente.

```bash
# 1. Instalar htop (DNF buscará e indexará los repositorios de forma dinámica si han expirado)
sudo dnf install -y htop

# 2. Examinar el historial de operaciones realizadas en este servidor
sudo dnf history
```

*Output esperado de dnf history: Una tabla con IDs de transacciones, fechas y acciones realizadas.*

### Paso 4: Realizar un Rollback (Reversión) en DNF

Si tras instalar un paquete o actualización el sistema empieza a fallar, DNF te permite revertir esa transacción exacta al estado anterior.

```bash
# Revertir los cambios provocados por la transacción número 4 (por ejemplo, la instalación de htop)
sudo dnf history undo 4
```

---

## Errores Comunes y Troubleshooting

1. **"Could not get lock /var/lib/dpkg/lock-fronted" (En APT):** Este error ocurre cuando intentas usar apt mientras hay otro proceso utilizándolo en segundo plano (por ejemplo, el actualizador automático del sistema unattended-upgrades).

  > **Solución:** Nunca mates el proceso a la fuerza (kill -9), ya que podrías corromper la base de datos de paquetes. Averigua qué proceso lo retiene usando lsof /var/lib/dpkg/lock-fronted y espera a que termine. Si se ha quedado colgado definitivamente tras horas, reinicia el servidor.

2. **Ignorar las llaves GPG de los repositorios:** Al añadir repositorios de terceros, si no importas su clave pública de seguridad, el sistema se negará a instalar el software lanzando un error de firma inválida.

  > **Solución:** Asegúrate de seguir las instrucciones del proveedor e importar la llave usando gpg --dearmor colocándola en la ruta recomendada moderna: /etc/apt/keyrings/ (en Debian/Ubuntu).

---

## Buenas Prácticas

- **Evita el "FrankenDebian":** Mezclar repositorios de diferentes versiones de distribuciones (por ejemplo, meter repositorios de Ubuntu de una versión más moderna en un Debian estable) romperá la librería central del sistema (glibc). Si necesitas software más moderno, compílalo (Módulo 3.2) o usa contenedores (Módulo 10).
- **Automatiza pero controla los Parches de Seguridad:** En servidores de producción es una buena práctica automatizar la descarga e instalación *exclusiva* de los parches de seguridad críticos.
  - En Ubuntu/Debian instala el paquete unattended-upgrades.
  - En RHEL/AlmaLinux automatiza ejecuciones cron con el flag específico: sudo dnf upgrade --security.
- **Bloqueo de versiones (Hold/Pinning):** Si una aplicación de producción depende críticamente de una versión exacta de un paquete (por ejemplo, una base de datos) y no quieres que se actualice por accidente al lanzar un upgrade general, bloquéala:
  - En APT: sudo apt-mark hold <paquete>
  - En DNF: Instala python3-dnf-plugin-versionlock y ejecuta sudo dnf versionlock add <paquete>.

---

## Resumen

Has dominado el ciclo de vida de las aplicaciones mediante el uso de gestores de paquetes y repositorios controlados, asegurando la consistencia de tu software. Sin embargo, ¿qué ocurre cuando el software que exige tu infraestructura no existe en ningún repositorio o requiere una optimización a medida que solo se consigue alterando su código fuente?