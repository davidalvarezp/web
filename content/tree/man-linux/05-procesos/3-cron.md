# 5.3 Tareas Programadas en Linux: Cron y systemd timers

---

## Introducción

La automatización es uno de los pilares de la administración de sistemas. En entornos Linux, la ejecución programada de tareas permite realizar mantenimientos, copias de seguridad, rotación de logs o chequeos de estado sin intervención manual. Tradicionalmente, esto se ha gestionado con **cron**, pero los sistemas modernos introducen **systemd timers** como alternativa avanzada.

Como Sysadmin, debes dominar ambos enfoques: cron por su simplicidad y compatibilidad universal, y systemd timers por su integración con el ecosistema moderno de Linux.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender cómo funciona el sistema cron.
- Escribir y gestionar tareas programadas con crontab.
- Interpretar la sintaxis de programación temporal.
- Diagnosticar fallos en ejecuciones automáticas.
- Implementar tareas programadas con systemd timers.
- Elegir entre cron y systemd según el caso de uso.

---

## Conceptos Teóricos

### 1. ¿Qué es cron?

-*cron** es un servicio que ejecuta comandos o scripts en intervalos definidos.

Componentes clave:

- **crond:** daemon que ejecuta tareas.
- **crontab:** archivo donde se definen las tareas.

---

### 2. Sintaxis de crontab

Cada línea tiene 5 campos temporales + comando:

```text
- * * * * comando
│ │ │ │ │
│ │ │ │ └── Día semana (0-7)
│ │ │ └──── Mes (1-12)
│ │ └────── Día mes (1-31)
│ └──────── Hora (0-23)
└────────── Minuto (0-59)
```

Ejemplo:

```bash
0 2 * * * /usr/local/bin/backup.sh
```

➡️ Ejecuta a las **02:00 cada día**.

---

### 3. Tipos de crontab

- Usuario:

```bash
crontab -e
```

- Sistema:

```bash
/etc/crontab
/etc/cron.d/
```

Diferencia clave:

- `/etc/crontab` incluye campo de usuario:

```text
0 3 * * * root /script.sh
```

---

### 4. Variables de entorno en cron

Cron ejecuta en un entorno mínimo:

Variables importantes:

```text
PATH
HOME
SHELL
```

!!! warning "Entorno limitado"
        Muchos scripts fallan en cron porque dependen de variables que no están definidas.

---

### 5. systemd timers

Alternativa moderna a cron:

Ventajas:

- Integración con systemd.
- Registro centralizado en journal.
- Mejor control de dependencias.
- Mayor flexibilidad temporal.

Ejemplo:

- `backup.service`
- `backup.timer`

---

## Laboratorio Práctico

### Escenario

Necesitas programar una copia de seguridad diaria y asegurarte de que:

- Se ejecuta automáticamente.
- Registra logs.
- Puede auditarse fácilmente.

---

## Parte 1: Implementación con cron

### Paso 1: Editar crontab

```bash
crontab -e
```

---

### Paso 2: Añadir tarea

```bash
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

#### Explicación

- `0 2 * * *` → ejecución diaria a las 02:00.
- `>>` → append a log.
- `2>&1` → redirige errores a log.

---

### Paso 3: Verificar tareas

```bash
crontab -l
```

---

### Paso 4: Comprobar logs

```bash
cat /var/log/backup.log
```

---

## Parte 2: Implementación con systemd timers

### Paso 1: Crear servicio

```bash
sudo nano /etc/systemd/system/backup.service
```

Contenido:

```ini
[Unit]
Description=Backup diario

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

---

### Paso 2: Crear timer

```bash
sudo nano /etc/systemd/system/backup.timer
```

Contenido:

```ini
[Unit]
Description=Timer de backup diario

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

---

### Explicación

- **OnCalendar** → programación temporal.
- **Persistent=true** → ejecuta si el sistema estuvo apagado.

---

### Paso 3: Activar timer

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer
```

---

### Paso 4: Ver timers activos

```bash
systemctl list-timers
```

---

### Paso 5: Ver logs

```bash
journalctl -u backup.service
```

---

## Errores Comunes y Troubleshooting

### 1. Script funciona manualmente pero no en cron

-*Causa:**

- PATH incorrecto.

-*Solución:**

```bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

Añadir al inicio del crontab.

---

### 2. No se ejecuta la tarea

Verifica:

```bash
systemctl status cron
```

---

### 3. Falta de permisos

Cron no ejecuta si no tiene permisos:

```bash
chmod +x script.sh
```

---

### 4. Problemas de entorno

Usa rutas absolutas siempre:

```bash
/home/user/script.sh
```

---

### 5. Timer no ejecuta

Verifica:

```bash
systemctl status backup.timer
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Redirección de logs siempre

```bash
>> /var/log/script.log 2>&1
```

---

### 2. Evita solapamiento de ejecuciones

Usa flock:

```bash
flock -n /tmp/script.lock /usr/local/bin/script.sh
```

---

### 3. Usa systemd timers para producción crítica

Ventajas:

- tolerancia a fallos
- logs centralizados
- dependencias

---

### 4. Centraliza scripts

Ubicaciones recomendadas:

- `/usr/local/bin`
- `/opt/scripts`

---

### 5. Monitoriza ejecuciones

Ejemplo simple:

```bash
grep CRON /var/log/syslog
```

---

### 6. Seguridad

- No ejecutes como root si no es necesario.
- Valida scripts antes de programar.

---

### 7. Versionado

Guarda scripts en Git:

```bash
git init /opt/scripts
```

---

## Resumen y Siguiente Paso

Ahora dominas la automatización en Linux mediante cron y systemd timers. Sabes cuándo usar cada herramienta, cómo programar tareas fiables y cómo diagnosticar fallos en entornos reales.

Este conocimiento es clave para mantener sistemas autónomos y reducir la intervención manual.

El siguiente paso es aplicar todo esto en el ámbito de red:

**6.1 Configuración de Red en Linux**, donde aprenderás a configurar interfaces, routing y conectividad en entornos productivos.
