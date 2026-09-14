# 5.2 Deep Dive en systemd: Gestión de Servicios y Arranque Moderno

---

## Introducción

En sistemas Linux modernos, **systemd** es el núcleo que orquesta el arranque del sistema, la gestión de servicios, el control de recursos y la supervisión de procesos. Sustituyendo al antiguo sistema **SysVinit**, systemd introduce un modelo declarativo, paralelo y altamente eficiente que permite a los Sysadmins gestionar infraestructuras complejas con precisión y consistencia.

Comprender systemd no es opcional en entornos profesionales: es esencial para diagnosticar fallos de arranque, gestionar servicios críticos, automatizar despliegues y aplicar políticas de control avanzadas.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Entender la arquitectura interna de systemd.
- Gestionar servicios con `systemctl`.
- Interpretar unidades (units) y sus tipos.
- Analizar logs con `journalctl`.
- Crear y modificar servicios personalizados.
- Diagnosticar problemas de arranque y dependencias.

---

## Conceptos Teóricos

### 1. ¿Qué es systemd?

-*systemd** es un **sistema de init** y gestor de servicios que:

- Es el proceso **PID 1**.
- Inicializa el sistema durante el arranque.
- Gestiona servicios (daemon), sockets, dispositivos y mounts.
- Permite ejecución paralela para reducir el tiempo de boot.

---

### 2. Tipos de Unidades (Units)

Las unidades son la base de systemd. Cada recurso se define como una *unit file*.

Principales tipos:

- **.service** → servicios (nginx, sshd)
- **.socket** → sockets IPC o network
- **.target** → agrupaciones lógicas (similar a runlevels)
- **.mount** → puntos de montaje
- **.timer** → tareas programadas (sustituto de cron en algunos casos)

Ejemplo de ruta estándar:

- `/usr/lib/systemd/system/` → unidades del sistema
- `/etc/systemd/system/` → overrides del administrador

---

### 3. Targets (Runlevels modernos)

Systemd reemplaza los runlevels clásicos:

| Runlevel | systemd target    |
| -------- | ----------------- |
| 0        | poweroff.target   |
| 3        | multi-user.target |
| 5        | graphical.target  |

Consultar target actual:

```bash
systemctl get-default
```

---

### 4. Ciclo de Vida de un Servicio

Estados típicos:

- **active (running)**
- **inactive**
- **failed**
- **activating**

Ver estado:

```bash
systemctl status nginx
```

---

### 5. Dependencias y Orden de Arranque

systemd permite definir relaciones:

- **Requires=** → dependencia fuerte
- **After=** → orden de arranque
- **Wants=** → dependencia débil

Ejemplo conceptual:

```ini
[Unit]
Requires=network.target
After=network.target
```

---

## Laboratorio Práctico

### Escenario

Tienes una aplicación propia (`/opt/app/app.sh`) que debe ejecutarse como servicio:

- Debe arrancar automáticamente.
- Debe reiniciarse si falla.
- Debe registrar logs correctamente.

---

### Paso 1: Crear archivo de servicio

```bash
sudo nano /etc/systemd/system/app.service
```

Contenido:

```ini
[Unit]
Description=Aplicación personalizada
After=network.target

[Service]
Type=simple
ExecStart=/opt/app/app.sh
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

---

### Explicación línea por línea

- **Description** → descripción del servicio.
- **After=network.target** → espera red disponible.
- **Type=simple** → proceso principal.
- **ExecStart** → comando a ejecutar.
- **Restart=always** → autoreinicio.
- **User** → usuario de ejecución.
- **WantedBy** → target donde se habilita.

---

### Paso 2: Recargar configuración

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
```

---

### Paso 3: Iniciar servicio

```bash
sudo systemctl start app
```

---

### Paso 4: Habilitar en arranque

```bash
sudo systemctl enable app
```

---

### Paso 5: Verificar estado

```bash
systemctl status app
```

#### Output esperado

```text
● app.service - Aplicación personalizada
   Loaded: loaded (/etc/systemd/system/app.service)
   Active: active (running)
```

---

### Paso 6: Ver logs

```bash
journalctl -u app -f
```

---

## Errores Comunes y Troubleshooting

### 1. Servicio falla al iniciar

```bash
systemctl status app
```

Busca:

- errores de permisos
- rutas incorrectas
- scripts sin shebang (`#!/bin/bash`)

---

### 2. Cambios no aplicados

-*Causa:** no recargaste daemon.

```bash
sudo systemctl daemon-reload
```

---

### 3. Servicio en estado failed

```bash
journalctl -xe
```

Revisa:

- errores de dependencias
- variables de entorno faltantes

---

### 4. Permisos incorrectos

Si el servicio usa `User=`:

```bash
chmod +x /opt/app/app.sh
```

---

### 5. Servicio en bucle de reinicio

Si usas:

```ini
Restart=always
```

Puede generar loops.

!!! warning "Bucle infinito de reinicio"
      systemd intentará reiniciar continuamente un servicio defectuoso, consumiendo recursos.

Solución alternativa:

```ini
Restart=on-failure
RestartSec=5
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Usa override en vez de editar unidades nativas

```bash
systemctl edit nginx
```

Esto crea:

```
/etc/systemd/system/nginx.service.d/override.conf
```

---

### 2. Centraliza logs con journalctl

```bash
journalctl -u nginx --since "1 hour ago"
```

---

### 3. Control de recursos (cgroups)

Ejemplo:

```ini
[Service]
MemoryLimit=500M
CPUQuota=50%
```

---

### 4. Usa timers en lugar de cron cuando sea posible

```bash
systemctl list-timers
```

Ventajas:

- mejor integración
- logs automáticos
- dependencias

---

### 5. Diagnóstico de arranque

```bash
systemd-analyze blame
```

Muestra servicios lentos.

```bash
systemd-analyze critical-chain
```

Cadena crítica de arranque.

---

### 6. Seguridad en servicios

- No ejecutar como root si no es necesario.
- Usar:

```ini
NoNewPrivileges=true
PrivateTmp=true
```

---

### 7. Validación previa

```bash
systemd-analyze verify /etc/systemd/system/app.service
```

---

## Resumen y Siguiente Paso

Ahora dominas systemd como un Sysadmin profesional: sabes cómo crear, gestionar y diagnosticar servicios, interpretar logs y controlar el arranque del sistema.

Este conocimiento es esencial para gestionar infraestructuras modernas y garantizar alta disponibilidad.

El siguiente paso natural es automatizar tareas recurrentes:

**5.3 Tareas Programadas (Cron y systemd timers)** donde aprenderás a programar ejecuciones periódicas de forma robusta y controlada.
