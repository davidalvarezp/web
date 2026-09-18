---
weight: 1
title: "WebSec-Audit: Professional Web Security Audit Framework in Bash"
date: 2026-03-23
draft: false
description: "WebSec-Audit is a modular Bash framework for professional web security audits. 15+ modules: recon, SQLi, XSS, SSRF, SSL/TLS, CORS, subdomain takeover and more. Generates HTML, JSON and TXT reports."
author: "dap"

lightgallery: true

math:
  enable: false
---

# WebSec-Audit

**Professional web security audit framework** — modular, extensible and production-ready.

> **Legal notice:** This tool is designed exclusively for testing systems you own or have explicit written authorisation to test. Unauthorised use against third-party systems is illegal.

---

## What is WebSec-Audit?

WebSec-Audit is a modular Bash FrameWork that automates comprehensive, professional web security audits against any authorised target. It is designed to run on **Debian, Ubuntu and Kali Linux**, and covers most of the attack surface a pentester or security analyst needs to evaluate in a web application.

I built it as a personal project during my **Cybersecurity Specialization degree**, with the goal of having my own modular tool that can be easily adapted to different engagements.

The result is a framework of over **2,500 lines of Bash** integrating more than 15 independent modules, a structured findings engine and a report generator in three formats.

---

## Modules

| # | Module | Description | Key Tools |
|---|--------|-------------|-----------|
| 00 | Target Info | IP resolution and directory init | `dig`, `host` |
| 01 | Reconnaissance | WHOIS, DNS, AXFR, subdomain enum, SPF/DMARC, Google Dorks | `whois`, `subfinder`, `amass`, `dnsrecon` |
| 02 | Port Scanning | Service detection and risk-based port analysis | `nmap` |
| 03 | Fingerprinting | Tech stack, WAF detection, version leakage | `whatweb`, `wafw00f` |
| 04 | SSL/TLS | Protocols, ciphers, certificate expiry, HSTS | `testssl.sh`, `sslscan`, `openssl` |
| 05 | HTTP Headers | CSP, cookie flags, clickjacking, HTTP→HTTPS redirect | `curl` |
| 06 | Dir & Files | Directory brute-force + 40 known sensitive path probes | `gobuster`, `ffuf`, `dirb` |
| 07 | Nikto | Known web vulnerabilities, CVEs, misconfigurations | `nikto` |
| 08 | SQL Injection | Automated SQLi detection and exploitation | `sqlmap` |
| 09 | XSS | Reflected and DOM-based XSS across common parameters | `dalfox`, `curl` |
| 10 | CMS | WordPress, Drupal, Joomla, Magento | `wpscan`, `droopescan` |
| 11 | CORS | Reflected origins, wildcard, credentialed cross-origin | `curl` |
| 12 | Open Redirect | 20 params × 10 redirect payloads | `curl` |
| 13 | SSRF | AWS/GCP/Azure IMDS, internal IP probing | `curl` |
| 14 | Subdomain Takeover | Dangling CNAMEs across 20+ external services | `subjack`, `nuclei` |
| 15 | Nuclei | CVE and misconfiguration templates | `nuclei` |

---

## Scan modes

The script supports three modes:

**Normal** (default): balanced coverage and speed.

```bash
./websec-audit.sh -t https://target.com
```

**Aggressive** (`--aggressive`): deeper scan, more noise. nmap with `-A -O --script=vuln`, sqlmap level 5 with tamper scripts, full crawl, dalfox with deep DOM XSS.

```bash
./websec-audit.sh -t https://target.com --aggressive -T 20
```

**Stealth** (`--stealth`): slower, lower detection footprint. nmap `-T2 -f`, sqlmap with delays and safe-freq.

```bash
./websec-audit.sh -t https://target.com --stealth
```

---

## Modular control

Any module can be disabled independently:

```bash
./websec-audit.sh -t https://target.com --skip-nikto --skip-sqli --skip-cms
```

This lets you tailor the scan to the scope of each engagement, reduce total runtime or avoid tools that generate too much noise in sensitive environments.

---

## Proxy support

All traffic can be routed through Burp Suite or any other HTTP proxy:

```bash
./websec-audit.sh -t https://target.com --proxy http://127.0.0.1:8080
```

---

## Reports

On completion, the script generates three report formats under `results_<domain>_<timestamp>/reports/`:

