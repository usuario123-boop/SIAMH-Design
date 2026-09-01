# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Antes de cualquier cosa: leer AVANCES.md

`AVANCES.md` es la bitácora viva del proyecto y la fuente de verdad sobre el estado del trabajo:
qué está hecho (§4), qué falta y en qué prioridad (§5), y la tabla de correcciones que el usuario ha
solicitado (§6). **Léelo antes de proponer o modificar algo.**

Cuando el usuario pida una corrección o señale un error, además de aplicarlo hay que **registrarlo en
la tabla de la §6 de `AVANCES.md`** con fecha, pantalla afectada, qué se pidió y en qué estado quedó;
y cuando se termine una pantalla pendiente, moverla de §5 a §4.

## Qué es este repositorio

Prototipo de interfaz (solo HTML/CSS/JS estático) del **SIMH — Sistema Integral de Movilidad Humana**,
para la Secretaría de la Frontera Sur del Gobierno de Chiapas. No hay backend, build, gestor de
paquetes ni pruebas: cada página se abre directamente con `file://` y todos los datos están escritos
a mano dentro de la propia página.

Los requisitos vienen de tres PDF en la raíz:

- `Primera direcccion.pdf` — SRS v3.0. **Es el que manda**: RF01–RF15 y RNF01–RNF06.
- `segunda direccion.pdf` — SIAMH-Chiapas, documento maestro de otra dirección. Solo referencia de
  campos y entidades, no de navegación.
- `manual-identidad-humanismo.pdf` — identidad visual obligatoria (RNF05).

La Dirección entrega correcciones dejando documentos en esta carpeta.
`DOCUMENTO DE MEJORAS DE SIAMH.docx` (28/08/2026) es el último; está aplicado por completo y su
lectura razonada está en `AVANCES.md` §4.20. Un `.docx` se lee sin dependencias descomprimiéndolo:
`word/document.xml`, sustituyendo `</w:p>` por saltos de línea y quitando las etiquetas.

## Comandos

No hay build ni tests. Las dos verificaciones que sí existen y **son obligatorias** antes de dar por
terminada una pantalla:

```bash
# 1. Renderizar y MIRAR el resultado (los bugs de layout no se ven leyendo el código)
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu \
  --window-size=1440,1300 --screenshot="<ruta-absoluta-windows>\shot.png" --virtual-time-budget=5000 \
  "file:///C:/Users/almen/Downloads/prototipo/index.html"

# 2. Verificar la sintaxis del <script> embebido de una página
python -c "
import re
s=open('registro.html',encoding='utf-8').read()
m=re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>',s,re.S)
open('_c.js','w',encoding='utf-8').write('\n'.join(m))
" && node --check _c.js && rm -f _c.js
```

Para cualquier color nuevo de gráfica, usar el validador del skill `dataviz` en vez de decidir a ojo:

```bash
node scripts/validate_palette.js "#hex,#hex,#hex" --mode light [--ordinal]
```

Atajos de revisión implementados en las páginas: `registro.html?paso=3` (y `?paso=exito`),
`expediente-detalle.html?tab=bitacora`, `familiar.html?g=1`, `salud.html?exp=0412`,
`capacitacion.html?g=021` (y `?lista=1`, `?g=021&cand=0455`, `?g=003`),
`empleabilidad.html?e=0412` (y `?e=0412&ver=30`, `?e=0435&nueva=1`, `?e=0447`, `?e=0464`, `?e=0658`,
`?tab=seg|vinc|ficha`), `censo.html?vista=registros` (y `?red=1`, `?vista=exito`),
`administracion.html?tab=bitacora` (y `?u=u4`, `?u=u3`, `?u=u7`),
`canalizaciones.html?o=BOR-0034` (y `?o=0942`, `?o=0938`, `?o=0943`, `?o=0944`, `?nuevo=1`,
`?nuevo=modificacion`, `?nuevo=educacion&caso=r2`), `revalidacion.html?r=r1` (y `?r=r2`),
`documentacion.html?d=0410`, `constancias.html?c=0410` (y `?c=0203`, `?sop=carta`),
`index.html?mun=Suchiate`.

