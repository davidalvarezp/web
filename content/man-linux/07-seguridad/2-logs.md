# 7.2 Auditoría y Logs en Linux

---

## Introducción

En cualquier sistema Linux en producción, **los logs son la principal fuente de verdad**. Cuando algo falla —ya sea un servicio, una conexión o un intento de intrusión— la única forma fiable de entender qué ha ocurrido es a través de los registros generados por el sistema.

La auditoría y análisis de logs no es solo una tarea reactiva: es una disciplina crítica para la **seguridad, cumplimiento normativo, diagnóstico y observabilidad**. Un Sysadmin senior no solo lee logs, sino que los centraliza, correlaciona y los convierte en información accionable.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Entender cómo Linux genera y gestiona logs.
- Utilizar `journalctl` para analizar eventos del sistema.
- Localizar logs tradicionales en `/var/log`.
- Diagnosticar problemas mediante logs.
- Implementar auditoría básica del sistema.
- Identificar eventos de seguridad relevantes.

---

## Conceptos Teóricos

### 1. ¿Qué es un log?

Un **log** es un registro cronológico de eventos generados por:

- el kernel
- servicios (`nginx`, `ssh`, etc.)
- aplicaciones
- usuarios

Ejemplo:

```text
May 20 12:00:01 server sshdFailed password for root from 10.0.0.5
```

---

### 2. systemd-journald

En sistemas modernos, los logs se gestionan mediante:

- **systemd-journald**

Ventajas:

- centralización
- indexación
- filtrado avanzado
- persistencia opcional

---

### 3. Logs tradicionales

Ubicación:

```text
/var/log/
```

Archivos importantes:

- **/var/log/syslog** → eventos generales
- **/var/log/auth.log** → autenticación
- **/var/log/kern.log** → kernel
- **/var/log/nginx/access.log** → acceso web

---

### 4. journalctl

Herramienta principal para consultar logs en systemd:

```bash
journalctl
```

Permite:

- filtrar por servicio
- buscar por fecha
- seguir logs en tiempo real

---

### 5. Rotación de logs

Para evitar llenar el disco:

- herramienta: **logrotate**

Config:

```text
/etc/logrotate.conf
/etc/logrotate.d/
```

---

### 6. Auditoría vs Logging

- **Logging:** registro de eventos
- **Auditoría:** análisis orientado a seguridad y trazabilidad

---

## Laboratorio Práctico

### Escenario

Un servicio web (`nginx`) falla intermitentemente. Necesitas:

- analizar logs
- identificar la causa
- detectar posibles accesos sospechosos

---

## Paso 1: Ver logs del sistema

```bash
journalctl -xe
```

### Explicación

- `-x` → contexto adicional
- `-e` → ir al final

---

## Paso 2: Filtrar por servicio

```bash
journalctl -u nginx
```

---

## Paso 3: Tiempo real

```bash
journalctl -u nginx -f
```

---

## Paso 4: Filtrado por tiempo

```bash
journalctl --since "1 hour ago"
```

Ejemplo:

```bash
journalctl --since "2026-05-20 10:00:00"
```

---

## Paso 5: Revisar logs tradicionales

```bash
cat /var/log/nginx/error.log
```

---

## Paso 6: Monitorización en vivo

```bash
tail -f /var/log/nginx/access.log
```

---

## Paso 7: Buscar errores específicos

```bash
grep "error" /var/log/nginx/error.log
```

---

## Paso 8: Аналizar accesos SSH

```bash
cat /var/log/auth.log | grep ssh
```

---

## Paso 9: Identificar intentos fallidos

```bash
grep "Failed password" /var/log/auth.log
```

---

## Paso 10: Uso de logrotate

Ver configuración:

```bash
cat /etc/logrotate.conf
```

---

## Errores Comunes y Troubleshooting

### 1. Logs no persistentes

Por defecto, journald puede no guardar logs tras reinicio.

Solución:

Editar:

```bash
sudo nano /etc/systemd/journald.conf
```

```ini
Storage=persistent
```

---

### 2. Disco lleno por logs

Ver uso:

```bash
du -sh /var/log
```

Limpiar:

```bash
journalctl --vacuum-time=7d
```

---

### 3. No aparecen logs de servicio

Verificar:

```bash
systemctl status servicio
```

---

### 4. Logs rotados no accesibles

```bash
ls /var/log/*.gz
```

Leer:

```bash
zcat archivo.log.gz
```

---

### 5. Permisos insuficientes

Muchos logs requieren root:

```bash
sudo journalctl
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Centralización de logs

Usar:

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Graylog

---

### 2. Política de retención

Ejemplo:

- logs críticos → 90 días
- logs normales → 30 días

---

### 3. Monitorización proactiva

Ejemplo:

```bash
grep -i error /var/log/syslog
```

Automatizar alertas.

---

### 4. Seguridad

Monitorizar:

```bash
Failed password
Invalid user
Accepted password
```

---

### 5. Evitar saturación

Configurar límites:

```bash
SystemMaxUse=500M
```

---

### 6. Logs estructurados

Preferir aplicaciones que generen JSON logs.

---

### 7. Auditoría avanzada (auditd)

Instalar:

```bash
sudo apt install auditd
```

Ejemplo:

```bash
auditctl -w /etc/passwd -p wa
```

---

### 8. Correlación de eventos

No analizar logs de forma aislada:

- correlacionar red + sistema + app

---

## Resumen y Siguiente Paso

Has aprendido a gestionar, analizar y auditar logs en Linux, utilizando tanto journald como logs tradicionales. Ahora puedes diagnosticar problemas complejos, detectar incidentes de seguridad y optimizar el almacenamiento de registros.

Este conocimiento es esencial para cualquier Sysadmin en producción.

El siguiente paso es entrar en uno de los sistemas de seguridad más potentes (y complejos) de Linux:

➡️ **7.3 SELinux y AppArmor**, donde aprenderás a controlar el acceso a nivel de políticas de seguridad obligatorias (MAC).
