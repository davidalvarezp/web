---
title: "Guía Avanzada de Hardening en Linux"
slug: "hardening-linux-avanzado"
date: 2025-11-27
lastmod: 2025-12-02
draft: false
author: "davidalvarezp"
authorLink: "https://davidalvarezp.com"
description: "Guía técnica avanzada para sysadmins y profesionales de ciberseguridad sobre hardening en Linux: kernel, red, cifrado, contenedores, auditoría, automatización y buenas prácticas."
images: [hardening_linux_avanzado.webp]
resources:
- name: "hardening-linux-avanzado"
  src: "hardening_linux_avanzado.webp"

tags: [
"Linux",
"Hardening",
"Ciberseguridad",
"Sysadmin",
"Kernel",
"DevSecOps",
"Seguridad",
"Infraestructura",
"Auditoría",
"Contenedores"
]
categories: [
"CyberSec",
"SysAdmin",
]

lightgallery: true

---

# Guía Avanzada de Hardening en Linux para SysAdmins


## Índice

- **1. Introducción**
- **2. Principios Estratégicos de Hardening**
  - 2.1 Principio de mínima exposición
  - 2.2 Principio de mínimo privilegio
  - 2.3 Principio de separación
  - 2.4 Defense-in-Depth (Defensa en profundidad)

- **3. Preparación del Sistema y Minimización**
  - 3.1 Selección de políticas y marco normativo (SELinux, AppArmor, CIS)
  - 3.2 Minimización de paquetes y eliminación de componentes innecesarios
  - 3.3 Control de binarios SUID y reemplazo por Linux Capabilities
  - 3.4 Control de módulos del kernel: blacklisting y firmas

- **4. Endurecimiento del Kernel**
  - 4.1 Configuración Sysctl avanzada para seguridad
  - 4.2 Protección de memoria: ASLR, NX, Stack Protector
  - 4.3 Kernel Lockdown Mode
  - 4.4 MAC obligatorio: SELinux, AppArmor, Landlock

- **5. Hardening de Servicios Críticos**
  - 5.1 OpenSSH: configuración avanzada y aislamiento con systemd
  - 5.2 Servidores Web (Nginx/Apache): TLS, headers, sandboxing
  - 5.3 Bases de Datos: aislamiento, cifrado, auditoría

- **6. Seguridad del Filesystem**
  - 6.1 Opciones de montaje críticas: `noexec`, `nosuid`, `nodev`
  - 6.2 Protección de `/boot`: partición dedicada, solo lectura
  - 6.3 Inmutabilidad con `chattr` para archivos críticos
  - 6.4 Control de permisos y ACLs avanzadas

- **7. Cifrado y Gestión Criptográfica**
  - 7.1 Cifrado de disco completo con LUKS2 y TPM
  - 7.2 Cifrado a nivel de archivos con `fscrypt`
  - 7.3 Gestión de claves: HSM, TPM 2.0, Vaults
  - 7.4 Rotación automática y políticas criptográficas

- **8. Seguridad de Kernel y Módulos**
  - 8.1 Bloqueo de carga de módulos no autorizados
  - 8.2 Parámetros Sysctl específicos para protección del kernel
  - 8.3 Protección del stack y heap: ASLR, PIE, NX
  - 8.4 Validación de firmas de módulos

- **9. Hardering de Servicios y Demonios**
  - 9.1 Eliminación de servicios innecesarios
  - 9.2 Sandboxing con Systemd: namespaces, capabilities
  - 9.3 Limitación de capacidades Linux por servicio
  - 9.4 Protección contra fork bombs y DoS

- **10. Seguridad en Red**
  - 10.1 Firewall avanzado: `nftables`, `iptables`
  - 10.2 Filtrado de puertos y protección anti-spoofing
  - 10.3 IDS/IPS: Suricata, Zeek, Snort
  - 10.4 Segmentación: VLANs, network namespaces

- **11. Contenedores y Virtualización**
  - 11.1 Hardening de Docker: rootless, seccomp, AppArmor
  - 11.2 Kubernetes: RBAC, Network Policies, Pod Security
  - 11.3 Virtualización (KVM/QEMU): aislamiento, dispositivos seguros