## Arquitectura

**El menú lateral se contrae a un riel de iconos.** El botón de menú de la barra superior hace dos
cosas según el ancho: por encima de 900 px contrae el lateral a un riel de 66 px (clase `menu-riel`
en `<html>`, que redefine `--sidebar-w`; la preferencia se guarda en `localStorage`), y por debajo
abre el cajón sobre el contenido. **Contraer es redefinir el token**, así que una pantalla nueva no
tiene que hacer nada para funcionar en riel — pero sí conviene renderizarla en los dos estados. En el
riel el rótulo de cada entrada sigue en el DOM para el lector de pantalla y se muestra como etiqueta
flotante **al pasar el ratón y al enfocar con el teclado**: si solo respondiera al hover, el riel
sería navegable con ratón y no con teclado.

**Todo el chrome institucional se inyecta desde JS.** Cada página es un HTML autónomo que carga
`assets/css/simh.css` + `assets/js/simh.js` y arranca con un IIFE que llama
`SIMH.chrome("<id-del-menú>")`. Esa función inserta la barra superior y el menú lateral al inicio del
`<body>`, así que **el HTML de la página solo contiene `<main class="contenido">`**. El array `MENU`
dentro de `simh.js` es la única fuente de la navegación: agregar una pantalla implica agregar su
entrada ahí.

**`assets/js/simh.js` expone un único global `SIMH`** con: `chrome()`, `icono(nombre)` (SVG inline,
catálogo `ICO`), `isotipo()`, formateo (`n`, `pct`, `esc`), y las gráficas
(`columnas`, `sparkline`, `barrasH`, `apilada`, `mapaBurbujas`, `tablaDatos`) más `grafica(caja, opts)`,
que arma encabezado + gráfica + tabla gemela con su alternador "Ver tabla".

**`assets/css/simh.css` es el sistema de diseño v2** y define los tokens, el layout fijo
(`--topbar-h`, `--sidebar-w`) y todos los componentes reutilizables: `.tarjeta`, `.filtros`, `.hero`,
`.kpi`, `.btn`, `.campo`, `.chip`, `.tabla`, `.aviso`, `.pasos`, `.pestanas`, `.timeline`,
`.resumen-grupo`, `.exp-cab`, `.ruta`, `.compositor`, `.filtros-fila` (§20, la fila de filtros con
rótulo y controles de 40 px, que sustituye a `.filtros`), `.accion` (§21, la barra de acción única) y
`.oficio-hoja` (§22, la hoja membretada de un oficio). Reutilizar estas clases antes de escribir CSS
nuevo; lo específico de una pantalla va en su `<style>` embebido.

**Cuando un componente local va a tener un segundo consumidor, sube a `simh.css`** en lugar de
copiarse: la pantalla de origen queda con un comentario que apunta a la sección, y hay que volver a
renderizar esa pantalla para comprobar que no cambió nada. Así subieron las secciones 20–23.

**`assets/js/simh-datos.js` guarda lo que comparten los cuatro módulos de documentos**
(`canalizaciones`, `revalidacion`, `documentacion`, `constancias`): el reloj del prototipo, los
permisos de quien opera, el catálogo de personas y los casos de revalidación, que Canalizaciones lee
para citar la negativa que reclama un oficio. Es la única excepción a «cada página lleva sus datos
dentro», y es deliberada: cuatro copias del mismo catálogo son cuatro sitios donde una edad, una
CURP o un folio pueden dejar de coincidir. **Los datos de una sola pantalla se quedan en ella.**

**Una pestaña no es un módulo.** Si algo se puede conceder o negar en la matriz de permisos, si
tiene su propio trabajo y su propia gente, es un módulo con su entrada en `MENU` y su archivo. Las
pestañas son para separar lo diario de lo consultivo *dentro* de un mismo trabajo, como en el
detalle de Empleabilidad.

