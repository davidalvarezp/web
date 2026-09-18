# 8.1 Servidores Web en Linux: Nginx y Apache en Producción

---

## Introducción

Los **servidores web** son uno de los componentes más críticos en cualquier infraestructura moderna. Son el punto de entrada para aplicaciones, APIs, paneles de administración y servicios públicos. En Linux, los dos servidores más utilizados son **Nginx** y **Apache**, cada uno con enfoques arquitectónicos distintos y casos de uso específicos.

Como Sysadmin senior, no basta con instalar un servidor web: debes **configurarlo de forma segura, optimizada y preparada para producción**, garantizando rendimiento, resiliencia y escalabilidad.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender las diferencias entre Nginx y Apache.
- Instalar y configurar un servidor web en Linux.
- Gestionar hosts virtuales (virtual hosts/server blocks).
- Servir contenido estático y aplicaciones backend.
- Configurar logs y diagnosticar problemas.
- Aplicar buenas prácticas de seguridad y rendimiento.

---

## Conceptos Teóricos

### 1. Nginx vs Apache

#### Apache

- Basado en procesos/hilos.
- Alta compatibilidad.
- Uso tradicional en entornos legacy.

#### Nginx

- Basado en eventos (event-driven).
- Alto rendimiento bajo carga.
- Ideal como reverse proxy.

!!! info "Recomendación actual"
En entornos modernos, Nginx es preferido por su eficiencia y escalabilidad.

---

### 2. Arquitectura de Nginx

Nginx utiliza un modelo:

- **Worker processes**
- **Event loop**

Ventajas:

- bajo consumo de memoria
- alta concurrencia
- excelente manejo de conexiones simultáneas

---

### 3. Ciclo de una petición HTTP

1. Cliente → petición HTTP
2. Servidor web → interpreta ruta
3. Respuesta:
   * archivo estático
   * proxy a backend (PHP, Node, etc.)

---

### 4. Virtual Hosts / Server Blocks

Permiten servir múltiples dominios desde un mismo servidor.

Ejemplo:

- `example.com`
- `api.example.com`

---

### 5. Ubicaciones de configuración

#### Nginx

```text
/etc/nginx/nginx.conf
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
```

#### Apache

```text
/etc/apache2/apache2.conf
/etc/apache2/sites-available/
```

---

## Laboratorio Práctico

### Escenario

Desplegar un servidor web con Nginx:

- servir contenido estático
- configurar dominio
- habilitar logs
- validar acceso

---

## Parte 1: Instalación de Nginx

```bash
sudo apt update
sudo apt install nginx
```

---

## Paso 2: Verificar servicio

```bash
systemctl status nginx
```

---

## Paso 3: Acceso inicial

```bash
curl http://localhost
```

Output esperado:

```html
<html>
Welcome to nginx!
</html>
```

---

## Parte 2: Configurar un Virtual Host

---

### Paso 1: Crear estructura web

```bash
sudo mkdir -p /var/www/app
echo "Hola mundo" | sudo tee /var/www/app/index.html
```

---

### Paso 2: Crear configuración

```bash
sudo nano /etc/nginx/sites-available/app
```

Contenido:

```nginx
server {
    listen 80;
    server_name app.local;

    root /var/www/app;
    index index.html;

    access_log /var/log/nginx/app_access.log;
    error_log /var/log/nginx/app_error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

### Explicación clave

- **server\_name** → dominio
- **root** → directorio web
- **try\_files** → control de rutas

---

### Paso 3: Activar sitio

```bash
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
```

---

### Paso 4: Validar configuración

```bash
sudo nginx -t
```

---

### Paso 5: Reiniciar servicio

```bash
sudo systemctl reload nginx
```

---

### Paso 6: Test

```bash
curl http://app.local
```

---

## Parte 3: Reverse Proxy (caso real)

---

### Escenario: Aplicación en puerto 3000

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## Parte 4: Apache básico (comparativa)

---

### Instalación

```bash
sudo apt install apache2
```

---

### Virtual Host

```bash
sudo nano /etc/apache2/sites-available/app.conf
```

```apache
<VirtualHost *:80>
    ServerName app.local
    DocumentRoot /var/www/app
</VirtualHost>
```

---

### Activar

```bash
sudo a2ensite app
sudo systemctl reload apache2
```

---

## Errores Comunes y Troubleshooting

### 1. Error 403 Forbidden

-*Causa:**

- permisos incorrectos.

Solución:

```bash
chmod -R 755 /var/www/app
```

---

### 2. Error 404 Not Found

- ruta incorrecta
- archivo inexistente

---

### 3. nginx no arranca

```bash
nginx -t
```

Verifica errores de config.

---

### 4. Puerto ocupado

```bash
ss -tulnp | grep :80
```

---

### 5. DNS no resuelve

Editar:

```bash
/etc/hosts
```

```text
127.0.0.1 app.local
```

---

## Buenas Prácticas (Nivel Senior)

### 1. Separación de sitios

- un config por aplicación
- modularidad

---

### 2. Logs dedicados

```nginx
access_log /var/log/nginx/app.log;
```

---

### 3. Seguridad básica

- desactivar directory listing
- ocultar versión del servidor

```nginx
server_tokens off;
```

---

### 4. Uso de HTTPS

Implementar TLS (Let's Encrypt):

```bash
apt install certbot
```

---

### 5. Reverse proxy para apps

- Node.js
- Python
- Go

---

### 6. Optimización

```nginx
worker_processes auto;
```

---

### 7. Rate limiting

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
```

---

### 8. Hardening

- firewall activo
- SELinux/AppArmor configurado
- no ejecutar como root

---

## Resumen y Siguiente Paso

Has aprendido a instalar, configurar y operar servidores web en Linux con Nginx y Apache, incluyendo virtual hosts, reverse proxy y troubleshooting. Este conocimiento es esencial para desplegar servicios web robustos en producción.

El siguiente paso es abordar otro componente crítico de cualquier aplicación:

➡️ **8.2 Bases de Datos**, donde aprenderás a desplegar, asegurar y optimizar sistemas como MySQL, PostgreSQL o MariaDB.
