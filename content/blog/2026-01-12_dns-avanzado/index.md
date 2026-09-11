---
title: "¿Qué es Domain Name System (DNS)?"
slug: "dns-avanzado"
date: 2026-01-12
lastmod: 2026-01-12
draft: false
author: "davidalvarezp"
authorLink: "https://davidalvarezp.com"
description: "Guía técnica y práctica sobre DNS para SysAdmins y DevOps: cómo funciona realmente, resolución paso a paso, tipos de registros, debugging, Kubernetes, CI/CD y buenas prácticas en infra moderna."
images: [dns_avanzado.webp]
resources:
- name: "dns_avanzado"
  src: "dns_avanzado.webp"

tags: [
"DNS",
"Sysadmin",
"DevOps",
"Infraestructura",
"Networking",
"Kubernetes",
"Cloud",
"CI/CD",
"TLS",
"Microservicios"
]
categories: [
"SysAdmin",
"DevOps"
]

lightgallery: true
---


# ¿Qué es DNS y cómo funciona?

El **Domain Name System (DNS)** es uno de esos componentes invisibles que solo recordamos cuando falla.
Para un usuario final, es “Internet no funciona”, mientras que para un **SysAdmin o DevOps**, es una cadena compleja de resoluciones, caches, TTLs y servidores autoritativos que, si se rompe, tumba aplicaciones, pipelines y clusters enteros.

En este artículo vamos a **desmenuzar DNS desde dentro**, con un enfoque **práctico y técnico**, pensado para quienes administran servidores, plataformas cloud, Kubernetes y entornos modernos de producción.

---

## Índice

