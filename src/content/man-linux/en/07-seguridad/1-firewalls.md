---
title: "7.1 High-Efficiency Firewalling with nftables"
description: "Next-gen packet filtering with nftables, SELinux/AppArmor, auditd event trails, and Fail2ban."
moduleNumber: "07"
moduleTitle: "Security, Firewalls (nftables) & Logs"
---

### 7.1 High-Efficiency Firewalling with nftables

Stateful packet filter table with strict drop-by-default policy:

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
