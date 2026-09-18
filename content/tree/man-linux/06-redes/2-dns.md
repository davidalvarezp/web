# 6.2 Resolución de Nombres (DNS) en Linux

---

## Introducción

En cualquier infraestructura moderna, los humanos no trabajan con direcciones IP, sino con nombres. Recordar `192.168.10.25` es inviable a escala; en su lugar utilizamos nombres como `app.interna.local` o `www.example.com`. Aquí es donde entra el **DNS (Domain Name System)**, el servicio responsable de traducir nombres de dominio en direcciones IP.

Para un Sysadmin, comprender el funcionamiento del DNS es crítico: una mala configuración puede provocar desde lentitud en aplicaciones hasta la completa indisponibilidad de servicios. Además, el DNS es un punto clave tanto en rendimiento como en seguridad.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Entender cómo funciona el sistema DNS a nivel conceptual.
- Configurar resolvers en Linux correctamente.
- Diagnosticar problemas de resolución de nombres.
- Utilizar herramientas como `dig`, `nslookup` y `host`.
- Implementar configuraciones locales con `/etc/hosts`.
- Analizar latencias y errores de resolución.

---

## Conceptos Teóricos

### 1. ¿Qué es DNS?

El **Domain Name System (DNS)** es un sistema distribuido jerárquico que traduce nombres de dominio en direcciones IP.

Ejemplo:

```text
www.google.com → 142.250.x.x
```

### Flujo de resolución:

1. Aplicación solicita resolución.
2. El sistema consulta el resolver local.
3. Si no existe en caché:
   * consulta al servidor DNS configurado.
4. Se obtiene la IP.
5. Se devuelve al cliente.

---

### 2. Jerarquía DNS

El DNS está estructurado en niveles:

- **Root Servers (.)**
- **TLD (.com, .org, .es)**
- **Dominios autoritativos**

Ejemplo:

```text
www.example.com
│
├── Root (.)
├── .com
└── example.com (autoritativo)
```

---

### 3. /etc/resolv.conf

Archivo clave para la resolución DNS:

```bash
cat /etc/resolv.conf
```

Ejemplo:

```text
nameserver 8.8.8.8
nameserver 1.1.1.1
```

Campos importantes:

- **nameserver:** servidor DNS.
- **search:** dominios de búsqueda.

---

### 4. /etc/hosts

Sistema local de resolución estática:

```bash
cat /etc/hosts
```

Ejemplo:

```text
127.0.0.1 localhost
192.168.1.10 app.local
```

!!! info "Prioridad de resolución"
El sistema consulta primero `/etc/hosts` antes que DNS.

---

### 5. systemd-resolved

En sistemas modernos, systemd introduce:

- resolución DNS gestionada
- caché local
- soporte DNSSEC

Consulta estado:

```bash
systemd-resolve --status
```

---

### 6. NSS (Name Service Switch)

Define el orden de resolución:

```bash
cat /etc/nsswitch.conf
```

Ejemplo:

```text
hosts: files dns
```

Orden:

1. `/etc/hosts`
2. DNS

---

## Laboratorio Práctico

### Escenario

Un servidor no puede acceder a `intranet.local`. Necesitas:

- verificar resolución DNS
- comprobar configuración
- corregir problemas

---

## Paso 1: Test básico de resolución

```bash
ping google.com
```

Si falla:

```bash
ping 8.8.8.8
```

---

### Interpretación

- ✅ IP funciona, DNS no → problema de resolución
- ❌ ambos fallan → problema de red

---

## Paso 2: Uso de dig

```bash
dig google.com
```

### Output esperado

```text
;; ANSWER SECTION:
google.com.    300    IN    A    142.250.x.x
```

Campos clave:

- **ANSWER SECTION:** resultado
- **Query time:** latencia

---

## Paso 3: Consulta a servidor específico

```bash
dig @8.8.8.8 intranet.local
```

Sirve para aislar problemas locales.

---

## Paso 4: Uso de nslookup

```bash
nslookup google.com
```

Ejemplo output:

```text
Server: 8.8.8.8
Address: 8.8.8.8#53
```

---

## Paso 5: Verificar resolver local

```bash
cat /etc/resolv.conf
```

Corregir:

```bash
sudo nano /etc/resolv.conf
```

---

## Paso 6: Test con host

```bash
host google.com
```

---

## Paso 7: Uso de /etc/hosts para override

```bash
sudo nano /etc/hosts
```

Añadir:

```text
192.168.1.50 intranet.local
```

Validar:

```bash
ping intranet.local
```

---

## Paso 8: Limpiar caché DNS

Systemd:

```bash
sudo systemd-resolve --flush-caches
```

---

## Errores Comunes y Troubleshooting

### 1. resolv.conf se sobrescribe

-*Causa:**

- DHCP o NetworkManager

!!! warning "Conflicto de gestión"
No edites resolv.conf manualmente en sistemas gestionados.

-*Solución:**

- Configurar DNS en Netplan o nmcli.

---

### 2. DNS lento

Verificar:

```bash
dig google.com
```

Alta latencia → cambiar DNS.

---

### 3. Dominio no resuelve

Verificar:

```bash
dig dominio
```

Si no hay ANSWER → problema externo.

---

### 4. Cache obsoleta

```bash
systemd-resolve --flush-caches
```

---

### 5. Error en /etc/hosts

Entradas incorrectas pueden romper servicios.

---

## Buenas Prácticas (Nivel Senior)

### 1. Usa DNS redundantes

```text
nameserver 1.1.1.1
nameserver 8.8.8.8
```

---

### 2. Implementa caché local

- systemd-resolved
- dnsmasq

Reduce latencia.

---

### 3. Monitoriza latencia

```bash
dig google.com | grep "Query time"
```

---

### 4. Evita hardcoding innecesario

Solo usa `/etc/hosts` para casos controlados.

---

### 5. Seguridad DNS

- Evita DNS públicos en entornos sensibles.
- Usa DNS internos (AD, Bind).

---

### 6. Auditoría

Revisar periódicamente:

```bash
cat /etc/resolv.conf
```

---

### 7. Automatización

Ejemplo con Ansible:

```yaml
- name: Configurar DNS
  lineinfile:
    path: /etc/resolv.conf
    line: "nameserver 1.1.1.1"
```

---

## Resumen y Siguiente Paso

Ahora entiendes cómo funciona el sistema DNS en Linux, cómo configurarlo y cómo diagnosticar problemas reales de resolución. Este conocimiento es crítico para garantizar conectividad y rendimiento en infraestructuras modernas.

El siguiente paso es dominar el acceso remoto seguro:

➡️ **6.3 SSH Profesional**, donde aprenderás a securizar accesos, gestionar claves y operar servidores de forma eficiente y segura.
