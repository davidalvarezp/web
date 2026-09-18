# 12.2 Infraestructura Cloud: Compute, Red y Almacenamiento

---

## Introducción

Una vez comprendidos los conceptos fundamentales del cloud, el siguiente paso es trabajar con los **componentes reales de infraestructura**. En entornos cloud, estos recursos sustituyen directamente a los elementos clásicos del datacenter:

- servidores físicos → **instancias (compute)**
- switches y routers → **redes virtuales**
- discos locales → **almacenamiento gestionado**

Para un Sysadmin, este es el punto donde el conocimiento tradicional de Linux se traduce a cloud, pero con una diferencia clave: la infraestructura es **programable, efímera y altamente dinámicamente gestionada**.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender cómo se representan compute, red y almacenamiento en cloud.
- Desplegar y gestionar instancias virtuales.
- Configurar redes virtuales básicas (subredes, routing, seguridad).
- Diferenciar los tipos de almacenamiento cloud.
- Aplicar principios de diseño de infraestructura moderna.

---

## Conceptos Teóricos

### 1. Compute: Máquinas virtuales en cloud

El componente base sigue siendo la computación, pero en cloud se ofrece como servicio.

Características:

- creación bajo demanda
- destrucción inmediata
- múltiples tamaños (CPU/RAM)

Ejemplos:

- AWS EC2
- Azure VM
- Google Compute Engine

Una instancia incluye:

- sistema operativo
- CPU virtual (vCPU)
- memoria
- acceso a red

!!! info "Cambio clave"
Las instancias en cloud son **efímeras**. No deben tratarse como servidores permanentes.

---

### 2. Imágenes (AMI / Templates)

Las instancias se crean a partir de imágenes predefinidas:

- sistema operativo base
- configuración inicial

Tipos:

- imágenes públicas (Ubuntu, Debian)
- imágenes personalizadas

Ventajas:

- despliegue rápido
- consistencia entre entornos

!!! tip "Nivel senior"
Utiliza imágenes inmutables para despliegues reproducibles.

---

### 3. Networking: Redes virtuales

El cloud abstrae la red física mediante redes virtuales:

- AWS VPC
- Azure VNet

Componentes principales:

#### Subredes

Divisiones dentro de la red:

- públicas → accesibles desde internet
- privadas → internas

#### Routing

Controla el tráfico:

- tablas de rutas
- gateways

Ejemplo:

```text
0.0.0.0/0 → Internet Gateway
```

---

### 4. Seguridad de red

En cloud, la seguridad se gestiona a nivel lógico.

#### Security Groups / NSG

Actúan como firewall:

- reglas de entrada/salida
- control por puertos y protocolos

Ejemplo:

- permitir TCP 80 → tráfico web
- bloquear todo lo demás

!!! warning "Error crítico"
Exponer servicios sin restricciones es una de las causas más comunes de incidentes en cloud.

---

### 5. IPs y acceso

Tipos de IP:

- **pública** → accesible desde internet
- **privada** → interna

Acceso típico:

```bash
ssh usuario@IP_PUBLICA
```

---

### 6. Almacenamiento en cloud

El almacenamiento se divide en tres tipos principales:

---

#### Block Storage

Equivalente a discos tradicionales:

- se adjunta a instancias
- formato: ext4, xfs

Ejemplos:

- AWS EBS
- Azure Managed Disks

Uso:

- sistemas operativos
- bases de datos

---

#### Object Storage

Almacenamiento de objetos:

- no tiene estructura de filesystem
- acceso vía API

Ejemplos:

- AWS S3
- Azure Blob

Uso:

- backups
- almacenamiento masivo
- contenido estático

---

#### File Storage

Sistema de archivos compartido:

- accesible por múltiples instancias

Ejemplos:

- NFS cloud
- AWS EFS

Uso:

- aplicaciones distribuidas

---

### 7. Provisioning

Creación de recursos:

- manual (consola web)
- automatizado (CLI, IaC)

Ejemplo con CLI:

```bash
aws ec2 run-instances ...
```

!!! info "Buenas prácticas"
Toda infraestructura en producción debe ser creada mediante código.

---

### 8. Diseño de infraestructura

Principios clave:

- desacoplamiento de componentes
- redundancia
- escalabilidad

Ejemplo:

```text
[Load Balancer]
      │
  ┌───┴───┐
  VM1   VM2
```

---

## Laboratorio Práctico

### Escenario

Desplegar una infraestructura básica en cloud:

- 1 red virtual
- 1 subred pública
- 1 instancia Linux
- acceso SSH

---

## Parte 1: Crear red

Definir red:

```text
10.0.0.0/16
```

Subred:

```text
10.0.1.0/24
```

---

## Parte 2: Configurar acceso

Reglas de seguridad:

- permitir SSH (22)
- permitir HTTP (80)

---

## Parte 3: Crear instancia

Seleccionar:

- imagen Ubuntu
- tamaño pequeño
- asignar IP pública

---

## Parte 4: Conexión

```bash
ssh ubuntu@IP_PUBLICA
```

---

## Parte 5: Validación

```bash
uname -a
```

```bash
ip a
```

---

## Output esperado

Sistema accesible:

- red configurada
- acceso remoto funcional
- infraestructura operativa

---

## Errores Comunes y Troubleshooting

### 1. No configurar reglas de red

-*Problema:**

no acceso SSH.

-*Solución:**

abrir puerto 22 en security group.

---

### 2. Subred incorrecta

-*Problema:**

instancia sin conectividad.

---

### 3. IP pública no asignada

-*Problema:**

no acceso desde internet.

---

### 4. Uso incorrecto de almacenamiento

Guardar datos críticos en instancias efímeras.

---

### 5. Falta de automatización

Crear recursos manualmente sin control.

---

## Buenas Prácticas (Nivel Senior)

### 1. Infraestructura declarativa

Utilizar:

- Terraform
- Ansible

---

### 2. Separación de redes

- frontend (público)
- backend (privado)

---

### 3. Seguridad mínima necesaria

- principle of least privilege
- puertos estrictamente necesarios

---

### 4. Uso de almacenamiento adecuado

- block → sistemas
- object → backups
- file → compartido

---

### 5. No depender de instancias

Diseñar para:

- reemplazo
- recreación

---

### 6. Escalabilidad

Preparar infraestructura para crecer horizontalmente.

---

### 7. Configuración inmutable

Evitar cambios manuales en producción.

---

### 8. Integración con monitorización

- métricas
- logs

---

### 9. Control de costes

Eliminar recursos no utilizados.

---

## Resumen y Siguiente Paso

Has aprendido cómo se construye la infraestructura básica en entornos cloud, incluyendo compute, redes y almacenamiento. Este conocimiento te permite trasladar tu experiencia en sistemas Linux a entornos distribuidos y dinámicos.

El siguiente paso es trabajar con niveles más altos de abstracción y servicios gestionados.

➡️ **12.3 Servicios Cloud** — balanceadores, autoscaling, bases de datos gestionadas y arquitectura avanzada.
