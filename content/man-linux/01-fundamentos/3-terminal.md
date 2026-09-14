# 1.3 Dominando la Terminal: Navegación, Manipulación y Búsquedas

La interfaz de línea de comandos (CLI) es el entorno natural del SysAdmin. En producción, los servidores no tienen entorno gráfico; la eficiencia, 
la velocidad y la capacidad de automatización dependen totalmente 
de tu destreza en la terminal.

---

## Introducción

Dominar la terminal va más allá de memorizar comandos aislados. Implica entender cómo interactúan los flujos de texto, 
cómo estructurar operaciones en lote y cómo interrogar al sistema para encontrar un archivo o una línea de configuración específica en cuestión de segundos. 
En este capítulo pasaremos de la navegación básica a las búsquedas avanzadas en entornos reales.

---

## Objetivos de aprendizaje

- Navegar por el FHS de forma eficiente utilizando rutas absolutas, relativas y atajos del shell.
- Manipular archivos y directorios de forma segura en entornos de producción.
- Dominar los flujos de redirección de texto (`stdin`, `stdout`, `stderr`).
- Realizar búsquedas quirúrgicas de archivos y cadenas de texto con `find` y `grep`.

---

## Conceptos Teóricos

### 1. Canales Estándar y Redirección (I/O Redirection)

Cada comando ejecutado en el shell abre automáticamente tres canales o "descriptores" de archivo (File Descriptors):

-   **stdin (Descriptor 0):** Entrada estándar (normalmente el teclado).
-   **stdout (Descriptor 1):** Salida estándar (normalmente la pantalla para datos correctos).
-   **stderr (Descriptor 2):** Salida de errores (separada de stdout para no contaminar los datos).

Podemos desviar estos flujos utilizando operadores de redirección:

-   `>` : Sobrescribe el archivo con la salida de un comando.
-   `>>` : Añade la salida al final del archivo sin borrar lo existente.
-   `2>` : Redirige exclusivamente los errores.
-   `|` (Pipe): Conecta la salida (`stdout`) de un comando directamente con la entrada (`stdin`) del siguiente.

### 2. Comandos de Supervivencia Esenciales

-   **`ls`**: Lista el contenido. En producción, siempre usarás `ls -la` (detallado, incluyendo archivos ocultos) o `ls -lh` (tamaños legibles por humanos).
-   **`cp` / `mv`**: Copiar y mover. El comando `cp -a` (archive) es vital para respaldar archivos de configuración manteniendo los permisos originales.
-   **`rm`**: Eliminar. No existe una "papelera de reciclaje" en la CLI; lo que se borra, desaparece.

### 3. El Poder de la Búsqueda: `find` vs `grep`

Una confusión común al empezar es no distinguir sus propósitos:

-   **`find`**: Busca **archivos o directorios** en el disco basándose en sus metadatos (nombre, tamaño, fecha de modificación, permisos).
-   **`grep`**: Busca **texto dentro** de los archivos (patrones, expresiones regulares).

---

## Laboratorio Práctico: Operaciones en la CLI

### Escenario

Un servidor web está fallando. Necesitas crear un entorno de diagnóstico, buscar un archivo de configuración perdido, 
aislar los errores del log de producción y limpiar los archivos temporales generados.

### Paso 1: Creación de Estructuras y Backup Seguro

Antes de tocar un archivo de configuración en producción, es obligatorio hacer una copia de seguridad.

```bash
# Crear un directorio para nuestro laboratorio y entrar en él
mkdir -p /tmp/lab_diagnostico && cd /tmp/lab_diagnostico

# Copiar el archivo de configuración de SSH manteniendo permisos y fechas
cp -a /etc/ssh/sshd_config ./sshd_config.bak
```

### Paso 2: Redirección y Filtrado de Logs

Imagina que el log de un servicio tiene miles de líneas. Necesitamos extraer solo los errores críticos y guardarlos en un informe.

```bash
# Simulamos un flujo de logs mezclando datos y errores, y filtramos con grep
echo "INFO: Servicio iniciado" > pseudo_log.txt
echo "ERROR: Fallo de conexión a la Base de Datos" >> pseudo_log.txt
echo "WARN: Uso de CPU elevado" >> pseudo_log.txt

# Filtrar líneas que contengan "ERROR" y guardarlas en un archivo específico
grep "ERROR" pseudo_log.txt > errores_criticos.log

# Descartar los errores de pantalla redirigiéndolos al agujero negro del sistema (/dev/null)
ls /root 2> /dev/null
```

### Paso 3: Búsquedas Avanzadas con find

Necesitas localizar todos los archivos de configuración (.conf) modificados en el directorio /etc en los últimos 2 días que ocupen menos de 10k.

```bash
find /etc -name "*.conf" -mtime -2 -size -10k
```

??? tip "Truco Avanzado: Combinar find con acciones"
    Puedes hacer que find ejecute un comando sobre cada archivo que encuentre.

    Por ejemplo, para buscar archivos .log viejos en /var/log y ver su tamaño:
    ```bash
    find /var/log -name "*.log" -exec du -sh {} \; 
    ```

---

## Errores Comunes y Troubleshooting

1. **El catastrófico rm -rf / o similares:** Un espacio mal colocado en un script o comando puede borrar datos críticos. Por ejemplo, rm -rf /tmp /mi_carpeta (si pones un espacio sin querer después de /tmp, podrías intentar borrar la raíz si eres root).

  > **Solución:** Activa el alias de seguridad en tu perfil: alias rm='rm -i' para que pida confirmación, o acostúmbrate a usar rm -v (verbose) para ver qué está pasando antes de que sea tarde.

2. **Archivos con espacios en el nombre:** Ejecutar bucles o comandos sobre archivos como Informe Anual.txt romperá los scripts porque el shell interpretará que son dos archivos independientes (Informe y Anual.txt).

  > **Solución:** Envuelve siempre las variables y rutas entre comillas dobles: cat "Informe Anual.txt".

3. **Saturar la consola con outputs gigantescos:** Hacer un cat a un archivo de 2GB bloqueará tu terminal por completo.

  > **Solución:** Usa paginadores como less (ej: less /var/log/syslog), que cargan el archivo en memoria de forma progresiva y permiten buscar con la tecla /.

---

## Buenas Prácticas

- **Usa rutas absolutas en scripts:** Al automatizar, nunca asumas en qué directorio se está ejecutando el script. En lugar de rm -rf logs/, utiliza siempre la ruta completa /var/log/mi_app/.
- **Domina los atajos de teclado:**
  - Ctrl + C: Cancela el comando en ejecución.
  - Ctrl + R: Busca de forma inversa en el historial de comandos ejecutados.
  - Tab: El tabulador es tu mejor amigo; úsalo constantemente para autocompletar rutas y evitar erratas.
- **No uses cat si solo vas a usar grep:** Hacer cat archivo.txt | grep patrón es un antipatrón ineficiente conocido como *Useless Use of Cat*. Lo correcto y más rápido es: grep patrón archivo.txt.

---

## Resumen
La terminal ya no tiene secretos en cuanto a movimiento y manipulación. Eres capaz de buscar, filtrar y redirigir datos con soltura, habilidades críticas para cualquier diagnóstico de infraestructura.