- **12. Logs, Auditoría y Detección**
  - 12.1 `auditd`: reglas esenciales y monitoreo continuo
  - 12.2 `journald`: retención y envío remoto seguro
  - 12.3 SIEM: Graylog, ELK, Wazuh
  - 12.4 Detección de anomalías y correlación

- **13. Automatización del Hardening**
  - 13.1 Ansible: roles para hardening CIS y custom
  - 13.2 Terraform + Ansible para infraestructura como código
  - 13.3 Puppet/SaltStack: configuración declarativa
  - 13.4 Pipelines DevSecOps

- **14. Monitorización Continua**
  - 14.1 Detección continua: Wazuh, OSSEC, Falco
  - 14.2 Supervisión del estado del sistema
  - 14.3 Alertas y respuesta automatizada
  - 14.4 Dashboards de seguridad (Grafana)

- **15. Checklist Avanzado de Hardening**
  - Lista exhaustiva de verificación (50+ puntos)
  - Categorías: sistema, red, kernel, servicios, contenedores
  - Frecuencia de revisión y validación

- **16. Conclusión**

---

## 1. Introducción

El hardening en Linux es un proceso esencial dentro de la administración moderna de sistemas, ya que los entornos actuales presentan un nivel de complejidad y exposición muy superior al de hace apenas unos años. Los sistemas Linux se ejecutan hoy en una enorme variedad de escenarios: servidores bare-metal, máquinas virtuales, contenedores, entornos multi‑tenant, plataformas cloud, edge computing y dispositivos IoT industriales. Esta diversidad amplía la superficie de ataque y exige medidas de seguridad mucho más estrictas y controladas.

El propósito de este documento es proporcionar una guía exhaustiva orientada a profesionales de alto nivel —especialistas en sistemas, ciberseguridad, DevOps y equipos de infraestructura— con el objetivo de establecer un conjunto de buenas prácticas avanzadas de hardening en Linux. El enfoque es profundamente técnico y pretende servir como referencia práctica para entornos reales de producción.

A lo largo de esta guía se profundiza en:

- endurecimiento del sistema base  
- reducción extrema de superficie de ataque  
- mecanismos avanzados de restricción de privilegios  
- seguridad del kernel y memoria  
- protección de servicios críticos  
- políticas de control de acceso  
- auditoría, registro y seguimiento  
- automatización en pipelines DevSecOps

Aunque el hardening es a menudo percibido como una actividad puntual durante el despliegue inicial de un servidor, la realidad es que se trata de un proceso continuo. Las amenazas cambian, los vectores de ataque evolucionan y las configuraciones se erosionan con el tiempo. Por ello, el hardening debe integrarse en el ciclo de vida completo del sistema: diseño, despliegue, mantenimiento, auditoría, respuesta a incidentes y retirada.

Una postura de seguridad sólida requiere una combinación de buenas prácticas, herramientas, configuraciones, mecanismos de control y mentalidad defensiva. Ninguna técnica aislada basta por sí sola; es la suma de capas, controles y políticas lo que proporciona resiliencia.

---

## 2. Principios Estratégicos de Hardening

El hardening eficaz debe fundamentarse en un conjunto de principios estratégicos que orientan todas las decisiones de diseño, configuración y operación. Estos principios no solo aplican a Linux, sino a cualquier plataforma de seguridad moderna.

### 2.1 Principio de mínima exposición

Este principio establece que cualquier componente, recurso, servicio o binario del sistema debe estar presente únicamente si cumple una función estrictamente necesaria. La exposición innecesaria es uno de los principales factores de riesgo.

Un sistema con menos paquetes, menos binarios disponibles, menos servicios escuchando en puertos abiertos y menos módulos cargados es inherentemente más seguro. La minimización reduce posibilidades de explotación y facilita auditorías de integridad.

### 2.2 Principio de mínimo privilegio

Cada proceso debe ejecutar con el nivel mínimo de privilegio necesario para realizar su función. Esto implica:

- eliminar permisos SUID innecesarios  
- reemplazar privilegios elevados por capacidades granulares  
- aislar procesos con mecanismos de sandboxing  
- restringir cuentas de servicio de forma estricta  
- definir roles y políticas de acceso muy ajustadas  

El objetivo es impedir que la explotación de un servicio derive automáticamente en el control total del sistema.

### 2.3 Principio de separación

