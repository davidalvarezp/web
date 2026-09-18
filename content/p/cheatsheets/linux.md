---
title: Linux Cheatsheet
description: Comandos esenciales de Linux para administración de sistemas, procesos, red y troubleshooting.
---

# 🐧 Linux Cheatsheet

Referencia rápida para administración de sistemas Linux en entornos reales.

---

## Archivos y directorios

```bash
ls -lah
tree -L 2
pwd
cd /ruta

cp archivo destino
cp -r carpeta destino

mv archivo destino
rm archivo
rm -rf carpeta

find / -name archivo
find / -type f -size +100M

du -sh *
df -h
```

***

## Usuarios y grupos

```bash
whoami
id

adduser usuario
userdel usuario

groupadd grupo
usermod -aG grupo usuario

passwd usuario
```

***

## Permisos

```bash
chmod 644 archivo
chmod 600 archivo
chmod +x script.sh

chown user:group archivo
chown -R user:group carpeta

umask
```

***

## Procesos

```bash
ps aux
top
htop

kill PID
kill -9 PID
pkill nombre

nice -n 10 comando
renice 10 PID
```

***

## Gestión de paquetes

### Debian / Ubuntu

```bash
apt update
apt upgrade

apt install paquete
apt remove paquete
apt purge paquete
apt autoremove
```

### RHEL / Rocky / CentOS

```bash
dnf update
dnf install paquete
dnf remove paquete
```

***

## Red

```bash
ip a
ip r

ss -tulnp
netstat -tulnp

ping 8.8.8.8
traceroute google.com

curl https://example.com
wget https://example.com/file

dig google.com
nslookup google.com
```

***

## Puertos y conexiones

```bash
ss -tuln
lsof -i :80
fuser 80/tcp
```

***

## Disco y almacenamiento

```bash
lsblk
blkid

mount /dev/sda1 /mnt
umount /mnt

df -h
du -sh *

fdisk -l
```

***

## Logs

```bash
journalctl -xe
journalctl -u nginx

tail -f /var/log/syslog
tail -f /var/log/auth.log
```

***

## SSH

```bash
ssh user@host
ssh -i clave.pem user@host

scp archivo user@host:/ruta
rsync -avz origen destino
```

***

## Seguridad básica

```bash
ufw status
ufw enable
ufw allow 22

fail2ban-client status
```

***

## Systemd (servicios)

```bash
systemctl status nginx
systemctl start nginx
systemctl stop nginx
systemctl restart nginx

systemctl enable nginx
systemctl disable nginx
```

***

## Variables y entorno

```bash
env
printenv

export VAR=valor
echo $VAR
```

***

## Procesamiento de texto

```bash
cat archivo
less archivo

grep "texto" archivo
grep -r "texto" .

awk '{print $1}' archivo
cut -d ":" -f1 archivo

sort archivo
uniq archivo
```

***

## Monitorización rápida

```bash
uptime
free -h
vmstat 1

iostat
top
htop
```

***

## Compresión

```bash
tar -cvf archivo.tar carpeta/
tar -xvf archivo.tar

tar -czvf archivo.tar.gz carpeta/
tar -xzvf archivo.tar.gz

zip archivo.zip archivo
unzip archivo.zip
```

***

## Troubleshooting rápido

```bash
dmesg | tail
journalctl -p 3 -xb

ss -tulnp
top
df -h
free -h
```

***

## Tips

* Usa `history | grep comando` para encontrar comandos anteriores
* Alias útiles:

```bash
alias ll='ls -lah'
alias gs='git status'
```

* Comprueba servicios antes de reiniciar:

```bash
systemctl status servicio
```

***

## Básico para automatización

```bash
watch -n 1 comando

xargs -n1 comando
```

***

> Pensado para uso real  
> Optimizado para copiar/pegar  
> Enfocado en sysadmin, DevOps y seguridad
