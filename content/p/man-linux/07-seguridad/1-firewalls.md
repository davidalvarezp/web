# 7.1 Firewalls en Linux: UFW y NFTables

---

## Introducción

En cualquier sistema expuesto a red, el **firewall** es la primera línea de defensa. Su función es controlar qué tráfico puede entrar o salir del sistema, aplicando políticas de seguridad basadas en reglas. Sin un firewall correctamente configurado, incluso un servidor perfectamente parcheado sigue siendo vulnerable.

En Linux moderno existen múltiples herramientas, pero destacan dos enfoques:

- **UFW (Uncomplicated Firewall)** → interfaz simplificada (ideal para administración rápida).
- **NFTables** → herramienta avanzada y moderna que sustituye a iptables.

Como Sysadmin, debes ser capaz de trabajar con ambos: UFW para operaciones rápidas y NFTables para configuraciones complejas y altamente optimizadas.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender cómo funciona un firewall a nivel de filtrado de paquetes.
- Configurar reglas básicas con UFW.
- Implementar políticas avanzadas con NFTables.
- Gestionar tráfico entrante, saliente y reenviado.
- Diagnosticar problemas de conectividad relacionados con firewall.
- Diseñar políticas seguras en entornos de producción.

---

## Conceptos Teóricos

### 1. ¿Qué es un Firewall?

Un **firewall** es un sistema que inspecciona paquetes de red y decide si deben ser:

- **Aceptados (ACCEPT)**
- **Rechazados (REJECT)**
- **Descartados (DROP)**

Se basa en reglas que analizan:

- IP origen/destino
- puerto
- protocolo (TCP, UDP, ICMP)

---

### 2. Tipos de filtrado

#### Stateless

- No mantiene estado.
- Analiza paquetes individualmente.

#### Stateful (moderno)

- Mantiene seguimiento de conexiones.
- Permite tráfico relacionado automáticamente.

Ejemplo:

- Permites conexión saliente HTTP → respuestas permitidas automáticamente.

---

### 3. Cadenas y tablas (concepto base)

En motores como nftables:

- **INPUT** → tráfico entrante
- **OUTPUT** → tráfico saliente
- **FORWARD** → tráfico encaminado

---

### 4. Políticas por defecto

Definen comportamiento cuando no hay reglas:

- **deny all** → todo bloqueado (recomendado)
- **allow all** → inseguro

---

## Laboratorio Práctico

### Escenario

Configurar un servidor seguro:

- Solo permitir SSH y HTTP
- Bloquear resto de tráfico entrante
- Permitir salidas

---

# Parte 1: Configuración con UFW

---

## Paso 1: Instalar y activar UFW

```bash
sudo apt install ufw
sudo ufw enable
```

---

## Paso 2: Definir políticas por defecto

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

---

## Paso 3: Permitir SSH

```bash
sudo ufw allow 22/tcp
```

!!! warning "Acceso remoto"
Permitir SSH antes de activar el firewall evita perder acceso al servidor.

---

## Paso 4: Permitir HTTP

```bash
sudo ufw allow 80/tcp
```

---

## Paso 5: Ver estado

```bash
sudo ufw status verbose
```

### Output esperado

```text
Status: active
Default: deny (incoming), allow (outgoing)
22/tcp ALLOW
80/tcp ALLOW
```

---

## Paso 6: Eliminar regla

```bash
sudo ufw delete allow 80/tcp
```

---

## Paso 7: Limitar acceso SSH

```bash
sudo ufw limit 22/tcp
```

Mitiga ataques brute-force.

---

# Parte 2: Configuración con NFTables

---

## Paso 1: Ver estado

```bash
sudo nft list ruleset
```

---

## Paso 2: Crear configuración básica

Editar:

```bash
sudo nano /etc/nftables.conf
```

Contenido:

```nft
table inet filter {
    chain input {
        type filter hook input priority 0;
        policy drop;

        ct state established,related accept
        iif lo accept

        tcp dport 22 accept
        tcp dport 80 accept
    }

    chain forward {
        type filter hook forward priority 0;
        policy drop;
    }

    chain output {
        type filter hook output priority 0;
        policy accept;
    }
}
```

---

## Explicación

- **policy drop** → bloqueo por defecto
- **ct state established** → tráfico legítimo permitido
- **lo** → loopback permitido
- reglas específicas → puertos abiertos

---

## Paso 3: Aplicar configuración

```bash
sudo systemctl enable nftables
sudo systemctl start nftables
```

---

## Paso 4: Validar reglas

```bash
sudo nft list ruleset
```

---

## Paso 5: Añadir regla en caliente

```bash
sudo nft add rule inet filter input tcp dport 443 accept
```

---

## Errores Comunes y Troubleshooting

### 1. Pérdida de conexión SSH

-*Causa:**

- Firewall bloqueó puerto 22.

-*Solución:**

- Acceso por consola (KVM / rescue).
- Corregir reglas.

---

### 2. Servicio no accesible

Verificar:

```bash
ss -tulnp
```

Y firewall:

```bash
ufw status
```

---

### 3. Reglas duplicadas

Revisar:

```bash
ufw status numbered
```

---

### 4. NFTables no persistente

Asegurar:

```bash
systemctl enable nftables
```

---

### 5. Conflicto UFW vs NFTables

!!! warning "No mezclar herramientas"
Usar múltiples firewalls simultáneamente puede generar conflictos imprevisibles.

---

## Buenas Prácticas (Nivel Senior)

### 1. Política “deny by default”

Siempre:

```text
deny incoming
```

---

### 2. Principio de mínimo acceso

Solo abrir puertos necesarios.

---

### 3. Logging selectivo

En nftables:

```nft
log prefix "DROP: "
```

---

### 4. Hardening SSH junto a firewall

- limitar conexiones
- usar fail2ban

---

### 5. Segmentación de red

Separar:

- frontend
- backend
- bases de datos

---

### 6. Automatización

Ejemplo Ansible:

```yaml
- name: Configurar firewall
  ufw:
    rule: allow
    port: 22
```

---

### 7. Auditorías periódicas

```bash
nmap localhost
```

---

### 8. Evitar reglas demasiado permisivas

❌ Incorrecto:

```bash
ufw allow 0.0.0.0/0
```

---

## Resumen y Siguiente Paso

Has aprendido a implementar firewalls en Linux utilizando tanto UFW como NFTables, entendiendo desde la teoría del filtrado hasta la aplicación práctica en entornos reales. Este conocimiento es clave para proteger infraestructuras frente a accesos no autorizados.

El siguiente paso es profundizar en la visibilidad del sistema:

➡️ **7.2 Auditoría y Logs**, donde aprenderás a monitorizar eventos, detectar intrusiones y analizar actividad del sistema en profundidad.