La separación es un mecanismo clave para limitar el impacto de ataques. Se consigue mediante:

- separación de usuarios y grupos  
- separación de redes y segmentos  
- separación de servicios en contenedores o namespaces  
- separación del sistema operativo del runtime de aplicaciones  
- separación de permisos mediante SELinux/AppArmor  

Cuando los límites entre procesos son claros, un fallo de seguridad en un componente no implica comprometer todo el sistema.

### 2.4 Defense-in-Depth (Defensa en profundidad)

Este principio implica que siempre deben existir varias capas de defensa. No se puede confiar en un único mecanismo, porque:

- puede fallar  
- puede ser mal configurado  
- puede verse superado por nuevos vectores de ataque  

Capas de defensa pueden ser firewall, controles de acceso, auditorías, restricciones del kernel, cifrado, sandboxes, sistemas de integridad, etc.

El hardening efectivo incorpora múltiples barreras para evitar que un atacante pueda escalar fácilmente.

---

## 3. Preparación del Sistema y Minimización

Antes de aplicar cualquier medida avanzada, es imprescindible preparar el sistema base. La preparación incluye seleccionar el marco normativo adecuado, reducir paquetes instalados, controlar binarios privilegiados y gestionar los módulos del kernel. Cuanta menos superficie de ataque exista, más eficaz será el resto del hardening.

### 3.1 Selección de políticas y marco normativo

Cada organización puede basarse en diferentes normas o guías. Algunas de las más comunes:

- **SELinux**: ideal en entornos RHEL, Rocky Linux, AlmaLinux y Fedora. Proporciona un control obligatorio muy granular.  
- **AppArmor**: ampliamente adoptado por Ubuntu. Sencillo, eficaz y con perfiles predefinidos.  
- **Landlock**: disponible en kernels 5.13 y superiores, permite sandbox en espacio de usuario.  
- **CIS Benchmarks**: ofrecen recomendaciones ampliamente reconocidas para entornos Linux.  
- **ENS, NIST, ISO 27001**: marcos que pueden exigir determinadas configuraciones regulatorias.  

Definir un marco antes de empezar evita inconsistencias en la configuración y permite auditorías más eficaces.

### 3.2 Minimización de paquetes

Eliminar componentes innecesarios reduce riesgos. Recomendaciones:

- evitar compiladores (`gcc`, `clang`) si el servidor no compila código  
- desinstalar herramientas de depuración (`gdb`, `strace`) en entornos sensibles  
- retirar shells no utilizados (`zsh`, `csh`)  
- eliminar demonios antiguos: `telnet`, `rsh`, `tftp`, `talk`, `finger`  
- evitar interfaz gráfica en servidores  
- eliminar drivers de hardware no presentes  

Ejemplo para listar paquetes instalados:

```bash
rpm -qa | sort
apt list --installed
```

El objetivo es que solo exista software con propósito claro.

### 3.3 Control de SUID y capacidades

Los binarios SUID pueden representar un riesgo enorme porque se ejecutan con permisos de root. Deben revisarse periódicamente:

```bash
find / -type f -perm -4000 2>/dev/null
```

En muchos casos, es posible reemplazar SUID por Linux Capabilities.

Ejemplo: eliminar SUID de `ping` y asignar solo CAP_NET_RAW:

```bash
chmod u-s /usr/bin/ping
setcap cap_net_raw+p /usr/bin/ping
```

Este enfoque reduce el potencial de escalación de privilegios.

### 3.4 Control de módulos del kernel

Los módulos son piezas de código cargables dinámicamente en el kernel. Evitar que se carguen módulos no autorizados es fundamental.

Recomendaciones:

- realizar un **blacklist** de módulos no utilizados  
- habilitar **firma obligatoria** de módulos (`module.sig_enforce=1`)  
- en entornos críticos, deshabilitar completamente la carga dinámica  
- crear un kernel personalizado con solo el soporte necesario  

Ejemplo de blacklist:

```bash
echo "blacklist firewire-core" > /etc/modprobe.d/blacklist-firewire.conf
```

---

## 4. Endurecimiento del Kernel

El kernel es la base de la seguridad del sistema operativo. Configurar adecuadamente sus parámetros y proteger la memoria y operaciones internas del mismo es esencial para evitar escalaciones de privilegios, filtración de información y explotación de vulnerabilidades.