Las pantallas con estado (registro, familiar, expediente-detalle) mantienen su estado en variables
del IIFE y **repintan por completo** el bloque afectado con `innerHTML`; no hay framework ni binding.

## Reglas de diseño no negociables

Estas se dedujeron corrigiendo el prototipo y están documentadas en `AVANCES.md` §4.1–4.2:

- **Color de datos:** una sola rampa jade para magnitud (`#5BBFB3 #17A395 #008A7B #005249`). La serie
  categórica va en orden fijo **guinda → jade → rosa** y **guinda y rosa nunca contiguos**: ese par
  falla la separación en visión normal (ΔE 9.6). El guinda queda reservado para estado crítico, nunca
  como serie. El arena `#D3C2B4` no sirve como color de dato (lee gris, no alcanza contraste).
- **Una sola cifra héroe por pantalla** (48 px). Las cifras grandes van en la tipografía de texto
  (nunca en la display) y con figuras proporcionales; `tabular-nums` solo en columnas de tabla.
- **El color de marca vive en el chrome**, no en el contenido: los títulos de tarjeta son gris, no
  guinda. Superficies planas, sin sombras.
- **Un `span` con `width`/`height` no funciona**: es inline. Este bug ya apareció cuatro veces
  (rellenos de barra, bolitas de ruta, folio de tabla). Poner `display:block`.
- **Una tabla ancha desborda y corta la última columna.** Ya pasó tres veces (listado de expedientes,
  participantes de capacitación, historial laboral). La cura es `table-layout:fixed` con `<colgroup>`
  de anchos declarados, `word-break:break-word` en las celdas y `white-space:normal` en los `th`.
  Cuidado con `.btn`, que trae `white-space:nowrap`: dentro de una celda estrecha vuelve a desbordar.
- **Antes de nombrar una clase local, verificar que no exista en `simh.css`.** Una clase `.opc` local
  pisó la `.opc` del sistema (el "(opcional)" de las etiquetas) y la convirtió en una caja con borde.
- Los SVG de `icono()` traen `width`/`height` por defecto de 18 px; para un icono ilustrativo grande,
  sobrescribirlos por CSS.
- Toda gráfica lleva su tabla gemela; los filtros van en **una sola fila por encima** de todo lo que
  filtran.
- **Un dato se dice una sola vez por pantalla.** El mismo vencimiento enunciado en el aviso, en el pie
  de la cifra héroe y en la fila del hito —con dos botones idénticos— fue lo que volvió confusa a
  Empleabilidad. Si hay algo pendiente, hay **una sola barra de acción** que dice qué pasa, por qué
  importa y con qué botón se resuelve; el resto de los bloques lo complementan, no lo repiten.
- **Una pantalla de trabajo no muestra las tres tareas a la vez.** Cuando el detalle de una persona
  pasa de ~1 200 px, separar en `.pestanas` lo diario de lo consultivo, dejando cabecera y barra de
  acción fuera de las pestañas. Reutilizar ese componente, no inventar otro.
- **El estado nunca viaja solo en el color, ni siquiera en un marcador pequeño.** Un punto de color
  necesita glifo y palabra al lado (`✓ 15 d: cumplida`), o no se lee impreso ni con lector de
  pantalla. El texto no baja de 12.5 px y los controles miden 44 px de alto (36 px los chips).
- **Antes de dar por bueno un gris, calcular su contraste.** `--gris-claro` estuvo en `#8C8C8C` en
  nueve pantallas: 2.87:1 sobre el hueso de la página, muy por debajo del 4.5:1 que exige el manual.
  Hoy es `#6A6A6A`. `--gris-claro` es para texto secundario legible, no para texto tenue.
- **El texto normativo se pliega.** Las reglas de RF/RNF son ciertas y permanentes, pero no se
  necesitan en cada visita: van en un `details.plegable` o recortadas a su frase operativa, nunca como
  párrafos fijos en gris pequeño al pie de cada tarjeta.
