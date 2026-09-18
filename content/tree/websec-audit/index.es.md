---
title: "WebSec-Audit: Framework profesional de auditoría de seguridad web en Bash"
date: 2026-03-23
draft: false
description: "WebSec-Audit es un framework modular en Bash para auditorías de seguridad web profesionales. Más de 15 módulos: reconocimiento, SQLi, XSS, SSRF, SSL/TLS, CORS, subdomain takeover y más. Genera reportes en HTML, JSON y TXT."
author: "dap"

lightgallery: true

math:
  enable: false
---

# WebSec-Audit

**Framework profesional de auditoría de seguridad web** — modular, extensible y listo para producción.

> **Aviso legal:** Esta herramienta está diseñada exclusivamente para pruebas en sistemas propios o con autorización escrita del propietario. El uso no autorizado contra sistemas de terceros es ilegal.

---

## ¿Qué es WebSec-Audit?

WebSec-Audit es un FrameWork modular en Bash que automatiza auditorías de seguridad web profesionales sobre cualquier objetivo autorizado. Está diseñado para ejecutarse en **Debian, Ubuntu y Kali Linux**, y cubre la mayor parte de la superficie de ataque que un pentester o analista de seguridad necesita evaluar en una aplicación web.

Lo desarrollé como proyecto personal durante mi formación como **Certified Ethical Hacker**, con el objetivo de tener una herramienta propia, modular y fácil de adaptar a cada compromiso.

El resultado es un framework de más de **2.500 líneas de Bash** que integra más de 15 módulos independientes, un motor estructurado y un generador de reportes en tres formatos diferentes.

---

## Módulos incluidos

| # | Módulo | Descripción | Herramientas |
|---|--------|-------------|--------------|
| 00 | Target Info | Resolución de IP e inicialización | `dig`, `host` |
| 01 | Reconocimiento | WHOIS, DNS, AXFR, subdominios, SPF/DMARC, Google Dorks | `whois`, `subfinder`, `amass`, `dnsrecon` |
| 02 | Escaneo de puertos | Detección de servicios y análisis de riesgo | `nmap` |
| 03 | Fingerprinting | Stack tecnológico, detección de WAF, versiones expuestas | `whatweb`, `wafw00f` |
| 04 | SSL/TLS | Protocolos, cifrados, caducidad de certificado, HSTS | `testssl.sh`, `sslscan`, `openssl` |
| 05 | Cabeceras HTTP | CSP, cookies, clickjacking, redirección HTTP→HTTPS | `curl` |
| 06 | Dir & Files | Fuerza bruta de directorios + 40 rutas sensibles conocidas | `gobuster`, `ffuf`, `dirb` |
| 07 | Nikto | Vulnerabilidades web conocidas, CVEs, malas configuraciones | `nikto` |
| 08 | Inyección SQL | Detección y explotación automática de SQLi | `sqlmap` |
| 09 | XSS | XSS reflejado y DOM-based en parámetros comunes | `dalfox`, `curl` |
| 10 | CMS | WordPress, Drupal, Joomla, Magento | `wpscan`, `droopescan` |
| 11 | CORS | Orígenes reflejados, wildcard, credenciales cruzadas | `curl` |
| 12 | Open Redirect | 20 parámetros × 10 payloads de redirección | `curl` |
| 13 | SSRF | Metadata de AWS, GCP, Azure; IPs internas | `curl` |
| 14 | Subdomain Takeover | CNAME colgados en 20+ servicios externos | `subjack`, `nuclei` |
| 15 | Nuclei | Templates de CVEs y malas configuraciones | `nuclei` |

---

## Modos de escaneo

El script soporta tres modos:

**Normal** (por defecto): equilibrio entre cobertura y velocidad.

```bash
./websec-audit.sh -t https://target.com
```

**Agresivo** (`--aggressive`): escaneo más profundo, más ruido. nmap con `-A -O --script=vuln`, sqlmap nivel 5, crawling completo, dalfox con DOM-XSS profundo.

```bash
./websec-audit.sh -t https://target.com --aggressive -T 20
```

**Sigiloso** (`--stealth`): más lento, menor huella de detección. nmap `-T2 -f`, sqlmap con delays y safe-freq.

```bash
./websec-audit.sh -t https://target.com --stealth
```

---

## Control modular

Cualquier módulo se puede desactivar de forma independiente:

```bash
./websec-audit.sh -t https://target.com --skip-nikto --skip-sqli --skip-cms
```

Esto permite adaptar el escaneo al alcance de cada auditoría, reducir el tiempo total o evitar herramientas que generan demasiado ruido en entornos sensibles.

---

## Soporte para proxy

Todo el tráfico se puede enrutar a través de Burp Suite u otro proxy HTTP:

```bash
./websec-audit.sh -t https://target.com --proxy http://127.0.0.1:8080
```

---

## Reportes

Al finalizar, el script genera tres formatos de reporte en `results_<dominio>_<timestamp>/reports/`:

### HTML interactivo

El más visual. Incluye:
- Panel de resumen con contadores por severidad (CRITICAL / HIGH / MEDIUM / LOW / INFO)
- Barra de riesgo visual
- Tabla de hallazgos con filtros por severidad y búsqueda en tiempo real
- Evidencia y recomendación de remediación por cada hallazgo
- Metadatos del escaneo: target, IP, duración, modo, módulos ejecutados

### JSON estructurado

Formato estructurado con metadatos, resumen y arrays. Ideal para integrar con otras herramientas o pipelines automatizados.

```json
{
  "metadata": { "target": "https://target.com", "duration_secs": 342 },
  "summary":  { "total": 18, "critical": 2, "high": 5 },
  "findings": [
    {
      "severity": "CRITICAL",
      "module": "RECON",
      "title": "DNS Zone Transfer (AXFR) permitido",
      "evidence": "...",
      "recommendation": "Restringir AXFR a servidores secundarios autorizados."
    }
  ]
}
```

### TXT plano

Log completo con timestamps para archivar o incluir en informes formales.

---

## Estructura de salida

```
results_objetivo_20260323_120000/
├── logs/
│   ├── audit_20260323_120000.log
│   └── findings.jsonl
├── recon/          (WHOIS, DNS, subdominios, WhatWeb, WAF, Dorks)
├── portscan/       (nmap .txt .xml .gnmap)
├── ssl/            (testssl.json, sslscan.txt)
├── headers/        (cabeceras de respuesta)
├── dirs/           (gobuster, rutas sensibles encontradas)
├── vulns/          (sqlmap, xss, nuclei)
├── cms/            (wpscan, droopescan)
├── misc/           (cors, open_redirect, ssrf, subtakeover)
└── reports/
    ├── report_*.html
    ├── report_*.json
    └── report_*.txt
```

---

## Instalación

### Instalación automática (recomendada)

```bash
git clone https://github.com/davidalvarezp/websec-audit.git
cd websec-audit
chmod +x install.sh websec-audit.sh
sudo ./install.sh
```

El script `install.sh` detecta el sistema, instala todos los paquetes APT necesarios y descarga los binarios de Go (gobuster, subfinder, ffuf, dalfox, subjack, nuclei, amass) para la arquitectura correcta.

### Dependencias requeridas

Solo `curl` y `nmap` son estrictamente necesarios. El resto de herramientas son opcionales y amplían la cobertura de cada módulo.

---

## Ejemplo de uso completo

```bash
# Escaneo estándar
./websec-audit.sh -t https://target.com

# Escaneo agresivo con 20 hilos y reporte solo JSON
./websec-audit.sh -t https://target.com --aggressive -T 20 --format json -o /tmp/audit

# Escaneo sigiloso a través de Burp Suite
./websec-audit.sh -t https://target.com --stealth --proxy http://127.0.0.1:8080

# Escaneo rápido saltando módulos lentos
./websec-audit.sh -t https://target.com --skip-nikto --skip-sqli -v

# Escaneo completo con todos los puertos
./websec-audit.sh -t https://target.com --ports full --depth 5 --aggressive
```

---

## Repositorio

El proyecto está publicado en GitHub con licencia MIT. Incluye documentación completa, instalador automático, CI con ShellCheck, templates de issues y PRs, y CHANGELOG.

🔗 **[github.com/davidalvarezp/websec-audit](https://github.com/davidalvarezp/websec-audit)**

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una idea para un nuevo módulo, abre un issue o un pull request siguiendo la guía en [CONTRIBUTING.md](https://github.com/davidalvarezp/websec-audit/blob/main/CONTRIBUTING.md).

---

*Última actualización: Marzo 2026*