### 4.1 Configuración Sysctl Avanzada

Los parámetros del kernel controlan gran parte del comportamiento del sistema. Se recomienda crear un archivo:

`/etc/sysctl.d/99-hardening.conf`

con ajustes como:

```bash
# Anti-spoofing
net.ipv4.conf.all.rp_filter = 1

# Deshabilitar source routing
net.ipv4.conf.all.accept_source_route = 0

# Bloquear redirecciones ICMP
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Fortalecer ASLR
kernel.randomize_va_space = 2

# Restringir dmesg
kernel.dmesg_restrict = 1

# Restringir ptrace
kernel.yama.ptrace_scope = 1
```

Estos ajustes endurecen el stack de red, mejoran privacidad y dificultan la explotación de vulnerabilidades.

### 4.2 Protección de Memoria

Medidas esenciales:

- **ASLR activado y en modo fuerte**  
- **NX (No-Execute)** para prevenir ejecución de código en memoria no autorizada  
- **Stack protector** (`-fstack-protector-strong`)  
- **Fortify Source** para prevenir vulnerabilidades en funciones inseguras  
- **SLAB freelist randomization**  

Todas estas medidas dificultan ataques como buffer overflows o ROP.

### 4.3 Kernel Lockdown Mode

 Disponible desde Linux 5.x, especialmente en sistemas con Secure Boot.

Modos disponibles:

- **Integrity**: evita modificaciones del kernel.  
- **Confidentiality**: evita lectura interna del kernel.  

Se habilita añadiendo:

```
lockdown=confidentiality
```

en el cargador de arranque.

### 4.4 MAC obligatorio: SELinux, AppArmor y Landlock

Implementar un mecanismo MAC (Mandatory Access Control) es crítico:

- **SELinux**: extremadamente robusto, orientado a entornos empresariales.  
- **AppArmor**: fácil de configurar y mantener.  
- **Landlock**: sandbox moderno, orientado a aplicaciones.  

Ejemplo para ver perfiles AppArmor activos:

```bash
aa-status
```

---

## 5. Hardening de Servicios Críticos

Los servicios críticos son las puertas de entrada más comunes para atacantes. Su endurecimiento es fundamental para reducir la probabilidad de explotación y para reforzar la postura de seguridad general del servidor.

### 5.1 OpenSSH

OpenSSH suele ser el principal punto de acceso administrativo, por lo que requiere una configuración extremadamente cuidada.

Configuración recomendada en `/etc/ssh/sshd_config`:

```bash
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers admin devops
ClientAliveInterval 300
LoginGraceTime 20

KexAlgorithms sntrup761x25519-sha512@openssh.com
Ciphers chacha20-poly1305@openssh.com
MACs hmac-sha2-512-etm@openssh.com
```

Aislamiento con systemd:

```ini
[Service]
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
NoNewPrivileges=yes
```

Limitar intentos mediante rate-limit:

```bash
systemctl edit sshd
```

Y en el override:

```ini
[Unit]
StartLimitIntervalSec=60
StartLimitBurst=4
```

### 5.2 Servidores Web

Para Apache, Nginx o Caddy, las recomendaciones incluyen:

- deshabilitar módulos innecesarios  
- activar TLS 1.3 y deshabilitar 1.0/1.1  
- aislamiento del servicio mediante systemd o contenedores ligeros  
- cabeceras de seguridad (CSP, HSTS, X-Frame-Options, Referrer-Policy)  
- ejecución bajo una cuenta dedicada  
- acceso a logs restringido  
- borrar información sensible en banners del servidor  

Ejemplo Nginx:

```bash
server_tokens off;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
```

### 5.3 Bases de Datos

Las bases de datos requieren un nivel especial de protección.

Buenas prácticas:

- evitar acceso por red si es posible, usar sockets UNIX  
- separar usuario del sistema del usuario de la base de datos  
- cifrar tablespaces con LUKS/fscrypt  
- rotación de credenciales automática  
- activar auditoría (PostgreSQL: pgaudit, MariaDB audit plugin)  
- limitar comandos peligrosos  
- bloquear acceso remoto excepto desde hosts explícitos  

Ejemplo PostgreSQL `pg_hba.conf`:

