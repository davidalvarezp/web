# 12.3 Servicios Cloud: Arquitecturas Gestionadas y Despliegue Moderno

---

## Introducción

Una vez dominados los recursos básicos (compute, red y almacenamiento), el siguiente nivel en cloud consiste en trabajar con **servicios gestionados**. Estos servicios abstraen gran parte de la complejidad operativa, permitiendo centrarse en la lógica de negocio en lugar de en la gestión de infraestructura.

Para un Sysadmin senior, este es el punto donde se produce el verdadero cambio de rol: se pasa de **administrar sistemas** a **diseñar plataformas**. Los servicios cloud permiten construir arquitecturas altamente disponibles, escalables y resilientes sin gestionar directamente cada componente.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender el rol de los servicios gestionados en cloud.
- Implementar balanceadores de carga y escalado automático.
- Utilizar bases de datos gestionadas.
- Entender el paradigma serverless.
- Diseñar arquitecturas modernas basadas en servicios.

---

## Conceptos Teóricos

### 1. ¿Qué son los servicios gestionados?

Son servicios donde el proveedor cloud gestiona:

- infraestructura
- mantenimiento
- actualizaciones
- alta disponibilidad

El usuario solo define:

- configuración
- uso
- lógica de aplicación

!!! info "Cambio clave"
Cuanto más gestionado es el servicio, menos operaciones manuales requiere el Sysadmin.

---

### 2. Load Balancers (Balanceadores de carga)

Distribuyen tráfico entre múltiples instancias.

Tipos:

- **Layer 4 (TCP)** → balanceo básico
- **Layer 7 (HTTP/HTTPS)** → balanceo inteligente

Funciones:

- alta disponibilidad
- distribución de carga
- terminación TLS

Ejemplo:

```text
Clientes → Load Balancer → múltiples instancias
```

!!! info "Nivel producción"
Nunca expongas directamente instancias públicas sin un load balancer.

---

### 3. Autoscaling

Permite ajustar automáticamente el número de instancias según carga.

Tipos:

- escalado horizontal → añadir/quitar instancias
- escalado basado en métricas → CPU, tráfico, etc.

Ejemplo:

```text
CPU > 70% → +2 instancias
CPU < 30% → -1 instancia
```

Ventajas:

- optimización de costes
- elasticidad real
- resistencia a picos de carga

---

### 4. Bases de datos gestionadas

Servicios que eliminan la gestión manual de bases de datos.

Ejemplos:

- AWS RDS
- Azure SQL Database
- Cloud SQL

Características:

- backups automáticos
- replicación
- alta disponibilidad
- escalabilidad vertical

!!! warning "Consideración importante"
Se pierde acceso directo al sistema operativo, pero se gana fiabilidad y simplicidad.

---

### 5. Almacenamiento gestionado avanzado

Más allá del almacenamiento básico:

- **CDN (Content Delivery Network)** → distribución global
- **object storage con versionado**
- **archivado automático**

Uso típico:

- contenido estático
- backups
- distribución global

---

### 6. Serverless (FaaS)

Modelo donde no gestionas servidores.

Ejemplos:

- AWS Lambda
- Azure Functions

Características:

- ejecución por eventos
- escalado automático
- pago por ejecución

!!! info "Cambio de paradigma"
El criterio pasa de “servidores activos” a “funciones bajo demanda”.

---

### 7. Integración con contenedores

Los proveedores ofrecen orquestación gestionada:

- EKS (AWS)
- AKS (Azure)
- GKE (Google)

Ventajas:

- Kubernetes sin gestión de control plane
- integración nativa con cloud
- escalado automático

---

### 8. Monitorización y logging gestionado

Servicios cloud ofrecen:

- métricas integradas
- logs centralizados
- alertas automáticas

Ejemplos:

- CloudWatch
- Azure Monitor

---

### 9. Arquitectura moderna en cloud

Ejemplo típico:

```text
Internet
   │
[Load Balancer]
   │
[Autoscaling Group]
   │
[Aplicación]
   │
[Base de datos gestionada]
   │
[Object Storage]
```

Principios:

- desacoplamiento
- resiliencia
- escalabilidad

---

## Laboratorio Práctico

### Escenario

Desplegar una aplicación web escalable en cloud utilizando servicios gestionados:

- balanceador
- múltiples instancias
- base de datos gestionada

---

## Parte 1: Definir arquitectura

```text
Load Balancer
   │
  VM1   VM2
   │
Database gestionada
```

---

## Parte 2: Configurar balanceador

- puerto 80 abierto
- integración con instancias

---

## Parte 3: Configurar autoscaling

Reglas:

- mínimo: 2 instancias
- máximo: 5 instancias

---

## Parte 4: Base de datos

- seleccionar motor (MySQL/PostgreSQL)
- configurar backups automáticos

---

## Parte 5: Validación

Test:

```bash
curl http://endpoint
```

Simular carga:

- verificar escalado automático
- comprobar disponibilidad

---

## Output esperado

Sistema:

- escalable automáticamente
- resiliente
- sin intervención manual

---

## Errores Comunes y Troubleshooting

### 1. No usar balanceador

-*Problema:**

punto único de fallo.

---

### 2. Escalado mal configurado

-*Problema:**

sobreprovisión o falta de recursos.

---

### 3. Base de datos mal dimensionada

-*Problema:**

cuello de botella central.

---

### 4. Dependencias acopladas

Aplicaciones dependientes de una única instancia.

---

### 5. No monitorizar servicios

Falta de visibilidad.

---

## Buenas Prácticas (Nivel Senior)

### 1. Diseño desacoplado

Separar:

- frontend
- backend
- datos

---

### 2. Uso de servicios gestionados

Reducir carga operativa siempre que sea posible.

---

### 3. Escalado automático

Nunca dimensionar manualmente en sistemas con carga variable.

---

### 4. Alta disponibilidad por defecto

- múltiples instancias
- múltiples zonas

---

### 5. Observabilidad integrada

Monitorizar:

- métricas
- logs
- errores

---

### 6. Minimizar dependencia de estado

Aplicaciones stateless siempre que sea posible.

---

### 7. Seguridad por capas

- WAF
- security groups
- IAM

---

### 8. Cost optimization

- apagar recursos innecesarios
- usar autoscaling

---

### 9. Integración con CI/CD

Automatizar despliegues:

- pipelines
- infraestructura como código

---

## Resumen

Has aprendido a trabajar con servicios gestionados en entornos cloud, incluyendo balanceadores, autoscaling, bases de datos y arquitecturas modernas. Este enfoque permite diseñar sistemas resilientes y escalables sin la complejidad operativa de la infraestructura tradicional.

Con este capítulo completas el bloque de cloud, cerrando el ciclo de evolución del Sysadmin moderno:

- infraestructura tradicional
- automatización
- contenedores
- orquestación
- cloud

Este conocimiento te posiciona para operar y diseñar sistemas en entornos reales de producción a escala.
