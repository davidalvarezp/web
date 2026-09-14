---
title: Bash Cheatsheet
description: Comandos y ejemplos prácticos de Bash para automatización, scripting y uso diario en Linux.
---

# ⚡ Bash Cheatsheet

Referencia rápida de Bash para scripting, automatización y uso en terminal.

---

## Básicos

```bash
echo "Hola mundo"
date
whoami
hostname
````

***

## Variables

```bash
VAR="valor"
echo $VAR

readonly PI=3.14

export VAR_GLOBAL="valor"
```

***

## Entrada de usuario

```bash
read nombre
echo "Hola $nombre"
```

***

## Condicionales

```bash
if [ "$VAR" == "valor" ]; then
  echo "OK"
else
  echo "NO"
fi
```

***

## Bucles

### for

```bash
for i in 1 2 3; do
  echo $i
done
```

```bash
for i in {1..5}; do
  echo $i
done
```

***

### while

```bash
i=0
while [ $i -lt 5 ]; do
  echo $i
  ((i++))
done
```

***

## Funciones

```bash
mi_funcion() {
  echo "Hola $1"
}

mi_funcion David
```

***

## Arrays

```bash
arr=(uno dos tres)

echo ${arr[0]}
echo ${arr[@]}
echo ${#arr[@]}
```

***

## Comparaciones

```bash
[ "$a" = "$b" ]
[ "$a" != "$b" ]

[ "$a" -eq 5 ]
[ "$a" -lt 10 ]
[ "$a" -gt 1 ]

[ -f archivo ]
[ -d carpeta ]
```

***

## Pipes y redirecciones

```bash
comando1 | comando2

echo "texto" > archivo
echo "texto" >> archivo

comando 2>&1
```

***

## grep

```bash
grep "texto" archivo
grep -i "texto" archivo
grep -r "texto" .
```

***

## awk

```bash
awk '{print $1}' archivo
awk -F ":" '{print $1}' /etc/passwd
```

***

## cut

```bash
cut -d ":" -f1 /etc/passwd
```

***

## find + exec

```bash
find / -name "*.log"
find . -type f -name "*.tmp" -delete
find . -type f -exec chmod 644 {} \;
```

***

## xargs

```bash
cat lista.txt | xargs -n1 comando
```

***

## Procesamiento de texto

```bash
sort archivo
uniq archivo
wc -l archivo
head archivo
tail archivo
tail -f archivo
```

***

## Aliases

```bash
alias ll='ls -lah'
alias gs='git status'
```

***

## Expansión y sustitución

```bash
echo ${VAR}

echo $(comando)
echo `comando`
```

***

## Control de errores

```bash
set -e   # abandonar si hay error
set -x   # debug
set -u   # variables no definidas
```

***

## Script básico

```bash
#!/bin/bash

set -e

echo "Inicio"

for i in {1..3}; do
  echo "Iteración $i"
done

echo "Fin"
```

***

## Permisos

```bash
chmod +x script.sh
./script.sh
```

***

## Argumentos

```bash
echo $0  # script
echo $1  # arg1
echo $2  # arg2
echo $#  # número de args
echo $@  # todos
```

***

## Debug

```bash
bash -x script.sh
```

***

## ⏱️ Watch

```bash
watch -n 1 comando
```

***

## Tips prácticos

* Usa `set -euo pipefail` en scripts serios:

```bash
set -euo pipefail
```

* Usa comillas SIEMPRE:

```bash
"$VAR"
```

* Evita errores con espacios en variables

***

## Ejemplo real (loop por hosts)

```bash
for host in $(cat hosts.txt); do
  ssh "$host" "uptime"
done
```

***

## Ejemplo (filtrado de logs)

```bash
grep "ERROR" app.log | awk '{print $1,$2,$5}'
```

***

> Pensado para automatización real  
> Uso directo en terminal y scripts  
> Base para DevOps / SRE / seguridad
