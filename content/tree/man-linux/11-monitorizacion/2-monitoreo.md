# 11.2 Monitoreo en Linux: Sistemas Centralizados y Alerting

---

## Introducción

La observabilidad moderna no puede depender de la ejecución manual de comandos como `top` o `iostat`. En entornos productivos, donde existen múltiples servidores, servicios distribuidos y cargas dinámicas, es imprescindible contar con **sistemas centralizados de monitoreo**.

El monitoreo permite recolectar, almacenar, visualizar y alertar sobre métricas del sistema en tiempo real. Herramientas como **Prometheus** y **Grafana** se han convertido en el estándar de facto para gestionar la salud de infraestructuras modernas.

Para un Sysadmin senior, el monitoreo no consiste solo en ver gráficos, sino en diseñar un sistema que permita **detectar anomalías, anticipar fallos y automatizar respuestas operativas**.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender la arquitectura de un sistema de monitoreo moderno.
- Implementar Prometheus para recolectar métricas.
- Visualizar datos con Grafana.
- Configurar alertas proactivas.
- Diseñar una estrategia de monitoreo escalable.

---

## Conceptos Teóricos

### 1. ¿Qué es el monitoreo centralizado?

El monitoreo centralizado consiste en:

- recolectar métricas de múltiples sistemas
- almacenarlas en una base de datos
- analizarlas y visualizarlas
- generar alertas automáticas

Componentes principales:

- **exporters** → recolectan métricas
- **collector (Prometheus)** → las almacena
- **visualización (Grafana)** → las muestra
- **alertmanager** → gestiona alertas

---

### 2. Modelo de Prometheus

Prometheus utiliza un modelo de tipo **pull**:

1. Prometheus consulta endpoints `/metrics`
2. recolecta datos periódicamente
3. almacena en una base de datos temporal (TSDB)

Ejemplo de métrica:

```text
node_cpu_seconds_total{mode="idle"} 12345.67
```

!!! info "Ventaja clave"
Modelo pull simplifica escalabilidad y evita configuraciones complejas en nodos.

---

### 3. Exporters

Los exporters exponen métricas del sistema:

- **node\_exporter** → sistema (CPU, RAM, disco)
- **mysql\_exporter** → bases de datos
- **nginx\_exporter** → servidores web

Funcionamiento:

```text
host → exporter → endpoint HTTP → Prometheus
```

---

### 4. Grafana

Grafana permite:

- construir dashboards
- visualizar métricas en tiempo real
- correlacionar datos

Tipos de visualización:

- gráficas de línea
- histogramas
- gauges

---

### 5. Alerting

Prometheus utiliza reglas:

```yaml
- alert: HighCPU
  expr: cpu_usage > 80
  for: 5m
```

Alertmanager:

- agrupa alertas
- evita duplicados
- envía notificaciones (email, Slack, etc.)

---

### 6. Métricas vs logs

Diferencia clave:

- **métricas** → datos numéricos agregados
- **logs** → eventos detallados

Ambos sistemas deben coexistir.

---

## Laboratorio Práctico

### Escenario

Implementar un sistema básico de monitoreo:

- recolectar métricas del sistema
- visualizarlas en Grafana
- validar funcionamiento

---

## Parte 1: Instalar Prometheus

```bash
sudo apt update
sudo apt install prometheus
```

---

### Verificar servicio

```bash
systemctl status prometheus
```

---

Prometheus por defecto escucha en:

```text
http://localhost:9090
```

---

## Parte 2: Instalar Node Exporter

```bash
sudo apt install prometheus-node-exporter
```

---

Verificar:

```bash
curl http://localhost:9100/metrics
```

---

## Parte 3: Configurar Prometheus

Editar:

```bash
/etc/prometheus/prometheus.yml
```

Añadir:

```yaml
scrape_configs:
  - job_name: "node"
    static_configs:
      - targets: ["localhost:9100"]
```

---

Reiniciar servicio:

```bash
systemctl restart prometheus
```

---

## Parte 4: Consultar métricas

Acceder a Prometheus:

```text
http://localhost:9090
```

Consulta básica:

```text
node_cpu_seconds_total
```

---

## Parte 5: Instalar Grafana

```bash
sudo apt install grafana
```

---

Arrancar servicio:

```bash
systemctl start grafana-server
systemctl enable grafana-server
```

Acceso:

```text
http://localhost:3000
```

Credenciales por defecto:

```text
admin / admin
```

---

## Parte 6: Configurar datasource

En Grafana:

1. Añadir datasource → Prometheus
2. URL:

```text
http://localhost:9090
```

---

## Parte 7: Crear dashboard

Ejemplo:

- CPU usage
- memoria
- disco

---

## Output esperado

Sistema funcional con:

- Prometheus recolectando métricas
- Grafana mostrando dashboards
- métricas actualizadas en tiempo real

---

## Errores Comunes y Troubleshooting

### 1. Exporter no accesible

```text
connection refused
```

-*Solución:**

```bash
systemctl status prometheus-node-exporter
```

---

### 2. Prometheus no recolecta datos

-*Causa:**

configuración incorrecta.

-*Solución:**

```bash
journalctl -u prometheus
```

---

### 3. Grafana sin datos

-*Causa:**

datasource incorrecto.

---

### 4. Puerto bloqueado

```bash
ss -tulnp
```

Verificar puertos 9090, 3000, 9100.

---

### 5. Métricas vacías

Esperar intervalo de scraping (por defecto 15s).

---

## Buenas Prácticas (Nivel Senior)

### 1. Diseño de métricas

Elegir métricas relevantes:

- CPU
- latencias
- errores

Evitar ruido innecesario.

---

### 2. Dashboards estructurados

- por servicio
- por capa (infraestructura, aplicación)

---

### 3. Alertas útiles

Evitar alert fatigue:

- definir umbrales realistas
- alertas accionables

---

### 4. Retención de datos

Configurar almacenamiento:

- no almacenar datos indefinidamente
- ajustar según necesidades

---

### 5. Alta disponibilidad

Prometheus en HA:

- replicación
- almacenamiento remoto

---

### 6. Seguridad

- limitar acceso a endpoints `/metrics`
- autenticación en Grafana

---

### 7. Etiquetas (labels)

Permiten segmentar métricas:

```text
instance="web1"
env="prod"
```

---

### 8. Integración con alerting externo

- email
- Slack
- PagerDuty

---

### 9. Infraestructura como código

Versionar:

- dashboards
- reglas
- configuraciones

---

## Resumen y Siguiente Paso

Has aprendido a implementar un sistema de monitoreo centralizado utilizando Prometheus y Grafana, comprendiendo cómo recolectar, almacenar y visualizar métricas en tiempo real. Este enfoque es esencial para operar infraestructuras modernas con visibilidad completa.

Sin embargo, las métricas por sí solas no explican todos los comportamientos del sistema. Para un diagnóstico completo, es necesario complementar con análisis detallado de eventos.

➡️ **Siguiente tema:** `11.3 Troubleshooting` — Diagnóstico avanzado y resolución de problemas en sistemas Linux.
