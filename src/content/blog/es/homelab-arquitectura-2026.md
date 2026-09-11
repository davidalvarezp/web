---
title: "Mi Homelab en 2026: Proxmox, LXC y Traefik"
description: "Desglose detallado de la infraestructura física y virtual que hospeda dap.gal: Raspberry Pi 5, servidores Proxmox y edge routing."
date: 2026-05-12
author: "David Álvarez (dap)"
tags: ["Homelab","Proxmox","RaspberryPi","Traefik","LXC"]
readTimeMinutes: 10
---

## La Filosofía del Homelab

Un homelab no es solo un conjunto de máquinas haciendo ruido; es el campo de pruebas definitivo para validar tecnologías antes de llevarlas a entornos de misión crítica.

### Topología de Nodos
* **rp5-01**: Raspberry Pi 5 con 8GB RAM dedicada a DNS redundante (`ct-dns`) y firewall perimetral con nftables.
* **srv-01**: Servidor principal con almacenamiento ZFS, dashboard Homepage (`CI05-home`), bots de automatización SudoFeed y métricas Prometheus.
* **srv-02**: Servidor perimetral con Traefik reverse proxy (`ct-proxy`), servidor web Nginx (`ct-whost`) e inferencia local LLM (`ct-llm`).
