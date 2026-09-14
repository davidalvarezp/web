# 2.3 Listas de Control de Acceso (ACLs)

El modelo tradicional de permisos de Linux (Usuario, Grupo, Otros) es elegante y rápido, pero presenta una limitación crítica en entornos corporativos: solo permite asignar un único usuario dueño y un único grupo propietario a cada archivo o carpeta. Cuando las necesidades de la infraestructura exigen políticas de acceso más complejas, entran en juego las **ACLs (Access Control Lists)**.

---

## Introducción

Imagina que tienes un archivo de configuración que pertenece a `root:sysadmin`. El departamento de seguridad te pide que un auditor específico (y solo él) pueda leer el archivo, mientras que un equipo de desarrolladores externos necesita poder modificarlo. Bajo el modelo estándar, resolver esto implicaría crear grupos artificiales y complejos. Las ACLs rompen esta limitación permitiendo asociar una lista detallada de permisos para múltiples usuarios y grupos específicos de forma directa sobre un único recurso.

---

## Objetivos de aprendizaje

- Identificar cuándo el modelo tradicional UGO se queda corto y es necesario implementar ACLs.
- Auditar los permisos extendidos de un archivo utilizando `getfacl`.
- Modificar, añadir y eliminar reglas de acceso quirúrgicas con `setfacl`.
- Configurar **ACLs por defecto (Default ACLs)** en directorios para garantizar la herencia de permisos.
- Comprender el impacto de la **Máscara (Mask)** sobre los permisos efectivos.

---

## Conceptos Teóricos

### 1. ¿Cómo funcionan las ACLs?

Las ACLs extienden los metadatos del sistema de archivos (atributos extendidos) para añadir reglas adicionales. Cuando el Kernel evalúa si un usuario puede acceder a un archivo con ACLs, sigue este orden estricto de prioridades:

1. ¿Es el usuario dueño del archivo? Si sí, se aplican los permisos de dueño.
2. ¿Existe una ACL específica para este UID? Si sí, se aplica esa regla.
3. ¿Pertenece el usuario al grupo propietario o a alguno de los grupos con ACL específica? Si sí, se aplican esos derechos.
4. Si nada se cumple, se aplican los permisos de "Otros" (Others).

### 2. Comandos Troncales

-   **`getfacl`:** Lee los metadatos del archivo y despliega la lista completa de accesos.
-   **`setfacl`:** Modifica la lista. Utiliza el flag `-m` para modificar/añadir y `-x` para eliminar reglas.

### 3. El Concepto de la Máscara (`mask`)

Cuando se habilitan ACLs en un archivo, aparece un nuevo concepto llamado **máscara**. La máscara define el **límite máximo de permisos efectivos** que cualquier usuario o grupo de la ACL (excepto el dueño) puede llegar a tener. Si la máscara se establece en `r--` (lectura), aunque le des `rwx` (acceso total) a un usuario en la ACL, su permiso efectivo real será únicamente de lectura.

### 4. ACLs por Defecto (Default ACLs)

Aplicadas exclusivamente a **directorios**. No afectan a los permisos del directorio en sí, sino que actúan como una "plantilla heredable". Cualquier archivo o subcarpeta que se cree dentro de ese directorio heredará automáticamente las ACLs definidas por defecto, facilitando enormemente la gestión de permisos en entornos compartidos de red (como servidores Samba o NFS).

---

## Laboratorio Práctico: Permisos Multi-Rol

### Escenario

Disponemos de un directorio crítico de auditoría en `/srv/auditoria`. El propietario actual es `root:sysadmin`. Necesitamos aplicar la siguiente política sin alterar la propiedad del directorio:

1. El usuario `auditor_externo` debe tener acceso exclusivo de lectura (`r--`).
2. El grupo `compliance_team` debe tener acceso de lectura y escritura (`rw-`).
3. Cualquier archivo nuevo creado dentro del directorio debe heredar estas mismas reglas automáticamente.

### Paso 1: Verificar el estado inicial

Ejecutamos `getfacl` para observar la estructura tradicional antes de aplicar cambios.

```bash
sudo mkdir -p /srv/auditoria
getfacl /srv/auditoria
```

*Muestra el output estándar de permisos POSIX mapeados en formato de lista.*