- **Un botón desactivado con su explicación no es una solución.** Ocupa el lugar de la acción sin
  poder hacerla, igual que un chip que dice "Vencido". Si la acción no procede, no se dibuja el botón:
  se enuncia la regla y qué la desbloquea.
- **Los rótulos que llevan una cifra dicen la cifra que de verdad va a ocurrir.** "Enviar 4 registros"
  cuando solo se envían 3 es una mentira de interfaz: lo pendiente y lo enviable no son el mismo
  conjunto y hay que contarlos por separado. Ningún número de la pantalla se escribe a mano: se deriva
  de los datos.

## Reglas del dominio que el diseño debe respetar

- **Nada se elimina.** Los expedientes solo pasan a *Cerrado* o *Concluido por deceso* (RNF03). En la
  interfaz nunca se escribe "Eliminar" — **tampoco como nombre de un permiso**: la matriz de
  `administracion.html` usa *Ver · Crear · Editar · Cerrar · Exportar*, porque nombrar un permiso de
  eliminar legitima una acción que el sistema no tiene. Una cuenta de usuario tampoco se elimina: se
  suspende, con motivo y oficio, y conserva su rastro en la bitácora.
- **Los permisos son del rol, no de la persona.** Una rejilla de casillas por usuario es
  inadministrable y sugiere que cada quien puede tener su combinación. Lo que se concede a alguien en
  particular es una **excepción con oficio, motivo y fecha de término**, que al vencer revierte sola.
- **Sin códigos QR** en ninguna pantalla ni documento impreso (restricción explícita del proyecto).
  Quitar el QR obliga a poner otra vía: la verificación es **por folio y sello en ventanilla**, y el
  documento impreso lo dice.
- **El folio de un oficio se asigna al firmar, no al abrir el borrador.** La serie es consecutiva: un
  folio reservado para un borrador que se abandona deja un hueco, que es lo primero que busca una
  auditoría. Antes de la firma solo hay una **referencia interna** (`BOR-####`), y la hoja lleva un
  sello de estado para que un borrador no se vea igual que un oficio firmado. Un oficio equivocado no
  se borra: se **cancela** y lo sustituye otro, conservando el folio consumido (RNF03).
- **La firma es un acto del Director de Área, no una casilla de la matriz de permisos.** El perfil de
  Capturista Municipal redacta y manda a firma; no firma ni exporta. Los permisos de cualquier
  pantalla nueva se **leen de la matriz de `administracion.html`**, no se inventan.
- **Una constancia de registro no es un documento migratorio y tiene que decirlo impreso**, o se va a
  usar como si lo fuera. Cada emisión o reimpresión lleva motivo de catálogo y queda en el historial
  con folio propio: una constancia reimpresa sin motivo no se distingue de una falsificada. Un
  expediente cerrado no ampara una constancia vigente.
- **El historial de contacto no se sobrescribe**: los teléfonos anteriores se conservan tachados con
  su vigencia (RF03).
- **NNA clasificado como *Separado* o *No acompañado* obliga a oficio automático** a la Procuraduría
  Regional en 24 horas (RF06). Si un grupo familiar se queda sin persona adulta, sus NNA pasan a
  *No acompañados*.
- **RFC y NSS son opcionales** al inicio; el sector patronal los tramita después. Si la Secretaría
  está acompañando ese trámite o el de la tarjeta migratoria, **la marca de acompañamiento va en la
  cabecera de la persona**, no dentro de una pestaña: si no se ve, en la ventanilla se vuelve a pedir
  el papel que la propia Secretaría está gestionando.
- **La educación básica no se revalida: se inscribe.** Una niña o un niño se matricula aunque no
  traiga documentos y la escuela regulariza el expediente después (Acuerdo 286 de la SEP). Por eso el
  módulo de revalidación no le pide requisitos a la básica: registra la **negativa de atención**, que
  es el hecho que sí existe. Y una negativa sin fecha, institución, motivo de catálogo y qué se hizo
  no es reclamable: para la autoridad no ocurrió.