1. [**¿Qué es DNS y por qué es crítico en infra moderna?**](#1-qu%C3%A9-es-dns-y-por-qu%C3%A9-importa-de-verdad)
2. [**Cómo funciona realmente una resolución DNS**](#2-qu%C3%A9-pasa-realmente-cuando-escribes-googlecom)
3. [**Componentes clave del ecosistema DNS**](#3-componentes-clave-del-dns)
4. [**Tipos de registros DNS que todo sysadmin debe dominar**](#4-tipos-de-registros-dns-importantes)
5. [**DNS en DevOps, CI/CD y Kubernetes**](#5-dns-en-devops-y-entornos-modernos)
6. [**Problemas comunes de DNS y cómo debuggearlos**](#6-problemas-comunes-y-c%C3%B3mo-debuggear-dns)
7. [**Buenas prácticas y recomendaciones finales**](#7-buenas-pr%C3%A1cticas-para-sysadmins-y-devops)
8. [**Conclusión**](#conclusi%C3%B3n)

---

## 1. ¿Qué es DNS y por qué importa (de verdad)?

DNS significa **Domain Name System** y su función básica es trivial:

> Traducir nombres legibles por humanos (`https://dns.google/`) a direcciones IP (`8.8.8.8`).

Pero en infraestructura moderna, DNS es **mucho más que una simple traducción**.

Para SysAdmins y DevOps, DNS impacta directamente en:

- **Disponibilidad de aplicaciones**
- **Despliegues CI/CD**
- **Balanceo de carga**
- **Descubrimiento de servicios**
- **Certificados TLS/SSL**
- **Comunicación entre microservicios**

Un DNS mal configurado **no suele fallar de forma explícita**:  
falla con timeouts, errores intermitentes y comportamientos no deterministas.

Y eso, es lo peor.

---

## 2. Qué pasa realmente cuando escribes `google.com`

Desde fuera parece magia.  
Desde dentro, es una **cadena de consultas jerárquicas** perfectamente definida.

Flujo simplificado:

```

Browser
↓
Resolver DNS (ISP / Custom)
↓
Root Server (.)
↓
TLD Server (.com)
↓
Authoritative Server (google.com)
↓
IP de destino

```

Cada paso responde **solo lo que sabe**, nunca más.

---

## 3. Componentes clave del DNS

### 3.1 DNS Resolver (Recursor)

Es el **primer punto de contacto**.  
Normalmente es:

- El DNS de tu ISP
- Un DNS público (`8.8.8.8`, `1.1.1.1`)
- Un resolver interno corporativo

El resolver:
- Hace las consultas recursivas por ti
- Cachea respuestas
- Respeta TTLs

---

### 3.2 Root Servers

Son la **raíz del sistema DNS**.  
No conocen IPs finales, solo saben **dónde están los TLD**.

Ejemplo:
```

¿Quién sabe sobre .com?
→ Pregunta a estos servidores

```

---

### 3.3 TLD Servers

Gestionan dominios de alto nivel:
- `.com`
- `.org`
- `.net`
- `.io`

Responden con:
```

Los servidores autoritativos
de este dominio son X

````

---

### 3.4 Authoritative Name Servers

Aquí está **la verdad absoluta** de un dominio.

- Contienen los registros reales (A, AAAA, MX, etc.)
- No cachean
- Son la fuente final de autoridad

---

### 3.5 Cache DNS (el arma de doble filo)

El caching existe en **varios niveles**:

- Resolver DNS
- Sistema operativo
- Navegador
- Aplicaciones

> Cambiar un registro DNS **no significa que el mundo lo vea al instante**.

Este detalle explica el 80% de los “DNS no funciona” en producción.

---

## 4. Tipos de registros DNS importantes

### 4.1 A y AAAA

Mapean nombres a IPs.

```bash
dig google.com A
dig google.com AAAA
````

* `A` → IPv4
* `AAAA` → IPv6

---

### 4.2 CNAME (Aliases)

Permiten apuntar un nombre a otro nombre.

```bash
dig www.github.com CNAME
```

Uso típico:

* CDNs
* Subdominios dinámicos
* Infra flexible sin IPs hardcodeadas

⚠️ Un CNAME **no puede coexistir** con otros registros del mismo nombre.

---

### 4.3 MX (Correo)

Define dónde se entrega el email de un dominio.

```bash
dig google.com MX
```

Incluye:

* Prioridad
* Host de destino

---

### 4.4 TXT

El registro comodín.

Usado para:

* SPF
* DKIM
* DMARC
* Verificaciones de dominios
* Integraciones cloud

---

### 4.5 NS

Define **qué servidores son autoritativos** para el dominio.

Un error aquí = dominio caído.

---

### 4.6 SRV (clave en infra moderna)

Usados para **descubrimiento de servicios**.

Muy comunes en:

* Kubernetes
* LDAP
* Servicios internos

> Permiten descubrir **host + puerto**, no solo IP.

---

## 5. DNS en DevOps y entornos modernos

### 5.1 CI/CD y despliegues

Un pipeline puede fallar si:

* El dominio aún no propaga
* El TTL es demasiado alto
* Apunta a un backend inexistente

DNS es parte del **control plane**, no un detalle.

---

### 5.2 Kubernetes y CoreDNS

Kubernetes depende **fuertemente** de DNS.

Ejemplo:

```bash
kubectl get svc
```

Cada servicio genera nombres como:

```
service.namespace.svc.cluster.local
```

Desde un pod:

```bash
nslookup service
```

Si esto falla:

* CoreDNS
* `/etc/resolv.conf`
* Network Policies

son los primeros sospechosos.

---

### 5.3 TLS y certificados

Los certificados dependen de:

* Resolución correcta
* Accesibilidad desde validadores (Let's Encrypt)

DNS roto = HTTPS roto.

---

### 5.4 Load Balancing con DNS

DNS Round Robin:

* Simple
* Barato
* Peligroso si no controlas TTLs

El caching puede enviar tráfico a nodos muertos durante horas.

---

## 6. Problemas comunes y cómo debuggear DNS

### 6.1 NXDOMAIN

El nombre no existe.

```bash
dig noexiste.davidalvarezp.com
```

Revisa:

* Typo
* Zona incorrecta
* Registros no publicados

---

### 6.2 SERVFAIL

El servidor no pudo responder.

Causas típicas:

* Errores en la zona
* DNSSEC mal configurado
* Timeouts upstream

---

### 6.3 Cache obsoleta

Limpieza local:

```bash
sudo systemd-resolve --flush-caches
```

Windows:

```powershell
ipconfig /flushdns
```

---

### 6.4 Problemas de firewall

DNS usa:

* UDP 53 (principal)
* TCP 53 (zonas grandes, DNSSEC)

Bloquear UDP 53 = desastre silencioso.

---

### 6.5 Kubernetes y Docker

Revisar:

```bash
cat /etc/resolv.conf
kubectl logs -n kube-system coredns
```

> Siempre prueba desde **dentro del contenedor**, no desde el host.

---

## 7. Buenas prácticas para sysadmins y DevOps

✔ Documenta todos los registros
✔ Usa TTLs coherentes con tu operativa
✔ Reduce TTL antes de cambios críticos
✔ Monitoriza resoluciones clave
✔ Separa DNS público y privado
✔ Prueba en staging antes de producción

Ejemplo simple de monitorización:

```bash
dig +short app.davidalvarezp.com `
|| alert-send "DNS DOWN"
```

---

## Conclusión

DNS no es “solo nombres”.
Es un **pilar crítico de la infraestructura moderna**.

Entender cómo funciona internamente te permite:

* Debuggear más rápido
* Diseñar sistemas resilientes
* Evitar caídas innecesarias
* Mejorar despliegues y operaciones

Si administras servidores, clusters o pipelines, **DNS es parte de tu responsabilidad**, quieras o no.

---
> *Happy resolving.* 🌐
