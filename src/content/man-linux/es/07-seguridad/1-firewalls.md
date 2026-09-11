---
title: "7.1 Firewall de Alta Eficiencia con nftables"
description: "Firewalls de última generación con nftables, SELinux/AppArmor, auditoría auditd y Fail2ban."
moduleNumber: "07"
moduleTitle: "Seguridad, Firewalls (nftables) & Logs"
---

### 7.1 Firewall de Alta Eficiencia con nftables

Tabla de filtrado de paquetes con política DROP por defecto:

```text
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        iif lo accept
        ct state established,related accept
        tcp dport 2222 accept
        tcp dport { 80, 443 } accept
        ip protocol icmp icmp type echo-request limit rate 5/second accept
    }
}
```