- **Una fecha puede ser aproximada, y entonces la edad es un intervalo.** El alta captura la
  precisión (día, mes y año, solo el año, o edad declarada). **Cuando el intervalo cruza los 18 rige
  la presunción de minoría de edad**: se clasifica como NNA hasta que un documento diga otra cosa,
  porque equivocarse hacia arriba deja a una persona menor sin su ruta de protección.
- **El parentesco de un grupo familiar es solo directo**: línea recta, hermanos y cónyuge. Todo lo
  demás es **persona acompañante**, y esa es la regla que decide si un NNA queda acompañado o
  separado — quien viaja con su tía no viaja con quien ejerce la patria potestad.
- **La serie de folios del SIMH convive con la del municipio.** El folio del SIMH es consecutivo y se
  asigna al firmar; el **folio de la dependencia** es el número que el oficio lleva en el libro de la
  ventanilla y se captura aparte. El registro guarda los dos.
- **La cuenta de acceso no es un correo**, es una cuenta institucional `nombre.apellido`: un correo
  cambia de titular, se comparte y sobrevive a la adscripción.
- **Un faltante que no impide nada no es un pendiente.** En documentación y en requisitos, cada
  documento declara qué bloquea, y los recuentos y titulares cuentan solo los que **detienen** algo:
  encabezar con el faltante más frecuente cuando ese no impide nada manda a la ventanilla a
  perseguir el papel equivocado.
- **Un marcador de vulnerabilidad no es informativo: activa una ruta con plazo.** En la interfaz cada
  marcador declara su consecuencia junto a la casilla, y el nivel de atención lo decide el marcador con
  plazo legal, no el número de marcadores.
- **Aislamiento estricto entre direcciones** (RNF01): Salud no lee Empleo. Se muestra que el módulo
  existe (con candado), no su contenido.
- **El capturista municipal no edita ni cierra expedientes** (RNF02): requiere oficio y autorización
  del Director de Área. Los permisos se muestran explícitamente, no se ocultan.
- Meta de captura: **menos de 5 minutos por persona** (RNF04); por eso el alta prioriza teclado,
  campos obligatorios mínimos y encadenamiento de registros.

## Pendientes conocidos

`AVANCES.md` §5 tiene la lista priorizada. **Ya no falta ninguna pantalla**: las catorce del guion
están construidas y todas las entradas del menú resuelven. RF10 y RF11 se reparten entre los cuatro
módulos de documentos: `canalizaciones.html`, `revalidacion.html`, `documentacion.html` y
`constancias.html`.

Lo que sigue son pasadas de revisión: `expedientes.html` y `expediente-detalle.html` son anteriores a
la revisión de accesibilidad de §4.15 y no tienen el piso de 12.5 px, el área táctil de 44 px ni el
estado con glifo + palabra. Y el **filtro por municipio** ya existe en el Panel y en Capacitación
pero todavía no en las carteras de Expedientes, Salud y Empleabilidad.

**Los datos ficticios se cruzan entre pantallas** (folios, CURP, nombres, oficios). Antes de inventar
uno nuevo hay que buscarlo: dos documentos con el mismo folio o dos edades distintas para la misma
persona es el tipo de error que se nota justo en la demostración.

`censo.html` (RF15) es **la única pantalla móvil**: se compone dentro de un marco de teléfono de
390 × 844 con un panel de revisión al lado, y por debajo de 900 px el marco desaparece y la interfaz
ocupa toda la ventana. Si se toca el chrome, conviene revisarla en angosto: es la que paga los
errores de responsive.

Dependencias externas que no dependen del código: isotipo y logos oficiales (el actual es una
reconstrucción geométrica en `SIMH.isotipo()`), tipografías con licencia Novecento Wide y Gilroy
(hay un `@font-face` comentado en el CSS; el prototipo usa Montserrat y Poppins), nombre oficial
definitivo del sistema y GeoJSON municipal si se requiere un mapa preciso.
