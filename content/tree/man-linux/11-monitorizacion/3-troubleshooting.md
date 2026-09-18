# 11.3 Troubleshooting en Linux: Diagnóstico y Resolución de Incidencias

---

## Introducción

En entornos de producción, los problemas no son una excepción, sino una constante. La diferencia entre un administrador junior y un **Sysadmin senior** no radica en evitar incidencias, sino en **diagnosticarlas rápidamente, entender su causa raíz y aplicar soluciones sostenibles**.

El troubleshooting en Linux no es ejecutar comandos al azar, sino aplicar un enfoque metódico basado en evidencias: correlación de métricas, análisis de logs y comprensión del comportamiento del sistema.

Este capítulo aborda las técnicas y herramientas esenciales para resolver problemas complejos en sistemas Linux.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Aplicar metodologías estructuradas de troubleshooting.
- Analizar logs del sistema y servicios.
- Diagnosticar problemas de CPU, memoria, disco y red.
- Identificar causas raíz y no solo síntomas.
- Resolver incidencias en entornos reales de producción.

---

## Conceptos Teóricos

### 1. Principios de troubleshooting

Un diagnóstico efectivo sigue siempre una metodología:

1. **Definir el problema**
2. **Recolectar información**
3. **Identificar hipótesis**
4. **Validar causas**
5. **Aplicar solución**
6. **Documentar**

!!! info "Regla fundamental"
Nunca aplicar soluciones sin entender la causa raíz.

---

### 2. Síntoma vs causa raíz

Ejemplo:

- Síntoma → aplicación lenta
- Causa real → disco saturado

Un error común es actuar sobre el síntoma sin resolver el origen.

---

### 3. Fuentes de información

#### Logs

Ubicación:

```text
/var/log/
```

Ejemplos:

- `/var/log/syslog`
- `/var/log/auth.log`
- `/var/log/nginx/error.log`

#### Métricas

- CPU
- memoria
- I/O

#### Estado del sistema

- procesos activos
- conexiones de red
- servicios

---

### 4. Tipos de incidencias

- rendimiento degradado
- servicio caído
- errores de configuración
- problemas de red
- falta de recursos

---

### 5. Herramientas clave

| Categoría | Herramienta  |
| --------- | ------------ |
| Logs      | journalctl   |
| Procesos  | ps, top      |
| Disco     | df, iostat   |
| Red       | ss, ping     |
| Debug     | strace, lsof |

---

## Laboratorio Práctico

### Escenario

Un servidor web no responde correctamente:

- alta latencia
- errores intermitentes
- posible saturación

Debes diagnosticar el problema.

---

## Parte 1: Verificar estado del sistema

```bash
uptime
```

Interpretar carga:

- load average elevado → saturación

---

```bash
top
```

Identificar:

- procesos con alto uso de CPU
- consumo de memoria

---

## Parte 2: Revisar logs

```bash
journalctl -xe
```

Filtrar servicio:

```bash
journalctl -u nginx
```

Buscar:

- errores
- reinicios
- fallos de configuración

---

## Parte 3: Analizar disco

```bash
df -h
```

Detectar:

- particiones llenas

---

```bash
iostat -xz 2
```

Detectar latencias altas.

---

## Parte 4: Ver conexiones de red

```bash
ss -tulnp
```

Detectar:

- servicios escuchando
- conexiones activas

---

## Parte 5: Analizar procesos específicos

```bash
ps aux | grep nginx
```

---

### Ver archivos abiertos

```bash
lsof -p <PID>
```

---

### Trazar ejecución

```bash
strace -p <PID>
```

---

## Output esperado

```text
load average: 5.00
disk usage: 100%
nginx error: no space left on device
```

Interpretación:

- sistema saturado
- disco lleno
- fallo en escritura de logs → impacto en servicio

---

## Errores Comunes y Troubleshooting

### 1. Reiniciar sin diagnosticar

Reiniciar el servicio oculta el problema.

-*Solución:**

investigar antes de actuar.

---

### 2. No revisar logs

Ignorar `/var/log/` es uno de los errores más graves.

---

### 3. Analizar solo una métrica

Ejemplo: revisar CPU pero ignorar disco.

---

### 4. Falta de contexto

No correlacionar eventos:

- despliegue reciente
- cambios de configuración

---

### 5. Uso incorrecto de herramientas

Ejecutar comandos sin interpretar resultados.

---

## Buenas Prácticas (Nivel Senior)

### 1. Metodología estructurada

Siempre seguir un proceso:

- observación
- análisis
- acción

---

### 2. Centralización de logs

Utilizar:

- ELK (Elasticsearch, Logstash, Kibana)
- sistemas centralizados

---

### 3. Correlación

Relacionar:

- métricas (Prometheus)
- logs
- eventos del sistema

---

### 4. Uso de timelines

Reconstruir línea temporal del incidente.

---

### 5. Automatización de diagnóstico

Scripts para:

- recopilar métricas
- capturar estado del sistema

---

### 6. Post-mortem

Tras incidencia:

- documentar causa
- definir acciones correctivas

---

### 7. Alertas proactivas

Evitar que el problema escale a caída total.

---

### 8. Control de cambios

Registrar:

- despliegues
- modificaciones de configuración

---

### 9. Observabilidad completa

Integrar:

- métricas
- logs
- trazas

---

## Resumen

Has aprendido a abordar el troubleshooting en Linux de forma profesional, aplicando un enfoque estructurado basado en evidencia y utilizando herramientas clave para diagnosticar problemas reales.

El troubleshooting eficaz no solo resuelve incidencias, sino que mejora la fiabilidad del sistema y previene futuros fallos.

Con este capítulo, completas el bloque de monitorización, incorporando:

- análisis de rendimiento
- monitoreo centralizado
- diagnóstico avanzado

Este conocimiento te posiciona para gestionar sistemas Linux en producción con un enfoque completo de **observabilidad y fiabilidad operativa**.
