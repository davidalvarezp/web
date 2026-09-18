# 7.3 SELinux y AppArmor: Control de Acceso Obligatorio (MAC)

---

## Introducción

En el modelo tradicional de seguridad de Linux, basado en permisos UNIX (**DAC, Discretionary Access Control**), el propietario de un recurso decide quién puede acceder a él. Sin embargo, en entornos críticos esto no es suficiente: si un proceso es comprometido, puede acceder a todo lo que su usuario permita.

Aquí entran en juego **SELinux** y **AppArmor**, sistemas de **Control de Acceso Obligatorio (MAC)** que imponen políticas estrictas a nivel del kernel, limitando lo que los procesos pueden hacer independientemente de los permisos del usuario.

Para un Sysadmin, dominar estas tecnologías significa poder diseñar sistemas **resilientes frente a intrusiones**, incluso cuando una aplicación ha sido comprometida.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Entender la diferencia entre DAC y MAC.
- Comprender la arquitectura de SELinux y AppArmor.
- Interpretar contextos y políticas de seguridad.
- Diagnosticar bloqueos de acceso causados por políticas.
- Gestionar y ajustar reglas de seguridad.
- Aplicar estos sistemas en entornos reales.

---

## Conceptos Teóricos

### 1. DAC vs MAC

#### DAC (Discretionary Access Control)

- Basado en permisos tradicionales (`chmod`, `chown`).
- El usuario decide el acceso.

#### MAC (Mandatory Access Control)

- El sistema define políticas obligatorias.
- Ni siquiera root puede ignorarlas fácilmente.

!!! warning "Limitación de DAC"
Un servicio comprometido puede acceder a cualquier recurso permitido al usuario, lo que amplifica el impacto de una brecha de seguridad.

---

### 2. SELinux (Security-Enhanced Linux)

SELinux es un sistema de seguridad desarrollado originalmente por la NSA.

#### Conceptos clave:

- **Contextos de seguridad**
- **Tipos (types)**
- **Políticas**

Ejemplo de contexto:

```bash
ls -Z /var/www
```

Output:

```text
system_u:object_r:httpd_sys_content_t:s0 index.html
```

Componentes:

- **user**
- **role**
- **type**
- **level**

El elemento más importante es el **type**, que define lo que está permitido.

---

### 3. Modos de SELinux

```bash
getenforce
```

- **Enforcing** → bloquea accesos no permitidos
- **Permissive** → solo registra
- **Disabled** → desactivado

---

### 4. AppArmor

Alternativa más simple que SELinux.

Basado en:

- rutas de archivos (path-based)
- perfiles por aplicación

Ubicación:

```text
/etc/apparmor.d/
```

---

### 5. Diferencias clave

| Característica | SELinux             | AppArmor        |
| -------------- | ------------------- | --------------- |
| Modelo         | basado en etiquetas | basado en rutas |
| Complejidad    | alta                | media           |
| Flexibilidad   | muy alta            | moderada        |

---

## Laboratorio Práctico

### Escenario

Un servidor web (`nginx`) no puede acceder a un directorio personalizado `/srv/app`, aunque los permisos UNIX son correctos.

---

# Parte 1: Diagnóstico con SELinux

---

## Paso 1: Ver estado

```bash
getenforce
```

---

## Paso 2: Comprobar contexto del directorio

```bash
ls -Zd /srv/app
```

Output incorrecto:

```text
default_t
```

---

## Paso 3: Comprobar logs

```bash
sudo journalctl | grep AVC
```

Ejemplo:

```text
avc: denied { read } for pid=1234 comm="nginx"
```

---

## Paso 4: Solucionar con contexto correcto

```bash
sudo semanage fcontext -a -t httpd_sys_content_t "/srv/app(/.*)?"
sudo restorecon -Rv /srv/app
```

---

### Explicación

- `semanage` → define política persistente
- `restorecon` → aplica contexto

---

# Parte 2: Diagnóstico con AppArmor

---

## Paso 1: Ver estado

```bash
sudo aa-status
```

---

## Paso 2: Ver perfil de nginx

```bash
cat /etc/apparmor.d/usr.sbin.nginx
```

---

## Paso 3: Logs de denegación

```bash
dmesg | grep apparmor
```

---

## Paso 4: Ajustar perfil

```bash
sudo nano /etc/apparmor.d/usr.sbin.nginx
```

Añadir:

```text
/srv/app/** r,
```

---

## Paso 5: Recargar perfil

```bash
sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
```

---

## Errores Comunes y Troubleshooting

### 1. Servicio funciona en permissive pero no en enforcing

-*Causa:** política mal definida.

Solución:

```bash
sudo journalctl | grep denied
```

---

### 2. Se desactiva SELinux en lugar de arreglarlo

!!! warning "Mala práctica crítica"
Desactivar SELinux elimina una capa de seguridad fundamental.

---

### 3. Contextos incorrectos tras copia de archivos

Solución:

```bash
restorecon -Rv /ruta
```

---

### 4. Problemas con AppArmor

Ver logs:

```bash
dmesg
```

---

### 5. Herramientas faltantes

Instalar:

```bash
sudo apt install policycoreutils
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Nunca desactivar SELinux en producción

Usar:

```bash
setenforce 0
```

solo para diagnóstico temporal.

---

### 2. Entender antes de modificar

- analizar logs
- identificar reglas implicadas

---

### 3. Usar herramientas auxiliares

```bash
audit2why
audit2allow
```

---

### 4. Aplicar mínimos privilegios

- limitar accesos por proceso
- reducir superficie de ataque

---

### 5. Versionar políticas

Guardar cambios en repositorio.

---

### 6. Testing previo

!!! tip "Entornos staging"
Probar cambios antes de producción evita caídas de servicio.

---

### 7. Monitorización continua

Detectar anomalías en logs de seguridad.

---

### 8. Integración con hardening global

SELinux/AppArmor deben complementar:

- firewall
- SSH
- auditoría

---

## Resumen y Siguiente Paso

Has aprendido a utilizar SELinux y AppArmor para implementar control de acceso obligatorio en Linux, entendiendo cómo los procesos pueden ser restringidos a nivel de kernel incluso si están comprometidos.

Este conocimiento eleva significativamente el nivel de seguridad de cualquier infraestructura Linux.

El siguiente paso es comenzar a trabajar con servicios reales en producción:

➡️ **8.1 Servidores Web (Nginx/Apache)**, donde aplicarás todo lo aprendido para desplegar aplicaciones seguras, eficientes y accesibles.
