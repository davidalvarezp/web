# 5.1 Gestión de Procesos en Linux

---

## Introducción

La gestión de procesos es uno de los pilares fundamentales de cualquier sistema Linux. Todo lo que ocurre en el sistema —desde un simple `ls` hasta la ejecución de un servidor web como Nginx— se materializa a través de **procesos** gestionados por el Kernel. Como Sysadmin, entender cómo se crean, monitorizan, priorizan y finalizan estos procesos es crítico para garantizar la estabilidad, rendimiento y disponibilidad de un entorno en producción.

Dominar este ámbito te permitirá diagnosticar cuellos de botella, identificar procesos maliciosos o zombis, optimizar el consumo de recursos y aplicar políticas de control sobre la ejecución de aplicaciones.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender qué es un proceso y cómo lo gestiona el Kernel.
- Monitorizar procesos en tiempo real y analizar su consumo de recursos.
- Manipular procesos (detener, pausar, reanudar, finalizar).
- Gestionar prioridades mediante **nice** y **renice**.
- Identificar procesos problemáticos (zombies, huérfanos, runaway processes).
- Aplicar técnicas de control en entornos críticos.

---

## Conceptos Teóricos

### 1. ¿Qué es un Proceso?

Un **proceso** es una instancia de un programa en ejecución. Cada proceso tiene asociados múltiples atributos:

- **PID (Process ID):** Identificador único.
- **PPID:** ID del proceso padre.
- **UID/GID:** Usuario que lo ejecuta.
- **Estado:** running, sleeping, stopped, zombie.
- **Consumo de recursos:** CPU, memoria, IO.

El Kernel es responsable de:

- Planificar su ejecución (scheduler).
- Asignar recursos.
- Gestionar su ciclo de vida.

---

### 2. Estados de un Proceso

En Linux, los procesos pueden encontrarse en diferentes estados:

- **R (Running):** Ejecutándose o listo para ejecutarse.
- **S (Sleeping):** Esperando un evento (IO, señal).
- **D (Uninterruptible):** Espera bloqueante (normalmente IO).
- **T (Stopped):** Pausado manualmente.
- **Z (Zombie):** Finalizado pero no recogido por su padre.

!!! warning "Procesos Zombie"
    Un proceso zombie puede parecer inofensivo, pero en sistemas con alta carga puede provocar agotamiento de la tabla de procesos.

---

### 3. Jerarquía de Procesos

Linux estructura los procesos en forma de árbol jerárquico:

- Todo parte del proceso **PID 1** (actualmente `systemd`).
- Cada proceso tiene un padre.
- Al morir el padre, los procesos pasan a depender de `systemd`.

Visualización:

```bash
ps -ef --forest
```

---

### 4. Planificador (Scheduler)

El Kernel utiliza el **Completely Fair Scheduler (CFS)** para repartir CPU de forma equitativa.

Factores clave:

- **Nice value (-20 a 19):**
  - -20 → máxima prioridad
  - 19 → mínima prioridad

- **Load Average:** indica carga del sistema:
  - 1.0 = CPU completamente ocupada (por núcleo)

---

### 5. Señales (Signals)

Las señales son mecanismos para comunicarse con procesos:

- **SIGTERM (15):** apagado ordenado.
- **SIGKILL (9):** terminación forzada.
- **SIGSTOP / SIGCONT:** pausar/reanudar.

---

## Laboratorio Práctico

### Escenario

Tienes un servidor donde una aplicación está consumiendo demasiada CPU. Necesitas:

1. Identificar el proceso.
2. Analizar su comportamiento.
3. Reducir su impacto.
4. Terminarlo si es necesario.

---

### Paso 1: Identificar procesos activos

```bash
ps aux --sort=-%cpu | head
```

#### Explicación

- `ps aux`: lista todos los procesos.
- `--sort=-%cpu`: ordena por uso de CPU descendente.
- `head`: muestra los primeros.

#### Output esperado

```text
USER   PID  %CPU %MEM COMMAND
root  1234  95.0  5.2 python app.py
```

---

### Paso 2: Monitorización en tiempo real

```bash
top
```

O mejor:

```bash
htop
```

#### Claves en `top`

- `P`: ordenar por CPU.
- `M`: ordenar por memoria.
- `k`: matar proceso.

---

### Paso 3: Inspeccionar proceso específico

```bash
ps -p 1234 -o pid,ppid,user,%cpu,%mem,cmd
```

---

### Paso 4: Reducir prioridad (nice)

```bash
sudo renice 10 -p 1234
```

#### Explicación

- Aumentamos el valor nice → menos prioridad CPU.

---

### Paso 5: Enviar señales

#### Terminación ordenada:

```bash
kill 1234
```

#### Forzada:

```bash
kill -9 1234
```

---

### Paso 6: Ver árbol de procesos

```bash
pstree -p
```

---

## Errores Comunes y Troubleshooting

### 1. Proceso no muere con kill

- **Causa:** Está en estado `D` (IO bloqueante).
- **Solución:**
  - Revisar sistema de almacenamiento.
  - Solo reinicio puede liberar.

---

### 2. Uso excesivo de CPU sin causa aparente

- Verifica:

```bash
top
```

- Posibles causas:
  - bucle infinito.
  - proceso zombie mal gestionado.
  - malware.

---

### 3. Demasiados procesos (fork bomb)

Ejemplo peligroso:

```bash
:(){ :|:& };:
```

!!! warning "Fork Bomb"
    Este comando puede colapsar completamente el sistema.

-*Solución:**

```bash
ulimit -u 100
```

Limita procesos por usuario.

---

### 4. Procesos zombie acumulados

```bash
ps aux | grep Z
```

-*Solución:**

- Reiniciar proceso padre.
- O reiniciar sistema.

---

## Buenas Prácticas (Nivel Senior)

### 1. Monitorización continua

- Usa herramientas como:

  - `htop`
  - `atop`
  - `glances`

---

### 2. Limita recursos con ulimit

```bash
ulimit -n 4096
```

Controla:

- archivos abiertos.
- procesos.
- memoria.

---

### 3. Aísla procesos críticos

- Usa **cgroups** o systemd slices.

---

### 4. Automatiza detección

Ejemplo simple:

```bash
ps aux --sort=-%cpu | head -n 5
```

Integrable en scripts de monitorización.

---

### 5. Evita uso indiscriminado de SIGKILL

!!! warning "SIGKILL como último recurso"
    No permite limpieza de recursos ni cierre seguro.

---

### 6. Controla procesos persistentes

- Integra servicios en **systemd** en vez de lanzarlos manualmente.

---

### 7. Seguridad

- Identifica procesos sospechosos:

```bash
ps aux | grep -v root
```

---

## Resumen y Siguiente Paso

Has aprendido cómo Linux gestiona los procesos, cómo monitorizarlos, manipularlos y diagnosticar problemas en entornos reales. Este conocimiento es crítico para mantener la estabilidad de sistemas en producción y reaccionar ante incidentes de rendimiento.

En el siguiente capítulo profundizaremos en el corazón del sistema moderno de Linux:

 **5.2 Deep Dive en systemd**: entenderás cómo se orquestan servicios, dependencias y arranque del sistema en entornos empresariales.
