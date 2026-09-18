# 9.1 Automatización con Bash en Entornos Linux

---

## Introducción

La automatización es una de las competencias clave de cualquier administrador de sistemas moderno. En entornos Linux, **Bash** actúa como la herramienta fundamental para orquestar tareas, integrar herramientas del sistema y eliminar trabajo manual repetitivo.

Un Sysadmin no automatiza únicamente por conveniencia, sino por **consistencia, trazabilidad y fiabilidad**. Un script bien diseñado garantiza que una operación crítica se ejecute siempre de la misma manera, reduciendo errores humanos y facilitando auditorías.

En este capítulo, se abordan los fundamentos de Bash desde una perspectiva profesional, orientada a uso en producción.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender el funcionamiento de Bash como intérprete y lenguaje de scripting.
- Escribir scripts estructurados y mantenibles.
- Implementar control de flujo mediante condicionales y bucles.
- Gestionar errores y códigos de retorno.
- Crear automatizaciones reales listas para entornos productivos.

---

## Conceptos Teóricos

### 1. Bash como intérprete y lenguaje

Bash (Bourne Again Shell) es el intérprete de comandos por defecto en la mayoría de distribuciones Linux. Su rol es:

- interpretar comandos del usuario
- ejecutar procesos
- encadenar utilidades del sistema
- automatizar tareas mediante scripts

Cada comando ejecutado devuelve un **código de salida (exit code)**:

- `0` → ejecución correcta
- `≠ 0` → error

Este comportamiento es fundamental para la lógica condicional en automatización.

---

### 2. Estructura de un script Bash

Todo script profesional debe comenzar con el **shebang**, que define el intérprete:

```bash
#!/usr/bin/env bash
```

Estructura típica:

```bash
#!/usr/bin/env bash

set -euo pipefail

# Variables
# Funciones
# Lógica principal
```

Permisos de ejecución:

```bash
chmod +x script.sh
```

!!! info "Buenas bases"
Un script sin `set -euo pipefail` en producción es propenso a fallos silenciosos.

---

### 3. Variables y expansión

Las variables en Bash no tienen tipo explícito:

```bash
USUARIO="admin"
RUTA="/var/log"
```

Uso:

```bash
echo "$USUARIO"
```

Buenas prácticas:

- siempre usar comillas
- nombres en mayúsculas para constantes

---

### 4. Control de flujo

#### Condicionales

```bash
if [[ -f /etc/passwd ]]; then
    echo "Existe"
else
    echo "No existe"
fi
```

Operadores comunes:

- `-f` → archivo
- `-d` → directorio
- `-z` → vacío
- `-n` → no vacío

---

#### Bucles

-*for:**

```bash
for i in 1 2 3; do
    echo "$i"
done
```

-*while:**

```bash
while read linea; do
    echo "$linea"
done < archivo.txt
```

??? tip "Uso recomendado"
Para procesar archivos, prioriza `while read` frente a `for`.

---

### 5. Gestión de errores

Directiva crítica:

```bash
set -euo pipefail
```

Comportamiento:

- detiene ejecución ante errores
- evita variables no definidas
- detecta fallos en pipelines

Control manual:

```bash
if ! comando; then
    echo "Error"
    exit 1
fi
```

---

## Laboratorio Práctico

### Escenario

Un servidor aloja contenido web en `/var/www`. Necesitas automatizar:

- generación de backups
- almacenamiento en `/backup`
- registro de logs
- validación de estado

---

## Parte 1: Creación del script

```bash
nano backup.sh
```

Contenido:

```bash
#!/usr/bin/env bash

set -euo pipefail

# Variables
ORIGEN="/var/www"
DESTINO="/backup"
FECHA=$(date +%F_%H-%M-%S)
ARCHIVO="backup_$FECHA.tar.gz"
LOG="/var/log/backup.log"

# Validar origen
if [[ ! -d "$ORIGEN" ]]; then
    echo "ERROR: origen no existe" >> "$LOG"
    exit 1
fi

# Validar destino
if [[ ! -d "$DESTINO" ]]; then
    echo "ERROR: destino no existe" >> "$LOG"
    exit 1
fi

# Crear backup
tar -czf "$DESTINO/$ARCHIVO" "$ORIGEN"

# Validar resultado
if [[ -f "$DESTINO/$ARCHIVO" ]]; then
    echo "$(date +%F) OK: Backup creado $ARCHIVO" >> "$LOG"
else
    echo "$(date +%F) ERROR: fallo en backup" >> "$LOG"
    exit 1
fi
```

---

## Parte 2: Permisos y ejecución

```bash
chmod +x backup.sh
./backup.sh
```

---

## Output esperado

```text
2026-05-26 OK: Backup creado backup_2026-05-26_15-00-00.tar.gz
```

---

## Parte 3: Validación

```bash
ls -lh /backup
```

```bash
cat /var/log/backup.log
```

---

## Errores Comunes y Troubleshooting

### 1. Variables sin protección

```bash
rm -rf $DIR
```

Si `DIR` está vacío → ejecución peligrosa.

-*Corrección:**

```bash
rm -rf "$DIR"
```

---

### 2. Falta de validación de rutas

Ejecutar sin comprobar directorios produce fallos.

-*Solución:**

validar siempre con `-d` o `-f`.

---

### 3. Errores silenciosos

Sin control de errores, el script continúa tras fallos.

-*Solución:**

```bash
set -euo pipefail
```

---

### 4. Problemas de permisos

```text
Permission denied
```

-*Solución:**

```bash
chmod +x script.sh
```

---

### 5. Dependencias no instaladas

Comandos como `tar` o `gzip` pueden no estar disponibles en sistemas mínimos.

-*Solución:**

verificar antes:

```bash
command -v tar >/dev/null || exit 1
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Idempotencia

Los scripts deben poder ejecutarse múltiples veces sin efectos colaterales.

---

### 2. Logging estructurado

```bash
echo "$(date) INFO mensaje" >> /var/log/app.log
```

Separar logs por aplicación.

---

### 3. Uso de funciones

```bash
log() {
    echo "$(date) $1" >> "$LOG"
}
```

Mejora legibilidad y reutilización.

---

### 4. Validación de entrada

```bash
if [[ $# -lt 1 ]]; then
    echo "Uso: script.sh <param>"
    exit 1
fi
```

---

### 5. Seguridad

- evitar `eval`
- controlar variables externas
- limitar permisos de ejecución

---

### 6. Rutas absolutas

Nunca depender del directorio actual:

```bash
/bin/tar
/usr/bin/date
```

---

### 7. Integración con cron

Automatización real:

```bash
crontab -e
```

```text
0 2 * * * /ruta/backup.sh
```

---

### 8. Versionado

Gestionar scripts en Git:

- control de cambios
- rollback
- auditoría

---

## Resumen y Siguiente Paso

Has aprendido a utilizar Bash como herramienta de automatización en entornos Linux, construyendo scripts estructurados, seguros y preparados para producción. Este conocimiento es la base sobre la que se construyen automatizaciones más avanzadas.

Sin embargo, Bash tiene limitaciones cuando se trata de gestionar infraestructuras completas.

El siguiente paso es adoptar un enfoque declarativo:

➡️ **9.2 Ansible** — Automatización de configuración y despliegue a escala mediante infraestructura como código.
