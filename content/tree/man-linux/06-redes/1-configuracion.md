# 6.1 Configuración de Red en Linux

---

## Introducción

La red es el sistema nervioso de cualquier infraestructura moderna. Sin conectividad, los servicios no pueden comunicarse, los usuarios no pueden acceder a recursos y las aplicaciones distribuidas dejan de funcionar. En Linux, la configuración de red ha evolucionado desde herramientas tradicionales hasta frameworks modernos como **NetworkManager** o **systemd-networkd**.

Para un Sysadmin, dominar la configuración de red implica no solo asignar direcciones IP, sino entender interfaces, routing, resolución, persistencia y diagnóstico en entornos de producción.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender cómo Linux gestiona interfaces de red.
- Configurar direcciones IP estáticas y dinámicas (DHCP).
- Gestionar configuraciones persistentes.
- Interpretar tablas de routing.
- Utilizar herramientas modernas como `ip` y `nmcli`.
- Diagnosticar problemas de conectividad básica.

---

## Conceptos Teóricos

### 1. Interfaces de Red

En Linux, cada dispositivo de red se representa como una **interfaz**:

Ejemplos:

- **eth0 / enp0s3** → interfaces Ethernet
- **wlan0** → WiFi
- **lo** → loopback

Consultar interfaces:

```bash
ip link show
```

---

### 2. Direccionamiento IP

Una interfaz necesita una dirección IP para comunicarse.

Tipos:

- **Dinámica (DHCP)** → asignada automáticamente.
- **Estática** → definida manualmente.

Ejemplo de IP:

```text
192.168.1.100/24
```

- IP: 192.168.1.100
- Máscara: /24 (255.255.255.0)

---

### 3. Comando ip (reemplazo de ifconfig)

El comando moderno y estándar es:

```bash
ip
```

Principales usos:

- `ip a` → ver IPs
- `ip link` → interfaces
- `ip route` → rutas

---

### 4. Tabla de Routing

Define cómo se enruta el tráfico.

Ver rutas:

```bash
ip route
```

Ejemplo:

```text
default via 192.168.1.1 dev eth0
```

- **default** → gateway de salida
- **via** → router
- **dev** → interfaz

---

### 5. Configuración Persistente

Depende de la distribución:

- **Debian/Ubuntu (netplan):**
  * `/etc/netplan/*.yaml`
- **RHEL/CentOS:**
  * `/etc/sysconfig/network-scripts/`
- **systemd-networkd:**
  * `/etc/systemd/network/`

---

### 6. NetworkManager

Framework moderno para gestión dinámica:

```bash
nmcli
```

Permite:

- configurar interfaces
- gestionar WiFi
- automatizar perfiles

---

## Laboratorio Práctico

### Escenario

Configurar un servidor con:

- IP estática
- Gateway
- DNS
- Validar conectividad

---

## Parte 1: Inspección inicial

```bash
ip a
```

#### Output esperado

```text
2: eth0: <UP>
    inet 192.168.1.50/24
```

---

## Parte 2: Configuración temporal de IP

```bash
sudo ip addr add 192.168.1.100/24 dev eth0
```

Activar interfaz:

```bash
sudo ip link set eth0 up
```

---

## Parte 3: Configurar gateway

```bash
sudo ip route add default via 192.168.1.1
```

---

## Parte 4: Configurar DNS

Editar:

```bash
sudo nano /etc/resolv.conf
```

Contenido:

```text
nameserver 8.8.8.8
```

!!! warning "Configuración temporal"
Este archivo puede ser sobrescrito por NetworkManager o DHCP.

---

## Parte 5: Configuración persistente (Netplan)

Editar:

```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

Ejemplo:

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

Aplicar cambios:

```bash
sudo netplan apply
```

---

## Parte 6: Verificación

### Ping a gateway

```bash
ping -c 4 192.168.1.1
```

### Ping a internet

```bash
ping -c 4 8.8.8.8
```

### Ping por DNS

```bash
ping google.com
```

---

## Parte 7: Configuración con nmcli

Listar conexiones:

```bash
nmcli con show
```

Crear IP estática:

```bash
nmcli con mod eth0 ipv4.addresses 192.168.1.100/24
nmcli con mod eth0 ipv4.gateway 192.168.1.1
nmcli con mod eth0 ipv4.dns "8.8.8.8"
nmcli con mod eth0 ipv4.method manual
```

Reiniciar conexión:

```bash
nmcli con down eth0 && nmcli con up eth0
```

---

## Errores Comunes y Troubleshooting

### 1. No hay conectividad

Checklist:

```bash
ip a
ip route
```

Verifica:

- IP existe
- interfaz está UP
- gateway correcto

---

### 2. No resuelve DNS

Test:

```bash
ping 8.8.8.8
ping google.com
```

- Si IP funciona pero DNS no → problema en resolv.conf.

---

### 3. Netplan no aplica cambios

Error típico:

```bash
netplan apply
```

Fallo por YAML mal indentado.

!!! warning "YAML estricto"
La indentación incorrecta rompe completamente la configuración.

---

### 4. Interfaz cambia de nombre

Ejemplo:

- eth0 → enp0s3

Solución:

```bash
ip link
```

Identificar nombre real.

---

### 5. Conflicto DHCP + estática

Si tienes:

```yaml
dhcp4: yes
```

Y IP manual → conflicto.

---

## Buenas Prácticas (Nivel Senior)

### 1. Usa nombres predictivos

Evita asumir `eth0`, usa detección:

```bash
ip link show
```

---

### 2. Versiona configuraciones

Guarda `/etc/netplan` en Git para auditoría.

---

### 3. Minimiza cambios en producción

!!! tip "Cambio controlado"
Siempre valida configuración en entorno staging.

---

### 4. Usa múltiples DNS

```yaml
nameservers:
  addresses: [8.8.8.8, 1.1.1.1]
```

---

### 5. NetworkManager vs Netplan

- Servidores → Netplan/systemd-networkd
- Escritorios → NetworkManager

---

### 6. Seguridad

- No expongas servicios innecesarios.
- Usa firewall (ver módulo 7).

---

### 7. Automatización

Integrar con Ansible:

```yaml
- name: Configurar red
  template:
    src: netplan.yaml
    dest: /etc/netplan/01-netcfg.yaml
```

---

## Resumen y Siguiente Paso

Has aprendido a configurar redes en Linux desde cero: interfaces, direccionamiento, routing y persistencia. Dominas herramientas modernas como `ip` y `nmcli`, y puedes diagnosticar problemas básicos de conectividad en entornos reales.

El siguiente paso es profundizar en uno de los pilares fundamentales de cualquier red:

➡️ **6.2 Resolución de Nombres (DNS)**, donde entenderás cómo los sistemas traducen nombres en direcciones IP y cómo configurar resolvers de forma profesional.
