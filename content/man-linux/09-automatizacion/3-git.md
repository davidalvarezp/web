# 9.3 Git: Control de Versiones para Sysadmins

---

## Introducción

En un entorno profesional, la automatización sin control de versiones es un riesgo operativo. Scripts, playbooks, configuraciones y despliegues deben ser **versionados, auditables y reproducibles**. Aquí es donde entra **Git**, el sistema de control de versiones distribuido estándar en la industria.

Para un Sysadmin senior, Git no es solo una herramienta de desarrollo: es un componente crítico para gestionar **infraestructura como código, configuraciones de sistemas y despliegues automatizados** con garantías de trazabilidad.

---

## Objetivos de aprendizaje

Al finalizar este capítulo serás capaz de:

- Comprender el modelo de funcionamiento de Git.
- Gestionar repositorios locales y remotos.
- Versionar scripts, configuraciones y playbooks.
- Trabajar con ramas (branches) y flujos de cambios.
- Resolver conflictos y mantener historial limpio.
- Aplicar buenas prácticas en entornos profesionales.

---

## Conceptos Teóricos

### 1. ¿Qué es Git?

Git es un sistema de control de versiones distribuido que permite:

- registrar cambios en archivos
- mantener historial completo
- colaborar en equipos
- revertir estados anteriores

A diferencia de otros sistemas, Git no guarda solo diferencias: guarda **instantáneas (snapshots)** del estado del proyecto.

!!! info "Concepto clave"
Cada commit representa el estado completo del proyecto en un momento concreto.

---

### 2. Arquitectura de Git

Git se compone de tres áreas principales:

- **Working directory** → archivos en local
- **Staging area (index)** → área de preparación
- **Repositorio (.git)** → historial versionado

Flujo típico:

```text
Working → Staging → Commit → Repository
```

---

### 3. Estados de los archivos

Un archivo en Git puede estar en:

- **untracked** → no versionado
- **modified** → modificado
- **staged** → preparado
- **committed** → registrado

---

### 4. Commits e historial

Un commit incluye:

- cambios realizados
- autor
- timestamp
- mensaje descriptivo

Ejemplo:

```bash
git commit -m "Añadir script de backup"
```

---

### 5. Ramas (Branches)

Las ramas permiten trabajar en paralelo:

- `main` / `master` → rama principal
- `feature/*` → nuevas funcionalidades
- `hotfix/*` → correcciones urgentes

Crear rama:

```bash
git branch nueva-feature
git checkout nueva-feature
```

O directamente:

```bash
git checkout -b nueva-feature
```

---

### 6. Repositorios remotos

Permiten sincronizar cambios:

```bash
git remote add origin git@repo.git
git push -u origin main
```

---

### 7. Merge y conflictos

Cuando dos cambios afectan a las mismas líneas:

```text
<<<<<<< HEAD
cambio local
=======
cambio remoto
>>>>>>> rama
```

Debe resolverse manualmente.

---

## Laboratorio Práctico

### Escenario

Versionar un proyecto de automatización:

- script Bash de backup
- playbook de Ansible
- mantener historial y control de cambios

---

## Parte 1: Inicializar repositorio

```bash
mkdir automatizacion
cd automatizacion
git init
```

---

## Parte 2: Añadir archivos

```bash
cp ../backup.sh .
cp ../install_nginx.yml .
```

Ver estado:

```bash
git status
```

---

## Parte 3: Añadir al staging

```bash
git add backup.sh install_nginx.yml
```

---

## Parte 4: Crear commit

```bash
git commit -m "Primer commit: scripts de automatización"
```

---

## Parte 5: Crear repositorio remoto

```bash
git remote add origin git@github.com:usuario/automatizacion.git
```

---

## Parte 6: Subir cambios

```bash
git push -u origin main
```

---

## Parte 7: Workflow de cambios

Modificar archivo:

```bash
nano backup.sh
```

Ver cambios:

```bash
git diff
```

Guardar:

```bash
git add backup.sh
git commit -m "Mejora logging backup"
git push
```

---

## Output esperado

```text
[main abc123] Mejora logging backup
 1 file changed, 3 insertions(+)
```

---

## Errores Comunes y Troubleshooting

### 1. No configurar identidad

```text
Please tell me who you are
```

-*Solución:**

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

---

### 2. Push rechazado

```text
rejected
```

-*Causa:**

desincronización con remoto.

-*Solución:**

```bash
git pull --rebase
```

---

### 3. Añadir archivos sensibles

Ejemplo: claves privadas.

-*Solución:**

usar `.gitignore`:

```text
-.key
.env
```

---

### 4. Conflictos de merge

-*Solución:**

editar manualmente y:

```bash
git add archivo
git commit
```

---

### 5. Commits desordenados

Mensajes poco claros dificultan auditoría.

---

## Buenas Prácticas (Nivel Senior)

### 1. Mensajes de commit claros

```text
tipo: descripción breve

detalle opcional
```

Ejemplo:

```text
feat: añadir playbook nginx
fix: corregir ruta backup
```

---

### 2. Uso de ramas

- nunca trabajar directamente en `main`
- usar flujo controlado

---

### 3. `.gitignore` adecuado

```text
-.log
-.tmp
backup/
```

---

### 4. Integración con automatización

Versionar:

- scripts Bash
- playbooks Ansible
- configuraciones

---

### 5. Hooks

Validación automática antes de commits:

```bash
.git/hooks/pre-commit
```

---

### 6. Repositorios privados

Evitar exponer infraestructura:

- usar GitHub privado / GitLab
- controlar accesos

---

### 7. Auditoría

Git permite:

- saber quién hizo cambios
- cuándo
- qué se modificó

Clave para entornos regulados.

---

### 8. Integración CI/CD

Git es base de:

- pipelines
- despliegues automáticos
- testing

---

### 9. Revertir cambios

```bash
git revert HEAD
```

Nunca borrar historial en producción.

---

## Resumen y Siguiente Paso

Has aprendido a utilizar Git como sistema de control de versiones aplicado a la administración de sistemas, permitiendo gestionar scripts, configuraciones e infraestructuras con trazabilidad y control total.

Dominar Git es imprescindible para cualquier flujo moderno de automatización y despliegue.

A partir de este punto, eres capaz de:

- automatizar con Bash
- gestionar infraestructuras con Ansible
- versionar y auditar con Git

Con esto completas el bloque de automatización y estás preparado para abordar entornos más avanzados como plataformas de ejecución y orquestación.

➡️ **Siguiente bloque recomendado:** Virtualización y contenedores (`10-virtualizacion`).
