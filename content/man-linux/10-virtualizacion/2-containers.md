# 10.2 Contenedores en Linux: Docker y Virtualización Ligera

---

## Introducción

La evolución natural de la virtualización tradicional (KVM) ha llevado a un modelo más eficiente y ligero: los **contenedores**. A diferencia de las máquinas virtuales, los contenedores no virtualizan hardware, sino que **comparten el kernel del sistema operativo**, permitiendo ejecutar aplicaciones de forma aislada con un consumo de recursos mínimo.

En entornos modernos, los contenedores son la base de arquitecturas **cloud-native**, microservicios y despliegues continuos. Herramientas como **Docker** han simplificado enormemente su adopción.

Para un Sysadmin senior, dominar contenedores implica ser capaz de desplegar aplicaciones de forma reproducible, portable y escalable.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender qué son los contenedores y cómo funcionan internamente.
- Diferenciar entre virtualización tradicional y contenedores.
- Instalar y configurar Docker en Linux.
- Crear, ejecutar y gestionar contenedores.
- Aplicar buenas prácticas en entornos de producción.

---

## Conceptos Teóricos

### 1. ¿Qué es un contenedor?

Un contenedor es una unidad estándar de software que incluye:

- código de aplicación
- dependencias
- librerías
- configuración

Todo ello aislado del sistema mediante características del kernel:

- **namespaces** → aislamiento
- **cgroups** → control de recursos

!!! info "Concepto clave"
Un contenedor no incluye un sistema operativo completo, solo lo necesario para ejecutar la aplicación.

---

### 2. Contenedores vs Máquinas Virtuales

| Característica | VM (KVM) | Contenedor |
| -------------- | -------- | ---------- |
| Kernel propio  | Sí       | No         |
| Peso           | Alto     | Ligero     |
| Arranque       | Minutos  | Segundos   |
| Aislamiento    | Fuerte   | Medio      |

---

### 3. Docker como estándar de facto

Docker proporciona:

- runtime de contenedores
- construcción de imágenes
- gestión de redes y almacenamiento

Componentes principales:

- **docker daemon (dockerd)**
- **docker CLI**
- **imagenes**
- **contenedores**

---

### 4. Imágenes y contenedores

- **Imagen** → plantilla inmutable
- **Contenedor** → instancia en ejecución

Ejemplo:

```text
imagen nginx → contenedor nginx1
```

---

### 5. Ciclo de vida de un contenedor

1. Crear imagen
2. Ejecutar contenedor
3. Modificar/usar
4. Detener
5. Eliminar

---

### 6. Almacenamiento y persistencia

Por defecto, los contenedores son efímeros.

Opciones:

- **volúmenes**
- bind mounts

---

## Laboratorio Práctico

### Escenario

Desplegar un contenedor web con Docker:

- instalar Docker
- ejecutar nginx
- exponer servicio
- persistir datos

---

## Parte 1: Instalación de Docker

```bash
sudo apt update
sudo apt install docker.io
```

Verificación:

```bash
docker version
```

---

## Paso 2: Habilitar servicio

```bash
systemctl enable docker
systemctl start docker
```

---

## Paso 3: Añadir usuario

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Parte 2: Ejecutar contenedor

```bash
docker run -d -p 8080:80 --name web nginx
```

---

### Explicación

- `-d` → modo detached
- `-p` → mapeo de puertos
- `--name` → nombre contenedor
- `nginx` → imagen

---

## Verificación

```bash
docker ps
```

---

Acceso:

```bash
curl http://localhost:8080
```

---

## Parte 3: Gestión de contenedores

### Detener:

```bash
docker stop web
```

---

### Arrancar:

```bash
docker start web
```

---

### Eliminar:

```bash
docker rm web
```

---

## Parte 4: Persistencia con volúmenes

```bash
docker run -d \
-p 8080:80 \
--name web \
-v /host/web:/usr/share/nginx/html \
nginx
```

---

## Parte 5: Crear imagen propia

```bash
nano Dockerfile
```

```dockerfile
FROM nginx:latest
COPY index.html /usr/share/nginx/html/index.html
```

---

Construir imagen:

```bash
docker build -t mi-nginx .
```

Ejecutar:

```bash
docker run -d -p 8080:80 mi-nginx
```

---

## Output esperado

```text
CONTAINER ID   IMAGE     STATUS
abc123         nginx     Up 10 seconds
```

---

## Errores Comunes y Troubleshooting

### 1. Permiso denegado

```text
permission denied docker.sock
```

-*Solución:**

```bash
usermod -aG docker usuario
```

---

### 2. Puerto ocupado

```bash
ss -tulnp | grep 8080
```

---

### 3. Contenedor se detiene

```bash
docker logs web
```

---

### 4. Imagen no encontrada

```text
pull access denied
```

-*Solución:**

verificar nombre imagen.

---

### 5. Problemas de red

```bash
docker network ls
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Imágenes mínimas

Usar imágenes ligeras:

- alpine
- distroless

---

### 2. No usar root

```dockerfile
USER 1001
```

---

### 3. Persistencia adecuada

Nunca almacenar datos críticos dentro del contenedor.

---

### 4. Versionado de imágenes

```text
nginx:1.25
```

Evitar `latest` en producción.

---

### 5. Logs centralizados

No depender de logs internos.

---

### 6. Seguridad

- escanear imágenes
- limitar capacidades
- usar namespaces correctamente

---

### 7. Resource limits

```bash
--memory=512m --cpus=1
```

---

### 8. Networking controlado

- redes custom
- aislamiento

---

### 9. Integración con CI/CD

Construcción automática de imágenes.

---

## Resumen y Siguiente Paso

Has aprendido a trabajar con contenedores en Linux utilizando Docker, comprendiendo su arquitectura, ciclo de vida y operación en entornos reales. Esto te permite desplegar aplicaciones de forma eficiente, portable y escalable.

Los contenedores son solo el primer paso. En entornos complejos, necesitas **orquestación** para gestionar múltiples instancias y servicios.

➡️ **Siguiente tema:** `10.3 Kubernetes (K8s)` — Orquestación de contenedores a escala.
