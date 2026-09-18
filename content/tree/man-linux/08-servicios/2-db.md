# 8.2 Bases de Datos en Linux: Despliegue y Administración Profesional

---

## Introducción

Las **bases de datos** son el núcleo de prácticamente cualquier aplicación moderna. Desde plataformas web hasta sistemas financieros, toda aplicación crítica depende de un sistema de almacenamiento estructurado, consistente y eficiente.

En Linux, los motores más utilizados son **MySQL/MariaDB** y **PostgreSQL**, cada uno con características específicas. Como Sysadmin, tu responsabilidad no es solo instalarlos, sino garantizar su **seguridad, rendimiento, disponibilidad y mantenibilidad en producción**.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender las diferencias entre motores de bases de datos.
- Instalar y configurar MariaDB/MySQL y PostgreSQL.
- Gestionar bases de datos y usuarios.
- Realizar copias de seguridad y restauraciones.
- Diagnosticar problemas comunes.
- Aplicar buenas prácticas de seguridad y rendimiento.

---

## Conceptos Teóricos

### 1. Tipos de Bases de Datos Relacionales

Las bases de datos relacionales (RDBMS) organizan información en tablas.

Ejemplos:

- **MySQL / MariaDB**
- **PostgreSQL**

Características:

- SQL como lenguaje estándar.
- Soporte ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad).

---

### 2. MySQL vs MariaDB vs PostgreSQL

| Característica            | MySQL/MariaDB | PostgreSQL |
| ------------------------- | ------------- | ---------- |
| Facilidad de uso          | Alta          | Media      |
| Rendimiento web           | Excelente     | Muy bueno  |
| Funcionalidades avanzadas | Media         | Alta       |
| Extensibilidad            | Limitada      | Muy alta   |

!!! info "Recomendación práctica"
\- **MariaDB/MySQL** → aplicaciones web clásicas  
\- **PostgreSQL** → sistemas complejos, analítica, integridad avanzada

---

### 3. Arquitectura básica

Componentes principales:

- **Servidor (daemon)** → gestiona conexiones
- **Clientes** → interactúan con DB
- **Motor de almacenamiento** (InnoDB, etc.)

---

### 4. Puertos y ubicaciones

- MySQL/MariaDB → `3306`
- PostgreSQL → `5432`

Archivos:

```text
/etc/mysql/
/var/lib/mysql/

/etc/postgresql/
/var/lib/postgresql/
```

---

### 5. Seguridad básica

- autenticación por usuario
- control de acceso por IP
- cifrado opcional

---

## Laboratorio Práctico

### Escenario

Configurar un servidor MariaDB:

- crear base de datos
- crear usuario
- restringir accesos
- validar conexión

---

# Parte 1: Instalación de MariaDB

---

## Paso 1: Instalar

```bash
sudo apt update
sudo apt install mariadb-server
```

---

## Paso 2: Ver estado

```bash
systemctl status mariadb
```

---

## Paso 3: Hardening inicial

```bash
sudo mysql_secure_installation
```

Configura:

- contraseña root
- eliminar usuarios anónimos
- desactivar acceso remoto root

---

# Parte 2: Gestión básica

---

## Paso 1: Acceder a la base

```bash
sudo mysql
```

---

## Paso 2: Crear base de datos

```sql
CREATE DATABASE app_db;
```

---

## Paso 3: Crear usuario

```sql
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password_seguro';
```

---

## Paso 4: Asignar permisos

```sql
GRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Paso 5: Salir

```sql
EXIT;
```

---

## Paso 6: Verificar conexión

```bash
mysql -u app_user -p app_db
```

---

# Parte 3: Backup y restauración

---

## Crear backup

```bash
mysqldump -u root -p app_db > backup.sql
```

---

## Restaurar backup

```bash
mysql -u root -p app_db < backup.sql
```

---

# Parte 4: PostgreSQL básico

---

## Instalación

```bash
sudo apt install postgresql
```

---

## Acceso

```bash
sudo -u postgres psql
```

---

## Crear DB y usuario

```sql
CREATE DATABASE app_db;
CREATE USER app_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE app_db TO app_user;
```

---

## Errores Comunes y Troubleshooting

### 1. No conecta a la base

```bash
ss -tulnp | grep 3306
```

Verifica que el servicio está activo.

---

### 2. Acceso denegado

Error típico:

```text
Access denied for user
```

Revisar:

- usuario
- contraseña
- host

---

### 3. Servicio no arranca

```bash
journalctl -u mariadb
```

---

### 4. Base de datos corrupta

Posibles causas:

- apagado abrupto
- disco lleno

---

### 5. Conexiones remotas no funcionan

Editar:

```bash
/etc/mysql/mariadb.conf.d/50-server.cnf
```

```ini
bind-address = 0.0.0.0
```

---

### 6. Saturación de conexiones

```sql
SHOW STATUS LIKE 'Threads_connected';
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Nunca usar root en aplicaciones

Crear usuarios específicos con permisos mínimos.

---

### 2. Uso de backups automáticos

```bash
mysqldump diario + cron/systemd
```

---

### 3. Seguridad

- limitar acceso por IP
- firewall activo
- cifrado SSL si es necesario

---

### 4. Monitorización

- uso de CPU
- conexiones
- queries lentas

---

### 5. Ajustes de rendimiento

Ejemplo en MariaDB:

```ini
innodb_buffer_pool_size=1G
```

---

### 6. Logs

```bash
/var/log/mysql/error.log
```

---

### 7. Separación de roles

- servidor web ≠ servidor DB (en producción real)

---

### 8. Alta disponibilidad

- replicación
- clustering

---

## Resumen y Siguiente Paso

Has aprendido a desplegar y gestionar bases de datos en Linux, incluyendo MariaDB y PostgreSQL, cubriendo desde instalación hasta seguridad y backups. Este conocimiento es esencial para cualquier entorno de producción moderno.

El siguiente paso es trabajar con intercambio de datos entre sistemas:

➡️ **8.3 Transferencia de Archivos**, donde aprenderás a gestionar servicios como FTP, SFTP y herramientas modernas para mover datos de forma segura y eficiente.
