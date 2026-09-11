---
title: "My Homelab in 2026: Proxmox, LXC, and Traefik"
description: "In-depth breakdown of the hardware and virtualized infrastructure powering dap.gal: Raspberry Pi 5, Proxmox hypervisors, and edge routing."
date: 2026-05-12
author: "David Álvarez (dap)"
tags: ["Homelab","Proxmox","RaspberryPi","Traefik","LXC"]
readTimeMinutes: 10
---

## The Homelab Philosophy

A homelab is not merely a collection of humming servers; it is the ultimate proving ground for testing and validating enterprise tech stacks before production rollout.

### Node Topology
* **rp5-01**: Raspberry Pi 5 8GB RAM powering redundant DNS (`ct-dns`) and perimeter nftables firewalls.
* **srv-01**: Primary compute node with ZFS storage, Homepage dashboard (`CI05-home`), SudoFeed automation bots, and Prometheus metrics.
* **srv-02**: Edge ingress host running Traefik reverse proxy (`ct-proxy`), hardened Nginx instances (`ct-whost`), and local LLM inference (`ct-llm`).
