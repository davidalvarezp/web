---
title: "Mi Homelab"
slug: homelab
date: 2026-09-14
draft: false
description: "Mi Homelab"
author: "dap"
aliases:
  - homelab
---

# Mi Homelab

---

## Hardware

| Hostname        | IP                            | Especificaciones                                              |
|-----------------|-------------------------------|---------------------------------------------------------------|
| **rt-01**       | 10.0.10.1                     | TP-Link TL-R605 v2                                            |
| **sw-01**       | 10.0.10.254                   | Netgear GS308Lv4                                              |
| **rp-01**       | 10.0.10.10                    | Raspberry Pi 5 8GB + M.2 Hat + 128GB NVME                     |
| **sv-01**       | 10.0.10.11                    | Lenovo m920x - i3 16GB 256GB NVME                             |
| **sv-02**       | 10.0.10.12                    | Lenovo m920x - i3 16GB 256GB NVME                             |
| **sv-03**       | 10.0.10.13                    | PC Custom - Ryzen 5 3400G + 16GB + 256GB NVME + 2x1TB SSD     |

---

## NetMap

Router: TP-Link TL-R605 v2
Switch: Netgear GS308Lv4

vlanes:
    vlan10 (lan/infraestructura): 10.0.10.0/24
    vlan20 (loc/servicios locales): 10.0.20.0/24
    vlan40 (dmz/servicios expuestos): 10.0.40.0/24
    VLAN99 (vpn/Wireguard OpenVPN): 10.0.99.0/24

router:
  - WAN 192.168.1.254
  - vlan_lan 10.0.10.1
  - vlan_loc 10.0.20.1
  - vlan_dmz 10.0.40.1


switch 10.0.10.254 (-> router)

rp-01 10.0.10.10 (-> router)

sv-01 10.0.10.11 (-> switch)
  - ct-home     10.0.10.100 (homepage)
  - ct-dns      10.0.10.101 (pi-hole)
  - ct-stats    10.0.20.51 (prometheus+grafana)
  - ct-n8n      10.0.20.55 (n8n)
  - ct-cloud    10.0.20.102 (nextcloud)
  - ct-photo    10.0.20.103 (immich)

sv-02 10.0.10.12 (-> switch)
  - ct-tunnel   10.0.40.50 (claudflared)
  - ct-proxy    10.0.40.51 (traefik)
  - ct-whost    10.0.40.52 (nginx)
  - ct-cloud    10.0.40.xx (nextcloud)

sv-03 10.0.10.13
  - vm-nas      10.0.10.111 (TrueNAS Scale)
  - ct-llms     10.0.10.112 (llama.cpp local)
  - ct-mc       10.0.40.99 (minecraft server)


---

## Firewall

### VLAN10
  -

### VLAN20
  -

### VLAN40
  -


---

## Software

| Hostname        | IP                | Sistema Operativo     | Software                                          |
|-----------------|-------------------|-----------------------|---------------------------------------------------|
| **rp-01**       | 10.0.10.10        | Raspberry Pi OS Lite  |                                                   |
| **sv-01**       | 10.0.10.11        | Proxmox V.E. 9.2.2    |                                                   |
| **sv-02**       | 10.0.10.12        | Proxmox V.E. 9.2.2    |                                                   |
| **sv-03**       | 10.0.10.13        | Proxmox V.E. 9.2.2    |                                                   |
|                 |                   |                       |                                                   |
| **ct-dns**      | 10.0.10.101       | Debian 13 Minimal     | pi-hole + prometheus-node-exporter                |
| **ct-home**     | 10.0.10.100       | Debian 13 Minimal     | homepage + npm + prometheus-node-exporter         |
| **ct-stats**    | 10.0.20.51:3000   | Debian 13 Minimal     | prometheus + grafana + prometheus-node-exporter   |
|                 |                   |                       |                                                   |
| **ct-proxy**    | 10.0.40.50        | Debian 13 Minimal     | traefik                                           |
| **ct-whost**    | 10.0.40.51        | Debian 13 Minimal     | nginx                                             |
|-----------------|-------------------|-----------------------|---------------------------------------------------|

---

Documentación extendida & PRA: Comming soon...