```
local all all peer
host  all all 192.168.10.0/24 scram-sha-256
```

---

# 6. Seguridad del Filesystem

La seguridad del filesystem es una de las capas más subestimadas dentro del hardening. A pesar de ello, continúa siendo uno de los vectores más explotados en intrusiones reales: permisos mal configurados, puntos de montaje expuestos, archivos sensibles accesibles y falta de políticas de inmutabilidad son fallos extremadamente comunes. Esta sección profundiza en cómo blindar la capa de almacenamiento para reducir riesgos de escalada de privilegios, ejecución de código no autorizado y manipulación de archivos críticos.

## 6.1 Opciones de montaje esenciales para reducir superficie de ataque

La elección correcta de opciones de montaje en Linux es uno de los elementos de control más simples y efectivos. Estas opciones evitan ejecuciones no autorizadas, uso indebido de SUID y presencia de dispositivos especiales en lugares indebidos.

### noexec
 Impide ejecutar binarios ubicados en el punto de montaje.

Usos recomendados:
- /tmp
- /var/tmp
- /home
- sistemas montados desde red (NFS, CIFS)
- particiones externas

Ejemplo de /etc/fstab:
 .tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev 0 0 .

### nosuid
 Evita el uso de bits SUID/SGID, bloqueando escaladas de privilegio basadas en binarios manipulados.

Aplicación ideal:
- directorios accesibles a usuarios no confiables
- particiones compartidas en entornos multi-tenant
- contenedores y máquinas virtuales

### nodev
 Prohíbe la presencia de dispositivos especiales en el punto de montaje.

Fundamental para:
- /home
- /srv
- /tmp
- sistemas de archivos no confiables

Esto evita que un atacante cree nodos de dispositivo que le permitan acceder directamente a hardware o pseudo-dispositivos.

## 6.2 Protección de /boot

/boot es uno de los directorios más sensibles: contiene el kernel, el initramfs, el cargador de arranque y la firma del kernel. Manipulaciones aquí permiten implantar rootkits persistentes prácticamente indetectables.

### Separación en una partición dedicada
Permite aplicar montajes específicos sin afectar al resto del sistema:
 . UUID=xxxx /boot ext4 ro,nodev,nosuid,noexec 0 2 .

### Montaje en sólo lectura (ro)
 Garantiza que ningún proceso pueda modificar el kernel o el initramfs a menos que el administrador lo remonte manualmente.

### Secure Boot y firma del kernel
 Recomendado si se utiliza UEFI.

- Habilitar Secure Boot en BIOS
- Usar kernels firmados
- Deshabilitar módulos que no estén firmados

 Esto reduce enormemente la posibilidad de bootkits o cargas maliciosas durante el arranque.

## 6.3 Inmutabilidad con chattr

 chattr +i marca archivos como inmutables:

### Archivos recomendados para inmutabilidad:
- /etc/passwd
- /etc/shadow
- /etc/sudoers
- scripts críticos de arranque
- binarios de seguridad (ssh, sudo…)

Ejemplo:
  ```
    chattr +i /etc/shadow
  ```

 Con +i, ni siquiera root puede modificar el archivo sin quitar antes el atributo, lo cual deja trazabilidad clara y reduce riesgo de alteraciones silenciosas.

---

# 7. Cifrado y Gestión Criptográfica

El cifrado no es opcional en 2025, especialmente en entornos cloud, entornos multi-tenant y sistemas con movilidad. La protección de datos en reposo y en uso es uno de los pilares principales de cumplimiento normativo y mitigación de exfiltración.

## 7.1 Cifrado de disco completo

### LUKS2
Es el estándar de cifrado en Linux.

Buenas prácticas:
- Usar LUKS2 (no LUKS1)
- PBKDF robusto como Argon2id
- Activar auto-reencrypt si se actualizan claves
- Requerir longitudes de clave de 256 bits

### Integración con TPM
 Permite desbloqueo seguro sin exponer claves en scripts o ficheros:

- Uso de clevis + tpm2
- Permite políticas combinadas: "TPM + passphrase"

 Ideal para servers sin intervención manual.

## 7.2 Cifrado de archivos

### fscrypt
Ventajas:
 - Integración nativa en el kernel
 - Independiente del filesystem
 - Perfecto para multi-usuario

