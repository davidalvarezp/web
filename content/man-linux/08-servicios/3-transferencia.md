# 8.3 Transferencia de Archivos en Linux: SFTP, SCP, Rsync y FTP

---

## Introducción

La transferencia de archivos es una necesidad fundamental en cualquier entorno Linux: despliegues de aplicaciones, backups, sincronización entre servidores, distribución de datos, etc. Realizar estas operaciones de forma eficiente y segura es una responsabilidad clave de cualquier Sysadmin.

Existen múltiples herramientas y protocolos para la transferencia de datos en Linux. En entornos modernos, destacan **SCP, SFTP y Rsync** por su integración con SSH y su enfoque seguro, mientras que **FTP** queda relegado a entornos legacy o específicos.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender los principales protocolos de transferencia en Linux.
- Transferir archivos de forma segura con SCP y SFTP.
- Sincronizar datos eficientemente con Rsync.
- Configurar servicios de transferencia.
- Diagnosticar problemas de transferencias.
- Aplicar buenas prácticas de seguridad y automatización.

---

## Conceptos Teóricos

### 1. Tipos de transferencia de archivos

#### FTP (File Transfer Protocol)

- Protocolo clásico.
- **No cifrado** → inseguro.
- Usa puerto 21.

#### SFTP (SSH File Transfer Protocol)

- Basado en SSH.
- Transferencia cifrada.
- Muy usado en producción.

#### SCP (Secure Copy)

- Transferencia directa sobre SSH.
- Simple y rápida.

#### Rsync

- Sincronización inteligente.
- Solo transfiere diferencias.
- Optimiza ancho de banda.

---

### 2. Comparativa rápida

| Herramienta | Seguridad | Eficiencia | Uso típico           |
| ----------- | --------- | ---------- | -------------------- |
| FTP         | ❌         | Media      | Legacy               |
| SFTP        | ✅         | Media      | Transferencia segura |
| SCP         | ✅         | Media      | Copias rápidas       |
| Rsync       | ✅         | ✅✅         | Sincronización       |

---

### 3. Integración con SSH

SCP, SFTP y Rsync utilizan SSH, lo que implica:

- cifrado
- autenticación por claves
- control de acceso

---

## Laboratorio Práctico

### Escenario

Necesitas:

- transferir archivos a un servidor remoto
- sincronizar backups
- asegurar el canal de transferencia

---

# Parte 1: Transferencia con SCP

---

## Paso 1: Copiar archivo al servidor

```bash
scp archivo.txt usuario@servidor:/tmp/
```

---

## Paso 2: Copiar desde servidor

```bash
scp usuario@servidor:/tmp/archivo.txt .
```

---

## Paso 3: Copiar directorio

```bash
scp -r carpeta/ usuario@servidor:/tmp/
```

---

### Explicación

- `-r` → recursivo
- sintaxis similar a `cp`

---

# Parte 2: Transferencia con SFTP

---

## Paso 1: Conectar

```bash
sftp usuario@servidor
```

---

## Paso 2: Navegación

```bash
ls
cd /tmp
```

---

## Paso 3: Subir archivo

```bash
put archivo.txt
```

---

## Paso 4: Descargar archivo

```bash
get archivo.txt
```

---

## Paso 5: Salir

```bash
exit
```

---

# Parte 3: Sincronización con Rsync

---

## Paso 1: Copia básica

```bash
rsync -av archivo.txt usuario@servidor:/tmp/
```

---

## Paso 2: Sincronizar directorio

```bash
rsync -av /local/ usuario@servidor:/remoto/
```

---

## Paso 3: Eliminar archivos obsoletos

```bash
rsync -av --delete /local/ usuario@servidor:/remoto/
```

---

### Explicación

- `-a` → modo archivo (preserva permisos, timestamps)
- `-v` → verbose
- `--delete` → elimina en destino lo que no existe en origen

---

## Paso 4: Compresión

```bash
rsync -avz /local/ usuario@servidor:/remoto/
```

---

## Paso 5: Uso con SSH específico

```bash
rsync -av -e ssh carpeta/ usuario@servidor:/destino/
```

---

# Parte 4: Configuración básica de FTP (vsftpd)

---

## Instalación

```bash
sudo apt install vsftpd
```

---

## Configuración

```bash
sudo nano /etc/vsftpd.conf
```

Opciones básicas:

```ini
anonymous_enable=NO
local_enable=YES
write_enable=YES
```

---

## Reiniciar

```bash
sudo systemctl restart vsftpd
```

!!! warning "FTP inseguro"
FTP transmite datos en claro. Solo usar en redes aisladas o migrar a SFTP.

---

## Errores Comunes y Troubleshooting

### 1. Permission denied (SSH)

- clave incorrecta
- permisos mal configurados

```bash
chmod 600 ~/.ssh/id_ed25519
```

---

### 2. Conexión rechazada

```bash
systemctl status ssh
```

---

### 3. Rsync no sincroniza correctamente

Revisar:

- rutas origen/destino
- uso correcto de `/`

---

### 4. Velocidad lenta

- sin compresión (`-z`)
- latencia alta

---

### 5. Firewall bloqueando

```bash
ufw allow 22/tcp
```

---

### 6. FTP no conecta

- puerto 21 cerrado
- modo pasivo no configurado

---

## Buenas Prácticas (Nivel Senior)

### 1. Priorizar SSH siempre

Usar:

- SCP
- SFTP
- Rsync

Evitar FTP.

---

### 2. Automatización de backups

Ejemplo con cron:

```bash
rsync -av --delete /data/ backup@server:/backup/
```

---

### 3. Uso de claves SSH

Evitar contraseñas en scripts.

---

### 4. Limitación de acceso

- chroot en SFTP
- restringir usuarios

---

### 5. Logging

Monitorizar:

```bash
journalctl -u ssh
```

---

### 6. Ancho de banda limitado

```bash
rsync --bwlimit=1000
```

---

### 7. Verificación previa

```bash
rsync -av --dry-run /src/ /dst/
```

---

### 8. Integridad de datos

Usar checksums:

```bash
rsync -avc
```

---

## Resumen y Siguiente Paso

Has aprendido a transferir archivos en Linux utilizando herramientas modernas como SCP, SFTP y Rsync, entendiendo sus diferencias, ventajas y casos de uso. También conoces las limitaciones del FTP y cómo manejarlo en entornos legacy.

Este conocimiento es esencial para gestionar datos de forma eficiente y segura en cualquier infraestructura.

El siguiente paso es automatizar operaciones a gran escala:

➡️ **9.1 Bash Scripting Pro**, donde aprenderás a crear scripts avanzados para automatizar completamente la administración de sistemas.
