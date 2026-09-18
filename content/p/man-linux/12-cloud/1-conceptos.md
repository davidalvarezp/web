# 12.1 Cloud Computing: Conceptos Fundamentales

---

## Introducción

El **Cloud Computing** ha transformado radicalmente la forma en la que se diseñan, despliegan y operan infraestructuras IT. Frente al modelo tradicional basado en hardware físico y centros de datos propios, el cloud introduce un paradigma donde los recursos son **elásticos, bajo demanda y gestionados como servicio**.

Para un Sysadmin moderno, comprender el cloud no es opcional. Es el entorno en el que viven hoy la mayoría de cargas de trabajo, y exige un cambio de mentalidad: de administrar servidores individuales a diseñar **arquitecturas resilientes, escalables y declarativas**.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender qué es el Cloud Computing y sus principales características.
- Diferenciar los modelos de servicio (IaaS, PaaS, SaaS).
- Entender el concepto de regiones y zonas de disponibilidad.
- Aplicar el modelo de responsabilidad compartida.
- Identificar ventajas y limitaciones del cloud frente a entornos tradicionales.

---

## Conceptos Teóricos

### 1. ¿Qué es Cloud Computing?

El Cloud Computing es un modelo que permite acceder a recursos informáticos (computación, almacenamiento, red) a través de internet, bajo demanda y con pago por uso.

Características clave:

- **Elasticidad** → capacidad de escalar recursos dinámicamente
- **On-demand** → provisión inmediata
- **Pago por consumo** → modelo OpEx
- **Accesibilidad global** → disponible desde cualquier ubicación

!!! info "Cambio de paradigma"
En cloud no compras servidores; consumes capacidad cuando la necesitas.

---

### 2. Modelos de servicio

El cloud se divide en tres modelos principales:

#### IaaS (Infrastructure as a Service)

El proveedor ofrece infraestructura básica:

- máquinas virtuales
- almacenamiento
- redes

El Sysadmin es responsable de:

- sistema operativo
- configuración
- seguridad a nivel de host

Ejemplos:

- AWS EC2
- Azure Virtual Machines

---

#### PaaS (Platform as a Service)

Se abstrae el sistema operativo:

- el proveedor gestiona el runtime
- el usuario despliega aplicaciones

El Sysadmin gestiona:

- configuración de la app
- dependencias

Ejemplos:

- Heroku
- Azure App Service

---

#### SaaS (Software as a Service)

Aplicaciones listas para usar:

- el proveedor gestiona todo

Ejemplos:

- Microsoft 365
- Google Workspace

---

!!! warning "Implicación operativa"
A mayor nivel de servicio (SaaS), menor control, pero también menor carga operativa.

---

### 3. Regiones y Zonas de Disponibilidad

El cloud está estructurado en:

#### Regiones

Ubicaciones geográficas independientes:

- Europa
- Estados Unidos
- Asia

#### Zonas de Disponibilidad (AZ)

Centros de datos aislados dentro de una región:

- independientes físicamente
- conectados con baja latencia

Ejemplo típico:

```text
eu-west-1a
eu-west-1b
eu-west-1c
```

!!! info "Alta disponibilidad"
Diseñar sistemas en múltiples zonas evita caída total ante fallos de un data center.

---

### 4. Modelo de Responsabilidad Compartida

Uno de los conceptos más importantes en cloud.

Divide responsabilidades entre:

- **Proveedor cloud**
- **Cliente (Sysadmin/empresa)**

Ejemplo en IaaS:

| Elemento          | Responsable |
| ----------------- | ----------- |
| Hardware          | Proveedor   |
| Red física        | Proveedor   |
| Sistema operativo | Cliente     |
| Aplicaciones      | Cliente     |

!!! warning "Error crítico"
Muchos incidentes de seguridad en cloud ocurren por no entender este modelo.

---

### 5. Modelo económico: CapEx vs OpEx

#### Modelo tradicional (on-prem)

- inversión inicial alta (CapEx)
- compra de hardware

#### Modelo cloud

- gasto operativo (OpEx)
- pago por uso

Ventajas:

- no requiere inversión inicial
- escalabilidad inmediata

Riesgo:

- costes descontrolados si no se monitoriza

---

### 6. Escalabilidad y elasticidad

El cloud permite:

#### Escalado vertical

- aumentar recursos de una máquina

#### Escalado horizontal

- añadir más instancias

!!! info "Recomendación senior"
En cloud, el escalado horizontal es la estrategia predominante.

---

### 7. Alta disponibilidad por diseño

En entornos cloud, la alta disponibilidad:

- no es opcional
- se diseña desde el inicio

Ejemplo:

- múltiples instancias
- balanceadores de carga
- replicación de datos

---

### 8. Infraestructura como Código (IaC)

El cloud favorece la automatización mediante:

- Terraform
- Ansible
- CloudFormation

Permite:

- reproducibilidad
- versionado
- despliegues automatizados

---

## Laboratorio Práctico

### Escenario

Un equipo necesita desplegar una aplicación web en cloud con alta disponibilidad mínima.

Objetivos:

- elegir modelo de servicio
- definir arquitectura básica
- justificar decisiones

---

## Paso 1: Selección de modelo

Decisión:

```text
IaaS + balanceador gestionado
```

Motivo:

- control sobre el sistema
- flexibilidad

---

## Paso 2: Diseño básico

Arquitectura:

```text
Load Balancer
   │
   ├── VM (AZ1)
   └── VM (AZ2)
```

---

## Paso 3: Definir componentes

- 2 instancias (redundancia)
- 1 balanceador
- almacenamiento persistente

---

## Paso 4: Validación de disponibilidad

Simulación:

- caída de una VM → servicio sigue activo
- caída de una AZ → servicio sigue activo

---

## Output esperado

Sistema:

- resiliente
- escalable
- basado en principios cloud

---

## Errores Comunes y Troubleshooting

### 1. Pensar en cloud como “hosting tradicional”

Error:

- tratar instancias como servidores físicos permanentes

Solución:

- diseñar pensando en reemplazo automático

---

### 2. Ignorar el modelo de responsabilidad

Error:

- asumir que el proveedor gestiona seguridad del sistema

---

### 3. Diseñar sin alta disponibilidad

Error:

- usar una sola instancia

---

### 4. No controlar costes

Error:

- dejar recursos activos innecesariamente

---

### 5. No automatizar

Error:

- configuraciones manuales no reproducibles

---

## Buenas Prácticas (Nivel Senior)

### 1. Diseñar para fallos

Asumir que:

- instancias fallarán
- zonas pueden caer

---

### 2. Automatización total

Nada debería crearse manualmente en producción.

---

### 3. Uso de múltiples zonas

Evitar dependencia de un único datacenter.

---

### 4. Control de costes

- monitorizar uso
- apagar recursos no críticos

---

### 5. Seguridad desde diseño

- segmentación de red
- mínimos privilegios

---

### 6. Infraestructura inmutable

No modificar servidores en caliente:

- destruir y recrear

---

### 7. Observabilidad integrada

Integrar:

- métricas
- logs
- alertas

---

### 8. Idempotencia

Toda infraestructura debe poder redeplegarse sin efectos secundarios.

---

## Resumen y Siguiente Paso

Has aprendido los fundamentos del Cloud Computing, incluyendo sus modelos de servicio, arquitectura distribuida y principios de diseño. Este conocimiento es esencial para entender cómo se construyen y operan infraestructuras modernas.

El siguiente paso es trasladar estos conceptos a recursos concretos:

➡️ **12.2 Infraestructura Cloud** — despliegue práctico de compute, red y almacenamiento en entornos cloud.