Uso típico:
  ```
    fscrypt setup /home
    fscrypt encrypt /home/usuario
  ```

### kernel keyrings
 El kernel gestiona claves temporalmente sin exponerse en espacio de usuario.

# 7.3 Gestión de claves y HSM

La gestión segura de claves es fundamental para evitar fugas de información, suplantaciones y accesos no autorizados. En entornos profesionales, las claves nunca deben almacenarse en texto claro ni depender exclusivamente de la seguridad del sistema operativo.

### Uso de HSM (Hardware Security Modules)
 Los HSM permiten almacenar claves maestras en hardware, de manera que:
- No pueden extraerse directamente
- No pueden copiarse ni clonarse
- Permiten operaciones criptográficas sin exponer la clave

 Son ideales para:
- Infraestructuras PKI
- Servidores de autenticación
- Sistemas bancarios
- Firmas digitales

### TPM 2.0
 El TPM es un chip integrado que almacena claves ligadas al hardware.

Ventajas:
- Protección ante ataques offline
- Evita robo de claves en discos
- Integración con kernel keyrings
- Combinable con LUKS y Secure Boot

### Vaults y gestores criptográficos
- Hashicorp Vault
- Azure Key Vault
- AWS KMS
- GCP KMS

Buenas prácticas:
- Rotación automática
- Control de acceso RBAC
- Auditoría de uso de claves
- Regeneración periódica

---

# 8. Seguridad de Kernel y Módulos

El kernel es la superficie de ataque más crítica. Un solo módulo cargado sin control puede comprometer todo el sistema. Por ello, endurecer su comportamiento es imprescindible.

## 8.1 Bloqueo de carga de módulos

### 1. Deshabilitar carga en caliente
  ```
    echo 1 > /proc/sys/kernel/modules_disabled
  ```

 Una vez hecho, no se pueden cargar ni descargar módulos sin reiniciar.

### 2. Blacklists en modprobe.d
  ```
    echo "blacklist firewire-core" > /etc/modprobe.d/blacklist-firewire.conf
  ```

### 3. Evitar módulos no firmados
 En kernels modernos puede requerirse firma digital para todos los módulos.

## 8.2 Sysctl para endurecimiento del kernel

Ajustes críticos:
  ```
    kernel.kptr_restrict = 2
    kernel.yama.ptrace_scope = 2
    kernel.dmesg_restrict = 1
    vm.mmap_min_addr = 65536
    kernel.sysrq = 0
  ```

 Explicación breve:
- kptr_restrict: oculta direcciones del kernel
- ptrace_scope: impide debugging cruzado entre usuarios
- dmesg_restrict: limita acceso al buffer del kernel
- mmap_min_addr: evita null mapping
- sysrq: desactiva combinaciones de teclas peligrosas

## 8.3 Protección del stack y heap

### Protecciones recomendadas:
- ASLR (Address Space Layout Randomization)
- NX bit (No-eXecute)
- PIE (Position Independent Executables)

### Comprobación:
  ```
    sysctl kernel.randomize_va_space
  ```

Valor recomendado: 2

---

# 9. Hardening de Servicios y Demonios

 Cada demonio que se ejecuta aumenta la superficie de ataque. Esta sección determina cómo minimizar el riesgo.

## 9.1 Eliminación de servicios innecesarios

### Listar todos los servicios:
  ```
    systemctl list-unit-files --type=service
  ```

### Deshabilitar:
  ```
    systemctl disable --now servicio
  ```

### Servicios comúnmente prescindibles:
- avahi-daemon
- cups (si no hay impresoras)
- rpcbind
- bluetooth (en servidores)

## 9.2 Sandboxing con Systemd

 Systemd puede aislar servicios de forma nativa:

### Ejemplo de configuración segura:
  ```
    [Service]
    PrivateTmp=true
    NoNewPrivileges=true
    ProtectSystem=strict
    ProtectHome=true
    MemoryDenyWriteExecute=true
  ```

## 9.3 Limitación de capacidades

 Linux capabilities permite otorgar privilegios mínimos.

### Ejemplo:
  ```
    CapabilityBoundingSet=CAP_NET_BIND_SERVICE
  ```

---