### Interactive HTML dashboard

The most visual format. Includes:
- Summary panel with counters per severity (CRITICAL / HIGH / MEDIUM / LOW / INFO)
- Visual risk bar
- Findings table with live severity filter and full-text search
- Evidence and remediation recommendation per finding
- Scan metadata: target, IP, duration, mode, modules executed

### Structured JSON

Fully structured format with a metadata envelope, summary and findings array. Ideal for integrating with other tools or automated pipelines.

```json
{
  "metadata": { "target": "https://target.com", "duration_secs": 342 },
  "summary":  { "total": 18, "critical": 2, "high": 5 },
  "findings": [
    {
      "severity": "CRITICAL",
      "module": "RECON",
      "title": "DNS Zone Transfer (AXFR) permitted",
      "evidence": "...",
      "recommendation": "Restrict AXFR to authorised secondary name servers only."
    }
  ]
}
```

### Plain-text log

Full timestamped log for archiving or inclusion in formal audit reports.

---

## Output structure

```
results_target_20260323_120000/
├── logs/
│   ├── audit_20260323_120000.log
│   └── findings.jsonl
├── recon/          (WHOIS, DNS, subdomains, WhatWeb, WAF, Dorks)
├── portscan/       (nmap .txt .xml .gnmap)
├── ssl/            (testssl.json, sslscan.txt)
├── headers/        (response headers)
├── dirs/           (gobuster, sensitive paths found)
├── vulns/          (sqlmap, xss, nuclei)
├── cms/            (wpscan, droopescan)
├── misc/           (cors, open_redirect, ssrf, subtakeover)
└── reports/
    ├── report_*.html
    ├── report_*.json
    └── report_*.txt
```

---

## Installation

### Automatic install (recommended)

```bash
git clone https://github.com/davidalvarezp/websec-audit.git
cd websec-audit
chmod +x install.sh websec-audit.sh
sudo ./install.sh
```

The `install.sh` script detects the system, installs all required APT packages and downloads pre-compiled Go binaries (gobuster, subfinder, ffuf, dalfox, subjack, nuclei, amass) for the correct architecture.

### Required dependencies

Only `curl` and `nmap` are strictly required. All other tools are optional and expand the coverage of each module.

---

## Usage examples

```bash
# Standard scan
./websec-audit.sh -t https://target.com

# Aggressive scan with 20 threads, JSON output only
./websec-audit.sh -t https://target.com --aggressive -T 20 --format json -o /tmp/audit

# Stealth scan through Burp Suite
./websec-audit.sh -t https://target.com --stealth --proxy http://127.0.0.1:8080

# Fast scan skipping slow modules
./websec-audit.sh -t https://target.com --skip-nikto --skip-sqli -v

# Full port scan in aggressive mode
./websec-audit.sh -t https://target.com --ports full --depth 5 --aggressive
```

---

## Design decisions

A few choices worth explaining:

**Why Bash?** Bash is universally available on every Linux distribution used in security work, requires no runtime dependencies, and integrates natively with the tool ecosystem (nmap, sqlmap, gobuster, etc.). A Python wrapper would add flexibility but also a dependency layer that breaks in constrained environments.

**Why modular?** Every engagement has a different scope. Being able to disable individual modules with a single flag means the same tool works for a quick header audit, a full black-box assessment, or anything in between.

**Why three report formats?** HTML is for humans reviewing findings interactively. JSON is for programmatic processing, integration with ticketing systems or feeding into a SIEM. TXT is for formal audit deliverables that need to be plaintext.

**Why JSONL for findings?** Each finding is written as a single JSON line to `findings.jsonl` as it is discovered. This means a partial run (interrupted by Ctrl-C) still produces a valid, processable findings file.

---

## Repository

The project is published on GitHub under the MIT licence. It includes full documentation, an automatic installer, CI with ShellCheck, issue and PR templates, and a CHANGELOG.

🔗 **[github.com/davidalvarezp/websec-audit](https://github.com/davidalvarezp/websec-audit)**

Contributions are welcome. If you find a bug or have an idea for a new module, open an issue or a pull request following the guide in [CONTRIBUTING.md](https://github.com/davidalvarezp/websec-audit/blob/main/CONTRIBUTING.md).

---

*Last update: March 2026*
