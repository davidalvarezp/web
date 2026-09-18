---
title: "Currículum Vitae"
slug: "cv"
date: 2026-09-18
draft: false
description: "CV de David Álvarez - Administrador de Sistemas, Ciberseguridad & DevSecOps."
toc:
  enable: true
  auto: true
code:
  copy: true
---

<div class="cv-container">

<div class="cv-header">
  <h1>David Álvarez</h1>
  <h2>Administrador de Sistemas | DevSecOps | Especialista en Ciberseguridad</h2>
  <div class="cv-contacts">
    <span><i class="fas fa-envelope"></i><a href="mailto:mail@dap.gal" target="_blank">mail@dap.gal</a></span>
    <span><i class="fas fa-globe"></i> <a href="https://dap.gal" target="_blank">dap.gal</a></span>
    <span><i class="fab fa-github"></i> <a href="https://github.com/davidalvarezp" target="_blank">GitHub</a></span>
    <span><i class="fab fa-linkedin"></i> <a href="https://linkedin.com/in/davidalvarezp" target="_blank">LinkedIn</a></span>
  </div>
</div>

---

## Sobre mi

Administrador de sistemas especializado en **ciberseguridad, respuesta ante incidentes e infraestructura perimetral**. 
Amplia experiencia en administración de entornos Linux/Windows Server, virtualización mediante Proxmox/LXC/Docker y securización de servicios web. 
Enfoque práctico enfocado en automatización, ingeniería de infraestructura resiliente y monitorización proactiva de amenazas.

---

## Habilidades Técnicas

| Categoría | Tecnologías // Herramientas |
| :--- | :--- |
| **Sistemas Operativos** | Linux (Debian, Ubuntu, SLES), Windows Server |
| **Infraestructura & Virtualización** | Proxmox VE, LXC, Docker, VirtualBox, Infrastructure as Code |
| **Redes & Seguridad Perimetral** | Firewalls, ACLs, NAT, VPNs, TCP/IP, DNS, DHCP, LB, SSL/TLS, Reglas de Filtrado |
| **Servicios Web & Aplicaciones** | Nginx, Apache, PHP, WordPress, NextCloud, Reverse Proxies |
| **Scripting & Automatización** | Bash, Python, GoLang |
| **Bases de Datos** | MySQL, MariaDB, SQL Server, SQLite |

---

## Experiencia Profesional

### **Especialista en Seguridad Perimetral (SOC)**

**Telefónica Cybersecurity & Cloud Tech S.L.** | *Julio 2026 - Actualidad*

* Administración, operación y optimización de infraestructuras y políticas de seguridad perimetral.
* Implementación y mantenimiento de reglas de filtrado, políticas de NAT, túneles VPN y listas de control de acceso (ACLs).
* Monitorización, análisis y respuesta ante eventos e incidentes de seguridad.
* Diagnóstico y resolución de incidencias complejas de conectividad, control de acceso y seguridad de red.

### **Administrador de Sistemas N2**

**Stellantis - Altia S.A.** | *Febrero 2026 - Junio 2026*

* Administración y mantenimiento continuo de servidores de producción sobre infraestructuras Linux y Windows.
* Resolución de incidencias de Nivel 2 en infraestructura crítica y ecosistemas de aplicaciones.
* Monitorización proactiva del rendimiento, análisis exhaustivo de logs y resolución preventiva de cuellos de botella.
* Gestión integral de bases de datos de aplicaciones (instalación, mantenimiento, políticas de backups y restauración).

### **Desarrollador Web & Analista SEO & DBA (ERASMUS+)**

**Quantum21 Ltd.** *(Lárnaca, Chipre)* | *Marzo 2025 - Junio 2025*

* Diseño, desarrollo y arquitectura de sitios web basados en WordPress.
* Desarrollo a medida de temas y extensiones mediante PHP.
* Optimización de rendimiento web (Core Web Vitals, estrategias de caching y optimización de assets).
* Auditorías y mejoras de posicionamiento mediante SEO técnico.

---

## Formación Académica

* **Bachelor en Computer Science (Ingeniería Informática)** - *UNIR* (2026 - 2028)
* **Curso de Especialización en Ciberseguridad en Entornos TIC** - *IES de Teis* (2025 - 2026)
* **CFGS en Administración de Sistemas Informáticos en Red (ASIR)** - *IES de Teis* (2023 – 2025)
* **Bachillerato Científico** - *IES de Mos* (2021 – 2023)

---

## Certificaciones

**Certificaciones técnicas oficiales:**
  - [-> Certificaciones](/certs)
  - [Credly](https://credly.com/users/davidalvarezp)
  - [LinkedIn](https://linkedin.com/in/davidalvarezp)

---

## Proyectos Destacados

* **Home Lab de Alta Disponibilidad:**

    Entorno personal multinodo compuesto por 2x Lenovo m920x, Raspberry Pi 5 y 4x PC Custom con **Proxmox VE**, **Debian 13** y contenedores **LXC**. Aloja servicios locales y expuestos bajo políticas estricta de aislamiento y proxy inverso.

<br/>

* **Pentest Stack (Framework de Auditoría Web):**

    Herramienta modular programada en Bash para la automatización de auditorías de seguridad web (escaneo de vulnerabilidades, enumeración DNS y análisis de cabeceras de seguridad). Disponible en [GitHub](https://github.com/davidalvarezp).

</div>

<style>
/* Estilos para renderizado en Web */
.cv-container { font-family: inherit; line-height: 1.6; }
.cv-header { text-align: center; margin-bottom: 2rem; }
.cv-header h1 { margin-bottom: 0.2rem; }
.cv-header h2 { font-size: 1.1rem; color: var(--theme-color, #2b6cb0); font-weight: 500; margin-top: 0; }
.cv-contacts { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 1rem; font-size: 0.9rem; }
.btn-print { margin-top: 1.2rem; padding: 0.5rem 1rem; background: #2b6cb0; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-print:hover { background: #2c5282; }

/* Estilos optimizados para IMPRESIÓN/PDF */
@media print {
  .no-print, header, footer, .sidebar, .toc, #back-to-top { display: none !important; }
  body { background: #fff !important; color: #000 !important; font-size: 11pt; }
  .cv-container { width: 100% !important; margin: 0 !important; padding: 0 !important; }
  a { color: #000 !important; text-decoration: none !important; }
  h1, h2, h3 { color: #000 !important; page-break-after: avoid; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 6px; }
}
</style>