# 10. Seguridad en Red

 Una de las áreas más atacadas y explotadas. Aquí se definen técnicas para control de puertos, aislamiento, firewall avanzado y protección de protocolos.

## 10.1 Firewall básico y avanzado

### Opciones:
- iptables
- nftables
- Firewalld

### Ejemplo con nftables:
  ```
    table inet filter {
      chain input {
        type filter hook input priority 0;
        policy drop;
        ct state established,related accept
        tcp dport { 22 } accept
        iif lo accept
      }
    }
  ```

## 10.2 Filtrado de puertos y tráfico

### Bloqueo de escaneos SYN:
  ```
    net.ipv4.tcp_syncookies = 1
  ```

### Defensa ante spoofing:
  ```
    net.ipv4.conf.all.rp_filter = 1
  ```

## 10.3 IPS / IDS

 Sistemas recomendados:
- Suricata
- Zeek
- Snort 3

Buenas prácticas:
- Colocarlos en modo afinline
- Firmas actualizadas
- Exclusión de falsos positivos

---

# 11. Contenedores y Virtualización

 Los contenedores requieren un enfoque de seguridad distinto a las máquinas tradicionales.

## 11.1 Hardening de Docker

### Buenas prácticas:
- Usar rootless mode
- Limitar capacidades
- Deshabilitar acceso al daemon por socket TCP
- Activar AppArmor/SELinux profiles

### Ejemplo AppArmor:
  ```
    docker-default {
      # restricciones aquí
    }
  ```

## 11.2 Hardening de Kubernetes

### Puntos críticos:
- RBAC estricto
- NetworkPolicies obligatorias
- Contenedores no privilegiados
- Auditoría del API server

## 11.3 Virtualización (KVM/QEMU)

### Buenas prácticas:
- Deshabilitar dispositivos USB
- Usar virtio siempre que sea posible
- Aislar redes NAT y bridge

---

# 12. Logs, Auditoría y Detección

 Un sistema sin logs no puede defenderse ni reconstruir ataques.

## 12.1 Auditd

### Reglas esenciales:
  ```
    -w /etc/passwd -p wa -k identidad
    -w /etc/shadow -p wa -k identidad
    -w /etc/sudoers -p wa -k sudo
  ```

## 12.2 Journald

### Aumentar retención:
  ```
    SystemMaxUse=1G
    SystemKeepFree=500M
  ```

## 12.3 Envío remoto de logs

Recomendado:
- Graylog
- Splunk
- ELK
- Wazuh

---

# 13. Automatización del Hardening

La automatización evita configuraciones incompletas o inconsistentes.

## 13.1 Ansible

### Roles comunes:
- CIS benchmark
- SSH hardening
- Kernel hardening
- Auditd

## 13.2 Terraform + Ansible

 Muy usado en entornos cloud:
- Terraform crea infraestructura
- Ansible la endurece

---

# 14. Monitorización continua

Una máquina endurecida pierde seguridad en cuanto deja de observarse.

## 14.1 Detección continua

 Soluciones:
- Wazuh
- OSSEC
- Lynis (modo continuo)
- Crowdstrike Falcon
- SentinelOne

## 14.2 Supervisión del estado del sistema

- Integridad del filesystem
- Cambios en binarios
- Modificación de permisos
- Detección de rootkits

## 14.3 Alertas y respuesta

### Buenas prácticas:
- Alertas por correo/Slack
- Paneles en Grafana
- Integración con SIEM
- Playbooks de respuesta

---

# 15. Checklist Avanzado de Hardening

Esta checklist resume las principales acciones de hardening que un sysadmin o equipo de ciberseguridad debe implementar en un sistema Linux de producción. Cada ítem se ha seleccionado para cubrir desde la reducción de superficie de ataque hasta la monitorización continua y la gestión de contenedores.