### Paso 2: Asignar ACLs específicas a usuarios y grupos

Utilizamos setfacl especificando si la regla es para un usuario (u:) o un grupo (g:).

```bash
# Otorgar lectura al usuario auditor_externo (el directorio necesita 'x' para permitir el acceso)
sudo setfacl -m u:auditor_externo:rx /srv/auditoria

# Otorgar lectura y escritura al grupo compliance_team
sudo setfacl -m g:compliance_team:rwx /srv/auditoria
```

### Paso 3: Configurar la herencia (Default ACLs)

Para que todo archivo futuro mantenga esta lógica, repetimos el comando añadiendo el flag -d (Default).
```bash
sudo setfacl -d -m u:auditor_externo:rx /srv/auditoria
sudo setfacl -d -m g:compliance_team:rwx /srv/auditoria
```

### Paso 4: Auditar el resultado extendido

Analizamos cómo el sistema procesa los nuevos metadatos:

```bash
getfacl /srv/auditoria
```

*Output esperado:*

```text
# file: srv/auditoria
# owner: root
# group: sysadmin
user::rwx
user:auditor_externo:r-x
group::r-x
group:compliance_team:rwx
mask::rwx
other::r-x
default:user::rwx
default:user:auditor_externo:r-x
default:group::r-x
default:group:compliance_team:rwx
default:mask::rwx
default:other::r-x
```

Si ahora ejecutas un simple ls -ld /srv/auditoria, notarás un cambio sutil pero vital en la cadena de permisos:

```text
drwxrwxr-x+ 2 root sysadmin 4096 may 18 08:35 /srv/auditoria
```

!!! info "El signo Más (+)"
    Ese carácter + al final de la cadena de permisos (drwxrwxr-x+) es el indicador universal en Linux de que **ese archivo o directorio tiene ACLs extendidas activas**. Cuando lo veas, el comando ls ya no te estará mostrando la verdad absoluta; tendrás que usar getfacl.

---

## Errores Comunes y Troubleshooting

1. **Pérdida de ACLs durante migraciones o backups:** Utilizar comandos tradicionales como cp o tar sin los parámetros adecuados destruirá los atributos extendidos, haciendo que los archivos clonados pierdan las ACLs y queden inaccesibles o expuestos.

  > **Solución:** Al copiar, usa siempre cp -a o cp --preserve=xattr. Al empaquetar con tar, añade obligatoriamente las flags --acls y --xattrs.

2. **El misterio de la Máscara restrictiva:** Modificas los permisos de un archivo con ACL usando el comando tradicional chmod g-w archivo. Al hacer esto, Linux no modifica los grupos secundarios, sino que **reescribe la máscara**. Como consecuencia, todos los usuarios de la ACL perderán el derecho de escritura de forma inmediata aunque sus reglas individuales digan lo contrario.

  > **Solución:** Si la máscara ha limitado los permisos (lo verás en getfacl con la advertencia #effective:), restáurala usando: sudo setfacl -m m:rwx archivo.

---

## Buenas Prácticas

- **No abuses de las ACLs:** Las ACLs añaden complejidad cognitiva. Un administrador que entre nuevo a la infraestructura puede volverse loco intentando entender por qué un usuario accede a un archivo si el comando ls -l tradicional dice lo contrario. Úsalas solo cuando el modelo UGO sea inviable.
- **Documentación obligatoria:** Si una estructura de directorios crítica depende de ACLs para su funcionamiento productivo, añade un archivo README.md explicativo en la raíz del recurso o automatiza su despliegue mediante playbooks de **Ansible** para mantener la infraestructura como código (IaC).
- **Eliminación limpia:** Si decides revocar por completo las políticas extendidas de un archivo y volver al modelo tradicional, no borres línea por línea. Usa el flag de purga total:

  ```bash
  sudo setfacl -b /srv/auditoria
  ```

  *El flag -b (remove-all) elimina instantáneamente todas las ACLs extendidas y el signo + desaparecerá.*

---

## Resumen

Has aprendido a romper los límites del sistema de archivos POSIX tradicional, dotando a tu infraestructura de un control de acceso granular y profesional. Con las identidades y sus permisos de almacenamiento bajo control, el siguiente desafío de seguridad es gestionar cómo los usuarios ejecutan comandos administrativos.