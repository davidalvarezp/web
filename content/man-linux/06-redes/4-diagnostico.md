# 6.4 Diagnóstico de Red en Linux

---

## Introducción

En producción, los problemas de red no suelen ser evidentes ni simples. Una caída puede deberse a múltiples factores: configuración incorrecta, problemas de routing, DNS defectuoso, latencia, congestión o incluso fallos en capas inferiores. El **diagnóstico de red** es, por tanto, una de las habilidades más críticas para un Sysadmin.

Dominar estas técnicas te permitirá identificar rápidamente dónde está el problema (capa física, red, transporte o aplicación) y actuar con precisión, evitando tiempos de indisponibilidad prolongados.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Diagnosticar problemas de conectividad en múltiples capas.
- Utilizar herramientas clave (`ping`, `traceroute`, `ss`, `tcpdump`, etc.).
- Interpretar latencia, pérdida de paquetes y rutas.
- Analizar puertos abiertos y conexiones activas.
- Detectar cuellos de botella y problemas de red complejos.
- Aplicar metodologías sistemáticas de troubleshooting.

---

## Conceptos Teóricos

### 1. Enfoque por Capas (Modelo OSI simplificado)

Para diagnosticar red, debes pensar en capas:

1. **Física:** cableado, NIC
2. **Red:** IP, routing
3. **Transporte:** TCP/UDP
4. **Aplicación:** servicios (HTTP, SSH)

!!! info "Regla de oro"
Siempre diagnostica de abajo hacia arriba. No intentes resolver DNS si no tienes conectividad IP.

---

### 2. Tipos de Problemas Comunes

- Sin conectividad
- Latencia alta
- Pérdida de paquetes
- DNS lento o incorrecto
- Puertos cerrados
- Routing mal configurado

---

### 3. Herramientas clave

| Herramienta        | Uso                   |
| ------------------ | --------------------- |
| `ping`             | Conectividad básica   |
| `traceroute`       | Ruta de red           |
| `ip`               | configuración         |
| `ss`               | sockets y puertos     |
| `tcpdump`          | análisis de tráfico   |
| `netstat` (legacy) | conexiones            |
| `mtr`              | latencia + traceroute |

---

## Laboratorio Práctico

### Escenario

Un usuario reporta que no puede acceder a un servicio web (`http://miapp.local`). Debes identificar la causa.

---

## Paso 1: Verificar conectividad básica

```bash
ping -c 4 8.8.8.8
```

### Interpretación

- ✅ Responde → hay red
- ❌ No responde → fallo de conectividad

---

## Paso 2: Verificar IP local

```bash
ip a
```

Buscar:

- IP asignada
- interfaz UP

---

## Paso 3: Verificar routing

```bash
ip route
```

Debe existir:

```text
default via 192.168.1.1
```

---

## Paso 4: Diagnóstico DNS

```bash
ping google.com
```

```bash
dig miapp.local
```

---

## Paso 5: Analizar ruta con traceroute

```bash
traceroute google.com
```

Output típico:

```text
1 192.168.1.1
2 10.x.x.x
3 ...
```

### Interpretación

- Salto donde falla → posible bloqueo o caída.

---

## Paso 6: Uso de mtr (muy recomendado)

```bash
mtr google.com
```

Combina:

- traceroute
- latencia
- pérdida de paquetes

---

## Paso 7: Ver puertos abiertos

```bash
ss -tulnp
```

Ejemplo:

```text
LISTEN 0 128 0.0.0.0:80
```

---

## Paso 8: Test de puerto remoto

```bash
nc -zv 192.168.1.10 80
```

---

## Paso 9: Captura de tráfico con tcpdump

```bash
sudo tcpdump -i eth0 port 80
```

Permite ver:

- paquetes entrantes/salientes
- errores de comunicación

---

## Paso 10: Diagnóstico HTTP

```bash
curl -I http://miapp.local
```

Output esperado:

```text
HTTP/1.1 200 OK
```

---

## Errores Comunes y Troubleshooting

### 1. Ping funciona pero servicio no

- Problema de capa 7 (aplicación).
- Verificar servicio:

```bash
systemctl status nginx
```

---

### 2. DNS funciona pero no hay conexión

- Problema de firewall o routing.

---

### 3. Alta latencia

Ver:

```bash
mtr google.com
```

- posible congestión
- proveedor ISP

---

### 4. Puerto cerrado

Verificar:

```bash
ss -tulnp
```

---

### 5. Firewall bloqueando

```bash
sudo ufw status
```

---

### 6. Interfaz caída

```bash
ip link show
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Metodología estructurada

Siempre seguir orden:

1. IP
2. routing
3. DNS
4. puerto
5. aplicación

---

### 2. Usa herramientas adecuadas

- `mtr` en lugar de traceroute si es posible.
- `ss` en lugar de netstat.

---

### 3. Logs son clave

```bash
journalctl -u network
```

---

### 4. Automatiza checks

Ejemplo script:

```bash
ping -c 2 8.8.8.8 || echo "Fallo red"
```

---

### 5. Monitorización continua

- Prometheus
- Nagios
- Zabbix

---

### 6. Seguridad

- No exponer servicios innecesarios.
- Auditar puertos abiertos regularmente.

---

### 7. Captura selectiva

Evita:

```bash
tcpdump -i eth0
```

Prefiere filtros:

```bash
tcpdump port 443
```

---

### 8. Documenta topología

Tener claridad sobre:

- subredes
- gateways
- servicios

---

## Resumen y Siguiente Paso

Has aprendido a diagnosticar problemas de red de forma profesional, utilizando herramientas clave y aplicando una metodología estructurada. Este conocimiento te permitirá resolver incidentes complejos de forma rápida y precisa en entornos reales.

A partir de aquí, entramos en un área crítica: la protección de sistemas.

➡️ **7.1 Firewalls (UFW/NFTables)**, donde aprenderás a controlar el tráfico y securizar tus servidores frente a amenazas.