- Minimización del sistema: eliminación de paquetes y servicios innecesarios
- Eliminación de SUID y capacidades innecesarias
- Aplicación de SELinux/AppArmor en modo enforcing
- Sysctl reforzado con parámetros de seguridad
- Configuración de firewall (nftables / iptables) con política por defecto DROP
- SSH endurecido: solo autenticación por clave, usuarios limitados, algoritmos fuertes
- Control de integridad: AIDE, Tripwire, IMA/EVM
- Cifrado robusto: LUKS2, fscrypt, TPM y gestión de claves centralizada
- Logs centralizados: Syslog/TLS, ELK, Graylog o Loki
- Kernel lockdown mode habilitado
- Contenedores rootless con seccomp y cgroups estrictos
- Auditoría completa con auditd y reglas específicas
- Control de acceso estricto: usuarios, grupos, permisos y ACLs
- Inmutabilidad de ficheros críticos con chattr +i
- Segmentación de red: VLANs, VRFs, network namespaces
- Protección de /boot con partición separada, solo lectura y Secure Boot
- Opciones de montaje: noexec, nosuid, nodev en directorios sensibles
- Filtrado y mitigación de ataques de red: rp_filter, SYN cookies, ICMP restrictions
- Hardening de servicios: systemd sandboxing, limitación de capacidades, desactivación de servicios no usados
- Políticas criptográficas globales: OpenSSL, crypto policies
- Gestión centralizada de claves: Vault, PKCS#11, TPM2
- Monitorización de syscalls, tráfico y memoria con eBPF
- Integración de EDR: Falco, Wazuh, CrowdStrike, Defender for Endpoint
- Hardening de Kubernetes: PodSecurity, Network Policies, imágenes firmadas
- Automatización del hardening: Ansible, Puppet, SaltStack, Terraform
- Perfiles automáticos de seguridad: OpenSCAP, Lynis, Osquery
- Revisión periódica de logs y auditorías
- Alertas y notificaciones centralizadas con SIEM
- Procedimientos de respuesta ante incidentes documentados
- Telemetría y dashboards de seguridad actualizados
- Evaluación constante de la superficie de ataque y mitigaciones
- Rotación periódica de claves y certificados
- Control de ejecución de binarios desconocidos o modificados
- Restricciones de recursos en contenedores y VMs (cgroups, quotas)
- Validación de integridad de imágenes y paquetes instalados
- Revisión de usuarios y grupos con privilegios elevados
- Deshabilitar servicios de red legacy: telnet, rsh, rpcbind
.- Protección de endpoints: limitación de acceso físico y remoto
- Copias de seguridad seguras y cifradas
- Escaneo regular de vulnerabilidades y aplicación de parches
- Revisión de configuraciones de aplicaciones críticas (web, DB, etc.)
- Hardening de bases de datos: cifrado de archivos, auditoría, usuarios dedicados
- Controles de ejecución de scripts: no permitir ejecución arbitraria en /tmp
- Prevención de escaladas de privilegios locales
- Mantenimiento de registros de cambios y configuraciones
- Educación y concienciación de los usuarios finales
- Revisión de logs de seguridad y eventos anómalos
- Políticas de seguridad alineadas a normas y estándares (CIS, NIST, ENS)
- Integración de herramientas de análisis y benchmarking de seguridad
- Revisión de módulos del kernel y eliminación de los no necesarios
- Aplicación de perfiles de seguridad específicos para contenedores y VMs

---

# 16. Conclusión

El hardening de sistemas Linux es un proceso continuo y multidimensional. No se trata únicamente de aplicar configuraciones rígidas, sino de establecer un enfoque integral que combine:

- Minimización de superficie de ataque
- Control de privilegios y separación de funciones
- Endurecimiento del kernel, servicios y red
- Cifrado de datos y gestión segura de claves
- Auditoría, monitorización y control de integridad
- Seguridad en contenedores y virtualización
- Automatización y despliegue reproducible
- Telemetría y detección temprana de incidentes

La seguridad no es estática: nuevas vulnerabilidades, amenazas y vectores de ataque surgen continuamente. Por ello, cada acción de hardening debe revisarse, actualizarse y auditarse regularmente.

Adoptar un enfoque de defense-in-depth, junto con herramientas de automatización, monitoreo y control centralizado, asegura que los sistemas Linux sean resilientes frente a ataques, cumplan con normativas y mantengan la integridad de la infraestructura crítica.

Con esta guía avanzada, los profesionales de sysadmin, ciberseguridad y DevSecOps cuentan con un mapa completo de prácticas, herramientas y configuraciones para implementar un hardening sólido y mantenerlo actualizado en entornos modernos de producción.

> "The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room… and even then I have my doubts." – Gene Spafford
