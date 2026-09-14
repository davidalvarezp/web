# 9.2 Automatización con Ansible: Infraestructura como Código

---

## Introducción

A medida que las infraestructuras crecen en complejidad, los scripts Bash dejan de ser suficientes para gestionar múltiples servidores de forma consistente. Aquí es donde entra **Ansible**, una herramienta de automatización que permite gestionar configuraciones, despliegues y operaciones mediante **Infraestructura como Código (IaC)**.

Ansible destaca por su simplicidad: no requiere agentes, utiliza **SSH** como canal de comunicación y define el estado del sistema mediante archivos declarativos en **YAML**. Para un Sysadmin senior, Ansible permite garantizar **consistencia, escalabilidad y repetibilidad** en entornos productivos.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender la arquitectura y funcionamiento de Ansible.
- Crear inventarios de hosts y gestionarlos.
- Escribir playbooks en YAML para automatización.
- Ejecutar tareas remotas de forma controlada.
- Aplicar buenas prácticas en entornos reales.

---

## Conceptos Teóricos

### 1. ¿Qué es Ansible?

Ansible es una herramienta de automatización que permite:

- configuración de sistemas
- despliegue de aplicaciones
- ejecución remota de tareas
- orquestación de infraestructuras

Se basa en tres pilares:

- **Agentless** → no requiere instalar software en los nodos gestionados
- **Declarativo** → defines el estado deseado, no los pasos
- **Idempotente** → múltiples ejecuciones no alteran el resultado final

!!! info "Concepto clave"
Ansible no describe *cómo* ejecutar tareas, sino *cómo debe quedar el sistema*.

---

### 2. Arquitectura de Ansible

Componentes principales:

- **Nodo de control**: donde se ejecuta Ansible
- **Nodos gestionados**: servidores destino
- **Inventario**: listado de hosts
- **Playbooks**: definiciones de tareas
- **Módulos**: unidades de trabajo (copy, apt, service, etc.)

Flujo:

1. Ansible lee el inventario
2. Se conecta por SSH
3. Ejecuta módulos en remoto
4. Devuelve resultados

---

### 3. Inventario de hosts

Archivo que define los sistemas gestionados:

```ini
[web]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[db]
db1 ansible_host=192.168.1.20
```

Parámetros útiles:

- `ansible_user`
- `ansible_ssh_private_key_file`

---

### 4. Playbooks y YAML

Los playbooks definen tareas de forma declarativa:

```yaml
- name: Instalar nginx
  hosts: web
  become: true

  tasks:
    - name: Instalar paquete
      apt:
        name: nginx
        state: present
```

Elementos:

- `hosts` → grupo destino
- `become` → privilegios elevados
- `tasks` → lista de acciones

---

### 5. Módulos

Ansible utiliza módulos en lugar de comandos directos:

- `apt` → gestión de paquetes
- `copy` → copia de archivos
- `service` → gestión de servicios
- `file` → gestión de permisos

!!! warning "Evitar malas prácticas"
No abuses del módulo `shell`. Prioriza módulos nativos.

---

## Laboratorio Práctico

### Escenario

Gestionar dos servidores web:

- instalar nginx
- desplegar contenido web
- asegurar que el servicio está activo

---

## Parte 1: Instalación de Ansible

```bash
sudo apt update
sudo apt install ansible
```

Verificación:

```bash
ansible --version
```

---

## Parte 2: Crear inventario

```bash
nano hosts.ini
```

```ini
[web]
192.168.1.10
192.168.1.11
```

---

## Parte 3: Test de conectividad

```bash
ansible -i hosts.ini web -m ping
```

Output esperado:

```json
"ping": "pong"
```

---

## Parte 4: Crear playbook

```bash
nano install_nginx.yml
```

Contenido:

```yaml
- name: Configurar servidores web
  hosts: web
  become: true

  tasks:

    - name: Instalar nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Copiar página web
      copy:
        dest: /var/www/html/index.html
        content: "Servidor configurado con Ansible"

    - name: Asegurar servicio nginx
      service:
        name: nginx
        state: started
        enabled: true
```

---

## Parte 5: Ejecutar playbook

```bash
ansible-playbook -i hosts.ini install_nginx.yml
```

---

## Resultado esperado

- Nginx instalado en todos los nodos
- Servicio activo
- Página accesible:

```bash
curl http://IP
```

---

## Errores Comunes y Troubleshooting

### 1. Fallos de conexión SSH

```text
UNREACHABLE
```

-*Causa:**

- claves SSH no configuradas

-*Solución:**

```bash
ssh-copy-id user@host
```

---

### 2. Permisos insuficientes

Errores al instalar paquetes.

-*Solución:**

```yaml
become: true
```

---

### 3. Inventario incorrecto

Hosts mal definidos o inaccesibles.

-*Solución:**

```bash
ansible-inventory -i hosts.ini --list
```

---

### 4. Uso incorrecto de YAML

Errores de indentación.

-*Solución:**

- usar espacios (no tabs)
- validar sintaxis

---

### 5. Cambios no aplicados

Ansible no ejecuta tareas si no detecta cambios.

-*Causa:**

idempotencia.

---

## Buenas Prácticas (Nivel Senior)

### 1. Estructura de proyecto

```text
ansible/
├── inventory/
├── group_vars/
├── roles/
└── playbooks/
```

---

### 2. Uso de roles

Permite modularidad:

```bash
ansible-galaxy init nginx
```

---

### 3. Variables

Separar configuración de lógica:

```yaml
nginx_port: 80
```

---

### 4. Vault (secretos)

```bash
ansible-vault encrypt vars.yml
```

---

### 5. Idempotencia estricta

Evitar tareas no deterministas.

---

### 6. Control de cambios

Ejecutar en modo check:

```bash
ansible-playbook --check
```

---

### 7. Limitar impacto

```bash
--limit web1
```

---

### 8. Logs y auditoría

Integrar con sistemas de logging centralizado.

---

### 9. Evitar snowflake servers

Todos los servidores deben ser reproducibles.

---

## Resumen y Siguiente Paso

Has aprendido a utilizar Ansible para automatizar configuraciones y despliegues de forma declarativa, idempotente y escalable. Esta herramienta es esencial para gestionar infraestructuras modernas sin depender de scripts manuales ni configuraciones inconsistentes.

El siguiente paso es completar el ciclo de automatización integrando control de versiones y colaboración:

➡️ **9.3 Git** — Gestión de código y versionado para infraestructuras y automatización.
