![](Aspose.Words.619187aa-a80b-4e29-9f89-e3b9bf9c1397.001.jpeg)
# David Álvarez 
# Administración de Sistemas Informáticos en Red
# 25 / 05 / 25

[**ClickDeploy**](http://clickdeploy.davidalvarezp.com)        **[**David Álvarez**](http://davidalvarezp.com)** 

[**Introducción  3**](#_page2_x72.00_y72.00) **[**Objetivos  4**](#_page3_x72.00_y72.00) [**Análisis del Contexto  5**](#_page4_x72.00_y72.00) [Contexto Tecnológico  5](#_page4_x72.00_y104.45)** [Justificación del Proyecto  5](#_page4_x72.00_y318.16) [Valor Añadido del Proyecto  5](#_page4_x72.00_y523.33) [**Arquitectura  6**](#_page5_x72.00_y72.00) **[Infraestructura técnica general  6](#_page5_x72.00_y104.45)** [Servidor principal (cómputo)  7](#_page6_x72.00_y72.00) [Servidor secundario (almacenamiento)  7](#_page6_x72.00_y302.81) [**Tecnologías Utilizadas  8**](#_page7_x72.00_y72.00) **[**Sistema de Automatización  9**](#_page8_x72.00_y72.00) [Webhook con WooCommerce  9](#_page8_x72.00_y148.09)** [Automatización de suscripciones  9](#_page8_x72.00_y382.35) [Script principal  10](#_page9_x72.00_y72.00) [**Monitorización y Control  11**](#_page10_x72.00_y72.00) **[Netdata  11](#_page10_x72.00_y148.09)** [**Base de Datos  12**](#_page11_x72.00_y72.00) **[Estructura  12](#_page11_x72.00_y148.09)** [Auditoría mediante triggers  13](#_page12_x72.00_y72.00) [**Seguridad  13**](#_page12_x72.00_y317.35) **[Seguridad del servidor  13](#_page12_x72.00_y398.89)** [Seguridad en WordPress y la web  13](#_page12_x72.00_y545.88) [Seguridad en la base de datos  14](#_page13_x72.00_y72.00) [Buenas prácticas adicionales  14](#_page13_x72.00_y186.44) 

[**La Empresa  14**](#_page13_x72.00_y400.41) **[Introducción  14](#_page13_x72.00_y446.86)** [Propuesta de valor  14](#_page13_x72.00_y558.75) [Segmento de clientes  15](#_page14_x72.00_y72.00) [Canales de distribución  15](#_page14_x72.00_y171.89) [Estrategia de ingresos  15](#_page14_x72.00_y275.23) [Recursos clave  15](#_page14_x72.00_y393.12) [Actividades clave  15](#_page14_x72.00_y496.46) [Costes y financiación  15](#_page14_x72.00_y614.36) [**Conclusión  16**](#_page15_x72.00_y72.00) **[**Bibliografía  17**](#_page16_x72.00_y72.00) [**Anexos  18**](#_page17_x72.00_y72.00)** 
# <a name="_page2_x72.00_y72.00"></a>Introducción 
Disponer de una infraestructura tecnológica eficiente, segura y fácilmente gestionable se ha convertido en un requisito imprescindible. La digitalización ha transformado la forma en que las empresas trabajan, se comunican y captan clientes. 

El despliegue de servicios web como WordPress es cada vez más común, pero muchas pequeñas empresas y usuarios sin conocimientos técnicos se encuentran con barreras durante su implementación. La complejidad técnica, los costes de configuración y la necesidad de conocimientos especializados limitan su acceso a soluciones modernas basadas en contenedores y entornos virtualizados. 

ClickDeploy es una plataforma de despliegue automatizado de servicios web. El objetivo central del proyecto es desarrollar una plataforma web que automatice completamente la contratación, configuración y despliegue de servicios mediante el uso de contenedores, con el objetivo de poder aislar y limitar cada servicio ofrecido individualmente. 

A través de una página web y una lógica de backend totalmente automatizada, basada en scripts ejecutados mediante webhooks, ClickDeploy permite a cualquier usuario disponer del servicio deseado en cuestión de minutos, sin intervención humana ni conocimientos técnicos previos. 

ClickDeploy se presenta como una solución SaaS (Software as a Service) diseñada desde cero, integrando muchos de los conocimientos adquiridos a lo largo del ciclo de ASIR, como pueden ser: administración de sistemas, scripting, seguridad, virtualización y servicios web. El sistema se apoya en una arquitectura distribuida basada en dos nodos: un servidor principal que ejecuta los contenedores y gestiona la página web corporativa, y un servidor de almacenamiento en red (TrueNAS) que proporciona almacenamiento y backups. 

ClickDeploy plantea un modelo de negocio escalable, basado en suscripciones mensuales y el uso de software libre, permitiendo así reducir significativamente los costes operativos, aumentar la fiabilidad del sistema y ofrecer una solución con valor real. 

En definitiva, ClickDeploy no solo representa conocimientos técnicos al integrar múltiples disciplinas, sino que también se plantea como una propuesta viable para el mercado actual. Es una plataforma lista para su implementación, con un modelo de ingresos sostenible y una base técnica sólida, alineada con las tendencias del sector cloud y la automatización. 

Visita la [página web](http://clickdeploy.davidalvarezp.com).
# <a name="_page3_x72.00_y72.00"></a>Objetivos 
**Objetivo General** 

Desarrollar una plataforma web funcional y segura que permita la contratación, configuración y despliegue automatizado de servicios web mediante el uso de contenedores Docker, integrando la parte técnica y empresarial de un proyecto real. 

**Objetivos Específicos**

- Diseñar una infraestructura distribuida compuesta por un servidor principal y un servidor de almacenamiento, conectados mediante el protocolo iSCSI. 
- Automatizar completamente el proceso de despliegue utilizando scripts en bash y contenedores Docker. 
- Crear un sistema web basado en WordPress que permita al cliente contratar servicios, seleccionar características personalizadas (CPU, RAM, disco) y recibir notificaciones automatizadas. 
- Implementar mecanismos de seguridad a nivel de servidor, web y base de datos. 
- Diseñar una base de datos robusta con trazabilidad histórica para mantener en todo momento la integridad de los datos y las consultas. 
- Estudiar la viabilidad técnica, económica y comercial del proyecto desde una perspectiva empresarial realista. 
- Elaborar documentación avanzada y detallada para todos los componentes técnicos. 
# <a name="_page4_x72.00_y72.00"></a>Análisis del Contexto 
## <a name="_page4_x72.00_y104.45"></a>Contexto Tecnológico 
Nos encontramos en una era dominada por la virtualización y la arquitectura basada en microservicios, lo que comúnmente se denomina “nube”. Páginas web, bases de datos, servicios cloud, almacenamiento accesible desde cualquier lugar y dispositivo, y muchas herramientas de automatización, forman parte del nuevo estándar tecnológico. 

Sin embargo, para muchas PYMES y profesionales sin conocimientos técnicos, acceder y mantener estas soluciones sigue siendo una barrera significativa. 

La necesidad de plataformas accesibles, escalables y asequibles se han demandado aún más tras la pandemia, donde la digitalización ha pasado de ser una opción a una obligación. En este escenario nace ClickDeploy, con el objetivo de reducir drásticamente la complejidad técnica mediante la automatización, de principio a fin. 
## <a name="_page4_x72.00_y318.16"></a>Justificación del Proyecto 
ClickDeploy responde a una necesidad real: muchas empresas o trabajadores por cuenta propia desean ofrecer sus servicios en la nube, desde una página web, hasta una nube colectiva en la que poder almacenar, compartir y trabajar en conjunto. En la mayoría de estos casos no se dispone de conocimientos, recursos o tiempo para llevarlo a cabo. 

Gracias al sistema completamente automatizado, ClickDeploy elimina esas barreras. Desde una página web, el cliente contrata el servicio, selecciona sus especificaciones técnicas y, sin intervención humana, el sistema se encarga de todo: desde la creación del contenedor, configuración del servicio, generación del certificado SSL y conexión con la base de datos, hasta la monitorización y facturación. 
## <a name="_page4_x72.00_y523.33"></a>Valor Añadido del Proyecto 
- Automatización real del proceso completo de despliegue. 
- Plataforma escalable y adaptable a cualquier tipo de cliente. 
- Integración total entre página web, base de datos, infraestructura y contenedores. 
- Uso de software libre, servicios y servidores optimizados 
- Modelo de negocio viable mediante suscripciones mensuales. 

En conclusión, ClickDeploy no es solo un ejercicio académico, sino un proyecto con potencial de aplicabilidad real en el sector tecnológico actual, alineado con las tendencias del mercado y con las necesidades de digitalización de pequeñas estructuras y profesionales independientes. 
# <a name="_page5_x72.00_y72.00"></a>Arquitectura 
## <a name="_page5_x72.00_y104.45"></a>Infraestructura técnica general 
La arquitectura de ClickDeploy se ha diseñado con un enfoque modular y distribuido, garantizando tanto la escalabilidad horizontal y/o vertical, como la seguridad de la plataforma. La infraestructura está compuesta por dos servidores principales: 

**Servidor de cómputo** 

Encargado de ejecutar los contenedores Docker, alojar la página web, las bases de datos y ejecutar los scripts de automatización. 

Especificaciones del servidor: 

- **CPU**: AMD EPYC™ 7302P – 16 núcleos / 32 hilos a 3,3 GHz 
- **RAM**: 128 GB DDR4 ECC (corrección de errores) 
- **Almacenamiento local**: 
- 960 GB (2x960 GB NVMe SSD) en RAID 1 hardware 

  Utilizado para el sistema operativo, el sitio web y los archivos de Clickdeploy. 

- **Almacenamiento remoto**: 
  - Montaje iSCSI desde servidor TrueNAS (almacenamiento persistente de contenedores) 
- **Sistema operativo**: Debian 12 Server

**Servidor de almacenamiento** 

Configurado con TrueNAS, ofrece servicios de backup, almacenamiento externo conectado al servidor principal mediante la tecnología iSCSI y alta disponibilidad. 

Especificaciones del servidor: 

- **CPU**: AMD Ryzen™ 5 PRO 3600 (6 núcleos / 12 hilos, 3,6 GHz). 
- **RAM**: 32 GB DDR4 ECC, lo que garantiza corrección de errores para mejorar la fiabilidad en un entorno de almacenamiento. 
- **Almacenamiento**: 
- **Datos**: 24 TB útiles mediante 4 discos HDD de 8 TB configurados en RAID 5. 
- **SO**: 480 GB en RAID 1 con 2 SSD de 480 GB, asegurando redundancia y rápida recuperación. 
- **Sistema Operativo**: TrueNAS CORE. 

Ambos son servidores dedicados, contratados al proveedor IONOS. Los dos servidores se comunican a través de la red de ionos, compuesta por cableado de fibra óptica, lo que garantiza un alto rendimiento y un buen entorno para el intercambio de datos y procesos. El servidor principal tiene un coste fijo de 154,88, y el secundario 145,20. (€ /mes) 
## <a name="_page6_x72.00_y72.00"></a>Servidor principal (cómputo) 
El servidor de principal se encarga de: 

- Alojamiento del sitio web desarrollado con WordPress. 
- Ejecución del script de automatización (script.bash). 
- Ejecución de contenedores Docker. 
- Gestión del sistema de contratación y pagos recurrentes. 
- Integración con webhook para el despliegue automático de servicios. 

Está configurado con Nginx como servidor web y reverse proxy para los contenedores, MariaDB como gestor de bases de datos y PHP (versión 8.2 actualmente) como motor de ejecución para WordPress. 

Información detallada: **Anexo I - Servidor Principal.** 
## <a name="_page6_x72.00_y302.81"></a>Servidor secundario (almacenamiento) 
El servidor secundario está basado en TrueNAS CORE, antiguamente conocido como FreeNAS, permite proporcionar almacenamiento adicional a través de volúmenes compartidos mediante iSCSI. Entre sus funciones están: 

- Ofrecer los volúmenes de almacenamiento al servidor principal. 
- Realizar snapshots y backups programados. 
- Garantizar la redundancia y seguridad de los datos críticos. 

El almacenamiento remoto está montado en el servidor principal en “/mnt/”, y los volúmenes son gestionados por Docker desde el nodo principal, lo que permite mantener una separación lógica entre datos y lógica de ejecución. 

Información detallada: **Anexo II - Servidor Secundario.** 
# <a name="_page7_x72.00_y72.00"></a>Tecnologías Utilizadas 
El proyecto ClickDeploy integra una serie de herramientas y tecnologías de código abierto ampliamente utilizadas en entornos de producción: 

**Docker + Docker Compose** 

Tecnología base para el empaquetado y despliegue de servicios. Permite definir y gestionar múltiples contenedores como un conjunto. 

**ISCSI** 

Protocolo de red de almacenamiento basado en IP que permite la conexión de dispositivos de almacenamiento a través de una red TCP/IP 

**Nginx** 

Servidor web ligero y de alto rendimiento, utilizado también como reverse proxy. 

**MariaDB** 

Sistema gestor de bases de datos relacional. 

**PHP** 

Lenguaje de backend utilizado por WordPress. 

**WordPress** 

CMS para el desarrollo de la página web. 

**WooCommerce + WooSubscriptions** 

Plugins de e-commerce que permiten vender servicios y gestionarlos por suscripción, con esta extensión se permiten pagos recurrentes. 

**UpdraftPlus** 

Copias de seguridad automáticas y recuperación de WordPress. 

**Certbot + Let’s Encrypt** 

Gestión de certificados SSL gratuitos, permite conexiones https. 

**Fail2Ban** 

Protección contra ataques de fuerza bruta. 

La combinación de estas tecnologías permite ofrecer una solución segura, escalable, automatizada y fácil de mantener. Junto con estas tecnologías se implementaron archivos de log por secciones y diferentes herramientas de monitorización. 
# <a name="_page8_x72.00_y72.00"></a>Sistema de Automatización 
La automatización es uno de los pilares fundamentales del proyecto. ClickDeploy no se limita a ofrecer hosting, sino que automatiza completamente el proceso de despliegue de servicios desde que el cliente realiza el pedido hasta que el contenedor está operativo. 
## <a name="_page8_x72.00_y148.09"></a>Webhook con WooCommerce 
La automatización está directamente integrada en el sistema de contratación. Cuando el cliente finaliza su pedido: 

- WooCommerce genera un evento del tipo `order.completed`. 
- Un webhook personalizado envía los datos del pedido (email del cliente, servicio, especificaciones contratadas) a `script.php`. 
- El script PHP interpreta los parámetros y ejecuta en segundo plano `script.bash` con la configuración adecuada del contenedor docker. 

Esto permite que, sin ningún tipo de  intervención, el servicio quede desplegado y funcional en pocos minutos, y el cliente pueda acceder a su servicio (dominio especificado). 
## <a name="_page8_x72.00_y382.35"></a>Automatización de suscripciones 
Gracias a WooSubscriptions, cada servicio contratado se renueva automáticamente cada mes. En caso de impago o cancelación: 

- Se ejecuta un webhook de revocación. 
- El sistema llama a un script que borra el contenedor y libera los recursos. 
- Se actualiza la base de datos y se registra el evento. 

Este enfoque cierra el ciclo de vida del servicio, permitiendo escalabilidad automática. 

Este sistema totalmente automatizado convierte ClickDeploy en una solución completamente operativa desde el punto de vista del cliente, minimizando el soporte necesario y garantizando velocidad de despliegue y eficiencia operativa. 
## <a name="_page9_x72.00_y72.00"></a>Script principal 
Este script está alojado en “/opt/clickdeploy/”, junto con los archivos de este proyecto, y su ejecución es la encargada de desplegar el contenedor correspondiente al servicio solicitado.  

Entre sus funciones destacan: 

- Lectura de parámetros (Servicio, CPU, RAM, GB) recibidos por webhook. 
- Creación del contenedor mediante Docker y Docker Compose. 
- Configuración de Nginx como proxy inverso. 
- Solicitud automática de certificado SSL con Certbot. 
- Registro del despliegue en la base de datos. 
- Envío de notificaciones o logs en caso de error. 

El diseño modular del script permite añadir nuevos servicios con facilidad, adaptando simplemente la plantilla de configuración y los valores por defecto del contenedor. 

Este script, está formado por 10 módulos: 

- Validación de argumentos 
- Asignación de variables 
- Configuración general y logs 
- Registro en base de datos 
- Preparación del entorno de despliegue 
- Generación del archivo .env 
- Personalización de docker-compose.yml 
- Despliegue con Docker Compose 
- Configuración de Nginx como proxy inverso 
- Generación del certificado SSL 

Script completo, detalles técnicos y configuraciones:  

**Anexo I - Servidor Principal** > “**Script de despliegue automatizado**” 
# <a name="_page10_x72.00_y72.00"></a>Monitorización y Control 
La monitorización es un componente clave para garantizar la disponibilidad, el rendimiento y la seguridad del sistema. ClickDeploy ha integrado una solución de monitorización basada en contenedores, de fácil despliegue y bajo consumo de recursos, optimizando el sistema. 
## <a name="_page10_x72.00_y148.09"></a>Netdata 
Se ha utilizado Netdata, un sistema de monitorización en tiempo real ligero y de fácil instalación. Entre las métricas base que proporciona destacan: 

- Uso de CPU, RAM y disco. 
- Estado de los contenedores activos. 
- Latencia de red y tráfico de entrada/salida. 
- Monitorización de servicios (Nginx, MariaDB, PHP-FPM). 

Netdata se despliega como un servicio adicional en el servidor principal y está configurado para exponer un puerto seguro accesible únicamente desde la red local. Esto impide accesos externos y evita problemas de seguridad. 

Por defecto Netdata sólo es accesible desde localhost:19999 

Personalmente, elegí esta herramienta porque me permite asociar mi cuenta, y mediante la web <https://app.netdata.cloud/>, acceder a todos mis servidores, tanto físicos como virtuales, consiguiendo así centralizar todo el proceso de monitorización. 

De cara a futuro se plantean herramientas más potentes de monitorización. Se contempla la integración futura con Zabbix o Prometheus para una supervisión más granular, así como el envío de alertas por correo en caso de errores críticos o caídas de servicios. Esto se debe a que son herramientas más conocidas y utilizadas en el sector IT, por lo que cuando se amplíe el personal, es más probable que tengan conocimientos de estas herramientas. 

Información detallada: 

**Anexo I - Servidor Principal** > “**Monitorización y Logs**” **Anexo II - Servidor Secundario** > “**Monitorización**” 
# <a name="_page11_x72.00_y72.00"></a>Base de Datos 
ClickDeploy incorpora una base de datos corporativa basada en MariaDB, diseñada para almacenar la información clave de la empresa: empleados, clientes, contratos, servicios, tickets de soporte, facturas y movimientos contables. 
## <a name="_page11_x72.00_y148.09"></a>Estructura 
La base de datos se compone de las siguientes tablas principales: 

**Cliente** 

Datos personales, información relevante y datos de contacto. 

**Empleado** 

Información del personal técnico. 

**Ticket** 

Gestión de soporte técnico. 

**Servicio** 

Contiene todos los servicios ofrecidos. 

**Contrato** 

Información de cada servicio contratado, que servicio y a que cliente pertenece. 

**Factura** 

Facturación vinculada a cada uno de los contratos de forma independiente. 

**Gasto** 

Registro de costos imprevistos, no recurrentes. 

**Contabilidad** 

Centraliza ingresos, gastos y balance general. Se registran todos los ingresos, gastos previstos y no previstos, y se registra el capital de la empresa. 

Cada tabla está normalizada y vinculada por claves foráneas, lo que permite mantener la integridad referencial y simplificar las consultas. 

Ver **Anexo IV - Base de Datos** > “**Tablas Principales**” 
## <a name="_page12_x72.00_y72.00"></a>Auditoría mediante triggers 
Para garantizar la trazabilidad de los datos, se han implementado tres tablas históricas: 

- Cliente\_hist 
- Empleado\_hist 
- Contrato\_hist 

Estas tablas registran automáticamente cualquier eliminación de datos críticos mediante triggers “BEFORE DELETE”, que insertan los registros eliminados y la fecha NOW(). 

Este sistema permite mantener un histórico completo de la evolución de la empresa y cumple con buenas prácticas en seguridad y auditoría. 

Información detallada: 

**Anexo IV - Base de Datos** > **“Tablas Históricas” Anexo IV - Base de Datos** > **“Triggers”** 
# <a name="_page12_x72.00_y317.35"></a>Seguridad 
ClickDeploy ha sido diseñado teniendo en cuenta la seguridad desde sus primeros pasos. Se han aplicado medidas en sus diferentes sistemas y capas. 
## <a name="_page12_x72.00_y398.89"></a>Seguridad del servidor 
- Configuración de firewall con UFW para limitar los puertos expuestos. 
- Acceso SSH mediante claves públicas y sin contraseña. 
- Configuración de Fail2Ban para bloquear intentos de acceso indebidos. 
- Desactivación de servicios innecesarios. 
- Actualizaciones automáticas del sistema. 
## <a name="_page12_x72.00_y545.88"></a>Seguridad en WordPress y la web 
- Forzado de HTTPS para el login y panel de administración. 
- Copias de seguridad automáticas con UpdraftPlus. 
- Gestión de roles con Ultimate Member para limitar accesos. 
- Prevención de spam y ataques de fuerza bruta. 
- Validación del webhook entrante. 
## <a name="_page13_x72.00_y72.00"></a>Seguridad en la base de datos 
- Contraseñas fuertes para el usuario de WordPress y scripts. 
- Acceso limitado a localhost. 
- Creación de usuarios con permisos mínimos. 
- Integración futura con sistemas de cifrado de datos en reposo. 
## <a name="_page13_x72.00_y186.44"></a>Buenas prácticas adicionales 
- Separación de servicios en contenedores aislados. 
- Logs centralizados para detectar anomalías. 
- Documentación técnica actualizada para mitigar errores operativos. 
- Trazabilidad en base de datos mediante triggers. 

En conjunto, estas medidas proporcionan un entorno seguro, resistente y preparado para el crecimiento. La seguridad no es un añadido, sino parte integral del diseño de ClickDeploy. 
# <a name="_page13_x72.00_y400.41"></a>La Empresa 
## <a name="_page13_x72.00_y446.86"></a>Introducción 
El plan de empresa de ClickDeploy recoge todos los aspectos clave que permiten validar la viabilidad técnica, organizativa y económica del proyecto. Se trata de un proyecto basado en un modelo de negocio SaaS (Software as a Service) que automatiza el despliegue de aplicaciones web en contenedores Docker, pensado para pequeñas y medianas empresas, autónomos, centros educativos y profesionales sin conocimientos técnicos. 
## <a name="_page13_x72.00_y558.75"></a>Propuesta de valor 
ClickDeploy ofrece un sistema completo que permite contratar e iniciar servicios como WordPress, Moodle o Nextcloud sin necesidad de configurar servidores, ni instalar software. A través de una interfaz web intuitiva y un sistema de automatización por webhooks y scripts en bash, se despliega el servicio de forma inmediata.  

Esto reduce el tiempo de puesta en marcha, aumenta la eficiencia y disminuye errores. 
## <a name="_page14_x72.00_y72.00"></a>Segmento de clientes 
El público objetivo está formado por: 

- PYMES que necesitan servicios web confiables sin tener personal técnico. 
- Freelancers o profesionales que gestionan proyectos personales o de terceros. 
- Centros educativos, pensado principalmente para las prácticas de los alumnos, pero también para aquellos que requieren plataformas LMS o sistemas colaborativos. 
## <a name="_page14_x72.00_y171.89"></a>Canales de distribución 
El canal principal es la página web corporativa, desarrollada con WordPress y WooCommerce. Los servicios pueden contratarse directamente desde esta plataforma, activando el despliegue automático mediante webhook. Además, se usarán canales de marketing digital (LinkedIn, SEO, blog técnico, etc.). 
## <a name="_page14_x72.00_y275.23"></a>Estrategia de ingresos 
El modelo de ingresos se basa en suscripciones mensuales con diferentes niveles de servicio. Se plantean precios competitivos que empiezan en 4,99 € al mes, pero varía significativamente según recursos contratados y tipo de servicio. También se prevén servicios adicionales como asistencia técnica personalizada o formación, lo que permite escalar el modelo. 
## <a name="_page14_x72.00_y393.12"></a>Recursos clave 
- Infraestructura propia basada en VPS: servidor principal y servidor TrueNAS. 
- Scripts de automatización desarrollados en Bash. 
- Plataforma web automatizada con WooCommerce y WooSubscriptions. 
- Base de datos relacional (MariaDB) para la gestión de clientes y servicios. 
## <a name="_page14_x72.00_y496.46"></a>Actividades clave 
- Desarrollo y mantenimiento de la plataforma y scripts. 
- Gestión y control de contenedores Docker. 
- Atención al cliente. 
- Seguridad y copias de respaldo. 
- Generación de contenido técnico para SEO y divulgación. 
## <a name="_page14_x72.00_y614.36"></a>Costes y financiación 
La inversión inicial es reducida gracias al uso de software libre y la gestión propia de servidores. El coste principal es el alquiler de servidores dedicados. La financiación se cubre con recursos propios y no requiere préstamos en la primera fase. La estructura de costes permite que el proyecto sea rentable a partir de 50 clientes activos mensuales. 

Ver: **Anexo V - Plan de Empresa**
# <a name="_page15_x72.00_y72.00"></a>Conclusión 
ClickDeploy demuestra que es posible crear un sistema profesional y competitivo en el sector tecnológico con recursos limitados y herramientas de software libre. A través de la integración de tecnologías como Docker, WordPress, TrueNAS y scripting, se ha construido una solución automatizada que responde a una necesidad real del mercado: desplegar servicios web de forma rápida, segura y sin intervención técnica. 

Durante el desarrollo del proyecto se han abordado todas las fases clave: análisis de la infraestructura, diseño técnico, desarrollo de scripts, configuración de contenedores, seguridad, automatización y la creación de una plataforma web operativa. Además, se ha acompañado de un plan de empresa detallado, que demuestra la viabilidad económica. 

La arquitectura modular, el sistema de automatización mediante el webhook y el enfoque SaaS convierten ClickDeploy en un proyecto realista, sostenible y preparado para crecer. Con una inversión mínima, se ha logrado una solución escalable, y con un modelo de ingresos recurrente que garantiza su mantenimiento. 

En definitiva, ClickDeploy integrar la mayoría de los conocimientos adquiridos a lo largo del ciclo Administración de Sistemas Informáticos en Red (ASIR) en un entorno práctico, técnico y con potencial comercial. 
# <a name="_page16_x72.00_y72.00"></a>Bibliografía 
**Stack Overflow** 

Funcionamiento de algunas de las tecnologías utilizadas (Nginx reverse proxy, Docker) <https://stackoverflow.com/questions> 

**Docker y Docker Compose Docs** 

Consulta de los contenedores predefinidos (WordPress, Nextcloud…) <https://docs.docker.com/> 

**TrueNAS CORE** 

Instalación y configuraciones importantes <https://www.truenas.com/> 

**Certbot - Let’s Encrypt** 

Emisión de certificados SSL gratuitos (para https) <https://certbot.eff.org/> 

**WooCommerce y módulos complementarios** 

Configuración del WebHook, pagos recurrentes, etc. <https://woocommerce.com/> <https://woocommerce.com/products/woocommerce-subscriptions/> 

**1&1 Ionos** 

Empresa de hosting, proveedor de los servidores <https://www.ionos.es/> 

**Páginas del estado** 

Consulta de ayudas, cuotas, trámites etc. <https://www.sepe.es/HomeSepe/es/autonomos.html> <https://www.seg-social.es/wps/portal/wss/internet/Inicio> <https://www.mineco.gob.es/> 

<https://www.sepe.es/> 

**Páginas de la competencia <https://raiolanetworks.com/>** <https://www.ovhcloud.com/es-es/> <https://dinahosting.com/> 

**ChatGPT** 

Conversación interactiva con propuestas de mejora. Consultas generales. <https://openai.com/es-ES/index/chatgpt/> 

**DeepSeek** 

Ayuda y mejora del scripting y automatización. <https://www.deepseek.com/> 
# <a name="_page17_x72.00_y72.00"></a>Anexos 
**Anexo I - Servidor Principal** 

Descripción técnica completa del nodo de cómputo, instalación de servicios, scripts y configuración del entorno Docker. Incluye el script “script.bash” y las plantillas de docker. 

**Anexo II - Servidor Secundario** 

Instalación, configuración, conexión iSCSI y funciones de backup. Describe la integración de almacenamiento con el servidor principal y snapshots automáticos. 

**Anexo III - Página Web** 

Documentación completa sobre el desarrollo de la web basada en WordPress, el diseño responsive y la integración del sistema de webhook que ejecuta los scripts automáticamente al contratar un servicio. 

**Anexo IV - Base de Datos** 

Diseño lógico y físico de la base de datos MariaDB, incluyendo todas las tablas, relaciones, triggers y tablas históricas. Se detalla el mecanismo de trazabilidad de los datos. 

**Anexo V - Plan de Empresa** 

Documento que recoge el estudio comercial, económico y financiero del proyecto. Incluye análisis, estrategia de marketing, escenarios de crecimiento, estructura de costes y plan de financiación. 

Cada anexo complementa y desarrolla todos los aspectos técnicos y empresariales del documento principal, y permite consultar con más detalle cada tecnología utilizada. 