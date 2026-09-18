# 11.1 Monitorización de Rendimiento en Linux

---

## Introducción

La monitorización de rendimiento es una disciplina crítica en la administración de sistemas. Un servidor no falla de forma repentina: **degrada su rendimiento progresivamente** antes de colapsar. Detectar estos síntomas de forma anticipada permite evitar incidentes, optimizar recursos y garantizar la disponibilidad de los servicios.

Para un Sysadmin senior, monitorizar no es simplemente ejecutar comandos puntuales, sino entender **cómo interactúan CPU, memoria, disco y red**, y cómo estas métricas reflejan el comportamiento real de las aplicaciones.

Este capítulo introduce las herramientas y técnicas fundamentales para analizar el rendimiento de sistemas Linux en producción.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Interpretar métricas clave de CPU, memoria, disco y red.
- Utilizar herramientas de monitorización en tiempo real.
- Analizar cuellos de botella en sistemas Linux.
- Identificar patrones de degradación de rendimiento.
- Aplicar medidas correctivas basadas en datos.

---

## Conceptos Teóricos

### 1. Métricas fundamentales del sistema

Un sistema Linux se evalúa principalmente en cuatro dimensiones:

- **CPU**
- **Memoria**
- **Disco (I/O)**
- **Red**

Cada una puede convertirse en un cuello de botella.

---

### 2. CPU y Load Average

El **load average** indica el número de procesos:

- en ejecución
- esperando CPU
- en espera de I/O

Ejemplo:

```bash
uptime
```

```text
load average: 0.50, 0.70, 0.65
```

Interpretación:

- valores cercanos al número de cores → uso óptimo
- valores superiores → saturación

!!! info "Regla práctica"
Load > número de CPUs → sistema sobrecargado.

---

### 3. Memoria

Tipos de uso:

- **used** → memoria utilizada
- **free** → memoria libre
- **cached/buffer** → optimización del sistema

Linux utiliza memoria libre como caché para mejorar rendimiento.

```bash
free -h
```

!!! warning "Error común"
Memoria "llena" no implica problema; puede ser caché.

---

### 4. Disco e I/O

El rendimiento de disco es crítico en:

- bases de datos
- sistemas con alto logging

Métricas relevantes:

- IOPS
- latencia
- throughput

Herramientas:

- `iostat`
- `iotop`

---

### 5. Red

Métricas clave:

- throughput (Mb/s)
- errores
- paquetes perdidos

Herramientas:

- `ss`
- `iftop`
- `ip`

---

### 6. Cuellos de botella

Un cuello de botella ocurre cuando un recurso limita el sistema:

- CPU → procesos intensivos
- memoria → swapping
- disco → latencia alta
- red → saturación

---

## Laboratorio Práctico

### Escenario

Un servidor presenta lentitud en una aplicación web. Debes diagnosticar:

- uso de CPU
- consumo de memoria
- actividad de disco

---

## Parte 1: Análisis de CPU

```bash
top
```

Campos clave:

- `%CPU` → uso por proceso
- `load average`

---

Alternativa moderna:

```bash
htop
```

---

## Parte 2: Memoria

```bash
free -h
```

---

Profundizar:

```bash
vmstat 2 5
```

Explicación:

- `si/so` → swap in/out
- `free` → memoria libre

Si hay uso de swap → posible problema.

---

## Parte 3: Disco

```bash
iostat -xz 2
```

Campos clave:

- `%util` → uso del disco
- `await` → latencia

!!! warning "Interpretación crítica"
`await` alto + `%util` alto = cuello de botella en disco.

---

## Parte 4: Procesos con alto I/O

```bash
iotop
```

---

## Parte 5: Red

```bash
ss -tulnp
```

---

Tráfico en tiempo real:

```bash
iftop
```

---

## Output esperado

```text
CPU(s): 80% us
Mem: 90% used
Disk: await 120ms
```

Interpretación:

- CPU alta
- memoria comprometida
- disco saturado

---

## Errores Comunes y Troubleshooting

### 1. Confundir caché con consumo real

-*Problema:**

memoria aparentemente llena.

-*Solución:**

analizar `available` en:

```bash
free -h
```

---

### 2. Ignorar load average

Carga alta sin análisis.

-*Solución:**

comparar con número de CPUs:

```bash
nproc
```

---

### 3. No correlacionar métricas

Analizar solo CPU o solo memoria.

-*Solución:**

visión global del sistema.

---

### 4. No revisar disco

Muchos problemas reales son por I/O.

---

### 5. Uso de herramientas incorrectas

Ejemplo: usar `top` sin entender métricas.

---

## Buenas Prácticas (Nivel Senior)

### 1. Monitorización continua

No depender de comandos manuales:

- Prometheus
- Grafana

---

### 2. Establecer baseline

Conocer comportamiento normal del servidor.

---

### 3. Alertas proactivas

- CPU > 80%
- disco > 70% uso

---

### 4. Correlación de métricas

Relacionar:

- picos CPU
- aumento latencia
- carga de red

---

### 5. Uso de herramientas avanzadas

- `sar`
- `perf`
- `dstat`

---

### 6. Analizar tendencia, no instantánea

Snapshots no reflejan problemas reales.

---

### 7. Capacity planning

Planificar crecimiento:

- CPU
- RAM
- almacenamiento

---

### 8. Automatización

Recolectar métricas automáticamente.

---

### 9. Logging combinado

Correlacionar métricas con logs del sistema.

---

## Resumen y Siguiente Paso

Has aprendido a interpretar y analizar el rendimiento de sistemas Linux mediante herramientas clave para CPU, memoria, disco y red. Este conocimiento te permite diagnosticar problemas reales y actuar antes de que afecten a producción.

La monitorización puntual es solo el primer paso. En entornos profesionales se requieren sistemas centralizados y visualización avanzada.

➡️ **Siguiente tema:** `11.2 Monitoreo` — Sistemas de monitorización centralizada (Prometheus, Grafana, alerting).
