---
title: "Curriculum Vitae"
slug: "cv"
date: 2026-09-18
draft: false
description: "David Álvarez CV - Systems Administrator, Cybersecurity & DevSecOps."
toc:
  enable: true
  auto: true
code:
  copy: true
---

<div class="cv-container">

<div class="cv-header">
  <h1>David Álvarez</h1>
  <h2>Systems Administrator | DevSecOps | Cybersecurity Specialist</h2>
  <div class="cv-contacts">
    <span><i class="fas fa-envelope"></i><a href="mailto:mail@davidalvarezp.com" target="_blank">mail@davidalvarezp.com</a></span>
    <span><i class="fas fa-globe"></i> <a href="https://davidalvarezp.com" target="_blank">davidalvarezp.com</a></span>
    <span><i class="fab fa-github"></i> <a href="https://github.com/davidalvarezp" target="_blank">GitHub</a></span>
    <span><i class="fab fa-linkedin"></i> <a href="https://linkedin.com/in/davidalvarezp" target="_blank">LinkedIn</a></span>
  </div>
</div>

---

## About Me

Systems administrator specializing in **cybersecurity, incident response, and perimeter infrastructure**. Extensive experience managing Linux/Windows Server environments, virtualization via Proxmox/LXC/Docker, and web service hardening. Practical focus on automation, resilient infrastructure engineering, and proactive threat monitoring.

---

## Technical Skills

| Category | Technologies // Tools |
| :--- | :--- |
| **Operating Systems** | Linux (Debian, Ubuntu, SLES), Windows Server |
| **Infrastructure & Virtualization** | Proxmox VE, LXC, Docker, VirtualBox, Infrastructure as Code |
| **Networking & Perimeter Security** | Firewalls, ACLs, NAT, VPNs, TCP/IP, DNS, DHCP, LB, SSL/TLS, Filtering Rules |
| **Web Services & Applications** | Nginx, Apache, PHP, WordPress, NextCloud, Reverse Proxies |
| **Scripting & Automation** | Bash, Python, GoLang |
| **Database Administration** | MySQL, MariaDB, SQL Server, SQLite |

---

## Professional Experience

### **Perimeter Security Specialist (SOC)**

**Telefónica Cybersecurity & Cloud Tech S.L.** | *July 2026 – Present*

* Administration, operation, and optimization of perimeter security infrastructures and policies.
* Implementation and maintenance of filtering rules, NAT policies, VPN tunnels, and Access Control Lists (ACLs).
* Security event and incident monitoring, analysis, and response.
* Troubleshooting and resolving complex connectivity, access control, and network security issues.

### **Tier 2 Systems Administrator**

**Stellantis - Altia S.A.** | *February 2026 – June 2026*

* Continuous administration and maintenance of production servers across Linux and Windows infrastructures.
* Tier 2 incident resolution within critical infrastructure and application ecosystems.
* Proactive performance monitoring, in-depth log analysis, and preventive bottleneck resolution.
* End-to-end database management for applications (installation, maintenance, backup, and restore policies).

### **Web Developer & SEO Analyst & DBA (ERASMUS+)**

**Quantum21 Ltd.** *(Larnaca, Cyprus)* | *March 2025 – June 2025*

* Design, development, and architecture of WordPress-based websites.
* Custom theme and plugin development using PHP.
* Web performance optimization (Core Web Vitals, caching strategies, and asset compression).
* Search engine visibility audits and enhancements via technical SEO.

---

## Education

* **Bachelor’s Degree in Computer Science** – *UNIR* (2026 – 2028)
* **Specialization Course in Cybersecurity in IT Environments** – *IES de Teis* (2025 – 2026)
* **Higher National Diploma (HND) in Network Systems Administration (ASIR)** – *IES de Teis* (2023 – 2025)
* **High School Diploma in Science & Technology** – *IES de Mos* (2021 – 2023)

---

## Certifications

**Official Technical Certifications:**
  - [-> Certifications](/certs)
  - [Credly](https://credly.com/users/davidalvarezp)
  - [LinkedIn](https://linkedin.com/in/davidalvarezp)

---

## Featured Projects

* **High Availability Home Lab:**

    Multi-node personal environment consisting of 2x Lenovo m920x, Raspberry Pi 5, and 4x Custom PCs running **Proxmox VE**, **Debian 13**, and **LXC** containers. Hosts local and public-facing services under strict isolation policies and reverse proxying.

<br/>

* **Pentest Stack (Web Audit Framework):**

    Modular tool written in Bash to automate web security audits (vulnerability scanning, DNS enumeration, and security header analysis). Available on [GitHub](https://github.com/davidalvarezp).

</div>

<style>
/* Web rendering styles */
.cv-container { font-family: inherit; line-height: 1.6; }
.cv-header { text-align: center; margin-bottom: 2rem; }
.cv-header h1 { margin-bottom: 0.2rem; }
.cv-header h2 { font-size: 1.1rem; color: var(--theme-color, #2b6cb0); font-weight: 500; margin-top: 0; }
.cv-contacts { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 1rem; font-size: 0.9rem; }
.btn-print { margin-top: 1.2rem; padding: 0.5rem 1rem; background: #2b6cb0; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-print:hover { background: #2c5282; }

/* Optimized PRINT / PDF styles */
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