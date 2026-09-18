# 6.3 SSH Profesional: Acceso Seguro y Gestión Remota

---

## Introducción

-*SSH (Secure Shell)** es el estándar de facto para la administración remota segura en sistemas Linux. Permite a los Sysadmins conectarse, ejecutar comandos, transferir archivos y automatizar tareas en servidores distribuidos de forma cifrada y autenticada.

En entornos de producción, una mala configuración de SSH es una de las principales puertas de entrada para ataques. Por ello, dominar SSH no solo implica saber conectarse, sino **securizar, auditar y optimizar su uso** en infraestructuras críticas.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender el funcionamiento interno de SSH.
- Configurar accesos seguros basados en claves.
- Gestionar conexiones remotas de forma eficiente.
- Transferir archivos con `scp` y `rsync`.
- Securizar el servicio SSH (`sshd`).
- Diagnosticar problemas de conexión.

---

## Conceptos Teóricos

### 1. ¿Qué es SSH?

SSH es un protocolo criptográfico que permite:

- acceso remoto seguro
- ejecución de comandos
- transferencia de datos

Funciona bajo el modelo cliente-servidor:

- **ssh (cliente)**
- **sshd (servidor)**

Puerto por defecto:

```text
TCP 22
```

---

### 2. Autenticación

SSH soporta dos métodos principales:

#### 1. Contraseña

- Simple pero inseguro.
- Vulnerable a ataques brute-force.

#### 2. Clave pública/privada (recomendado)

- Mucho más seguro.
- Basado en criptografía.

Archivos clave:

- `~/.ssh/id_rsa` → clave privada
- `~/.ssh/id_rsa.pub` → clave pública

---

### 3. Proceso de conexión SSH

1. Cliente inicia conexión.
2. Intercambio de claves.
3. Verificación del servidor (**known\_hosts**).
4. Autenticación.
5. Sesión cifrada.

---

### 4. Archivos importantes

- **/etc/ssh/sshd\_config** → configuración del servidor
- **\~/.ssh/authorized\_keys** → claves permitidas
- **\~/.ssh/known\_hosts** → servidores conocidos

---

## Laboratorio Práctico

### Escenario

Quieres securizar el acceso a un servidor:

- eliminar acceso por contraseña
- usar claves SSH
- endurecer configuración

---

## Parte 1: Generación de claves

```bash
ssh-keygen -t ed25519 -C "admin@empresa"
```

---

### Explicación

- `-t ed25519` → algoritmo moderno y seguro.
- `-C` → comentario identificativo.

Archivos generados:

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

---

## Parte 2: Copiar clave al servidor

```bash
ssh-copy-id usuario@servidor
```

Alternativa manual:

```bash
cat id_ed25519.pub | ssh usuario@servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## Parte 3: Conexión sin contraseña

```bash
ssh usuario@servidor
```

---

## Parte 4: Configuración del servidor (hardening)

Editar:

```bash
sudo nano /etc/ssh/sshd_config
```

Configuración recomendada:

```ini
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 22
```

---

### Aplicar cambios

```bash
sudo systemctl restart ssh
```

!!! warning "No bloquearse fuera"
Nunca desactives autenticación por contraseña sin haber probado acceso por clave.

---

## Parte 5: Transferencia de archivos

### SCP

```bash
scp archivo.txt usuario@servidor:/tmp/
```

---

### RSYNC (más eficiente)

```bash
rsync -avz archivo.txt usuario@servidor:/tmp/
```

---

## Parte 6: Túneles SSH

Ejemplo: forward local

```bash
ssh -L 8080:localhost:80 usuario@servidor
```

Accedes a:

```text
http://localhost:8080
```

---

## Parte 7: Configuración cliente SSH

Editar:

```bash
nano ~/.ssh/config
```

Ejemplo:

```ini
Host prod
    HostName 192.168.1.10
    User admin
    IdentityFile ~/.ssh/id_ed25519
    Port 22
```

Uso:

```bash
ssh prod
```

---

## Errores Comunes y Troubleshooting

### 1. Permission denied (publickey)

-*Causas:**

- clave no copiada
- permisos incorrectos

Solución:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

### 2. Connection refused

```bash
systemctl status ssh
```

Servidor SSH no activo.

---

### 3. Timeout de conexión

- Firewall bloqueando puerto 22.
- IP incorrecta.

---

### 4. Clave rechazada

Ejecuta:

```bash
ssh -v usuario@servidor
```

Debug detallado.

---

### 5. known\_hosts conflict

```bash
ssh-keygen -R 192.168.1.10
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Deshabilitar root

```ini
PermitRootLogin no
```

---

### 2. Cambiar puerto SSH

```ini
Port 2222
```

Reduce ruido de ataques automatizados.

---

### 3. Restringir acceso por IP

```ini
AllowUsers admin@192.168.1.*
```

---

### 4. Fail2Ban

Protege contra brute-force:

```bash
apt install fail2ban
```

---

### 5. Uso de claves modernas

Preferir:

```text
ed25519
```

---

### 6. Auditoría de accesos

```bash
journalctl -u ssh
```

---

### 7. Agente SSH

Para evitar múltiples autenticaciones:

```bash
ssh-agent bash
ssh-add
```

---

### 8. Seguridad avanzada

Opciones en `sshd_config`:

```ini
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 30
```

---

## Resumen y Siguiente Paso

Has aprendido a usar SSH de forma profesional: autenticación con claves, securización del servicio, transferencia de archivos y diagnóstico de problemas. Este conocimiento es crítico para gestionar servidores remotos de forma segura y eficiente.

El siguiente paso es completar el dominio de red con herramientas de diagnóstico profundo:

➡️ **6.4 Diagnóstico de Red**, donde aprenderás a identificar problemas complejos de conectividad, latencia y routing en entornos reales.
