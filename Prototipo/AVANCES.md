# SIMH · Prototipo de diseño — Bitácora de avances

**Proyecto:** Sistema Integral de Movilidad Humana (SIMH)
**Cliente/área:** Secretaría de la Frontera Sur · Gobierno de Chiapas 2024–2030
**Alcance actual:** prototipo de interfaz (HTML) de la **primera dirección**
**Última actualización:** 27 de agosto de 2026 · versión de diseño **v2**

---

## 1. Contexto: por qué hay dos documentos

| Documento | Origen | Qué define | ¿Manda en este prototipo? |
|---|---|---|---|
| `Primera direcccion.pdf` | Secretaría de la Frontera Sur — SRS v3.0 | RF01–RF15 y RNF01–RNF06. **RF14: la pantalla de inicio es el tablero de gráficas estadísticas.** | **Sí.** Es lo que se está prototipando. |
| `segunda direccion.pdf` | Dirección de Capacitación y Empleo — SIAMH-Chiapas v3.0 | Documento maestro: núcleo de persona, movilidad humana, expediente familiar y profesional, modelo de datos y ER. | No para el diseño, **sí como referencia** de campos y entidades. |
| `manual-identidad-humanismo.pdf` | Gobierno de Chiapas | Identidad visual obligatoria (RNF05). | **Sí.** Rige todo el diseño. |

---

## 2. Estado del entorno de trabajo

- **MCP de Stitch:** configurado en el proyecto, estado `✔ Connected`. Sus herramientas solo se
  cargan al iniciar la sesión de Claude Code: hay que cerrar y reabrir para poder usarlas.
- **Verificación visual obligatoria:** ninguna pantalla se da por terminada sin renderizarla.

  ```
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu \
    --window-size=1440,1300 --screenshot="<ruta>\shot.png" --virtual-time-budget=5000 \
    "file:///C:/Users/almen/Downloads/prototipo/index.html"
  ```

- **Validación de paleta de datos:** se usa el validador del skill `dataviz`
  (`node scripts/validate_palette.js "<hex,…>" --mode light [--ordinal]`). El color de las gráficas
  no se decide a ojo.
- **Atajos de revisión:** `registro.html?paso=3` abre ese paso y `registro.html?paso=exito` la pantalla
  de cierre; `expediente-detalle.html?tab=bitacora` abre esa pestaña del expediente y `familiar.html?g=1`
  abre el grupo con oficio pendiente; `salud.html?exp=0412` abre en el módulo de Salud el expediente con
  condiciones y canalizaciones ya cargadas (sin el parámetro abre el caso más urgente de la cartera).
  En Capacitación: `capacitacion.html?g=021` abre el grupo con la proporción incumplida,
  `?lista=1` el pase de lista, `?g=021&cand=0455` la predicción de un alta que rompe la proporción y
  `?g=003` un grupo ya concluido.
  En Empleabilidad: `empleabilidad.html?e=0412` abre el caso con la verificación de 30 días vencida,
  `?e=0412&ver=30` abre el panel de esa verificación, `?e=0435&nueva=1` el alta de vinculación de una
  persona sin documento que autorice trabajar, `?e=0447` la entrevista sin resultado capturado,
  `?e=0464` la contratación sin fecha de inicio de labores y `?e=0658` un historial con dos
  vinculaciones, una concluida con motivo. `?tab=seg|vinc|ficha` abre esa pestaña del detalle
  y se combina con `?e=` (por ejemplo `?e=0658&tab=vinc`).
  En Censo: `censo.html?vista=registros` abre lo guardado en el dispositivo, `?red=1` el estado
  con conexión (combinable: `?vista=registros&red=1`) y `?vista=exito` el acuse de guardado.
  En Administración: `administracion.html?tab=bitacora` abre la bitácora, `?u=u4` la matriz
  de una capturista con excepción vigente, `?u=u3` el aislamiento entre direcciones y `?u=u7`
  una cuenta suspendida.
  En Canalizaciones: `canalizaciones.html?o=BOR-0034` abre el oficio a la Procuraduría que vence
  hoy, `?o=0942` uno emitido con el acuse vencido, `?o=0938` uno cancelado y sustituido, `?o=0943`
  uno ya acusado y `?o=0944` el de educación; `?nuevo=1` abre la redacción de una canalización
  nueva y `?nuevo=modificacion` o `?nuevo=educacion` con esa plantilla ya elegida
  (`?nuevo=canaliza` muestra por qué esa no se redacta aquí). `?nuevo=educacion&caso=r2` es lo que
  produce el botón «Reclamar por oficio» de Revalidación.
  En Revalidación de Estudios: `revalidacion.html?r=r2` abre el caso con negativa sin reclamar y
  `?r=r1` el de educación básica, que es donde el requisito no existe.
  En Documentación e Identidad: `documentacion.html?d=0410` abre el expediente con más faltantes.
  En Constancias: `constancias.html?c=0410` la de una persona menor de edad sin fotografía y sin
  constancia previa, `?c=0203` un expediente cerrado que no ampara constancia, y `?sop=carta`
  cambia el soporte a hoja carta.
  En el Panel: `index.html?mun=Suchiate` abre el panel de ese municipio (también `?mun=Tapachula`,
  `?mun=Tuxtla`, etc.).

---

## 3. Estructura de archivos

```
prototipo/
├─ CLAUDE.md                           ← instrucciones para Claude Code (arquitectura y reglas)
├─ AVANCES.md                          ← este archivo
├─ PROMPT-STITCH-primera-direccion.txt ← prompt de diseño para Google Stitch (14 pantallas)
├─ DOCUMENTO DE MEJORAS DE SIAMH.docx  ← lista de mejoras y dudas de la Dirección (28/08/2026)
├─ index.html                          ← Panel Estadístico (RF14)
├─ login.html                          ← Inicio de sesión
├─ registro.html                       ← Alta de expediente (asistente funcional de 6 pasos)
├─ expedientes.html                    ← Búsqueda y listado (v2)
├─ expediente-detalle.html             ← Detalle del expediente con pestañas y bitácora
├─ familiar.html                       ← Expediente familiar y NNA (maestro-detalle)
├─ salud.html                          ← Salud y Vulnerabilidad (cartera + valoración + canalización)
├─ capacitacion.html                   ← Capacitación · Grupos ICATECH (cartera + conformación + pase de lista)
├─ empleabilidad.html                  ← Empleabilidad (cartera por vencimiento + hitos 15/30 + historial laboral)
├─ censo.html                          ← Censo Empresarial offline (vista móvil: captura en campo + sincronización)
├─ administracion.html                 ← Administración (usuarios, matriz de permisos por rol y bitácora)
├─ canalizaciones.html                 ← Canalizaciones (registro, firma y acuse de oficios)
├─ revalidacion.html                   ← Revalidación de Estudios (requisitos y negativas de atención)
├─ documentacion.html                  ← Documentación e Identidad (matriz de faltantes)
├─ constancias.html                    ← Constancias de registro (imprimible, sin QR)
├─ assets/
│  ├─ css/simh.css                     ← sistema de diseño v2
│  ├─ js/simh.js                       ← chrome, isotipo, gráficas y componentes
│  ├─ js/simh-datos.js                 ← reloj, permisos y catálogo de personas de los 4 módulos de documentos
│  ├─ img/                             ← identidad entregada por el usuario, ya optimizada
│  │  ├─ simh-lockup.png               ← lockup completo (760×300) para fondo claro
│  │  ├─ simh-isotipo.png              ← isotipo (419×460) para fondo oscuro
│  │  └─ simh-isotipo-96.png           ← favicon de todas las pantallas
│  ├─ video/
│  │  ├─ login-fondo.mp4               ← fondo del login, bucle de 12 s (333 KB)
│  │  └─ login-fondo.jpg               ← poster / respaldo del video
│  └─ fonts/                           ← (vacía) Novecento Wide y Gilroy con licencia
├─ solo-icon.png                       ← original del usuario (fuente, no se sirve)
├─ nombre-completo-mas-icono.png       ← original del usuario (fuente, no se sirve)
└─ (los tres PDF de origen)
```

---

## 4. Avances

### 4.1 Sistema de diseño v2

Reglas que rigen la versión actual, adoptadas tras la revisión de saturación:

- **El color de marca vive en el chrome** (barra superior, firma, títulos de pantalla). Los datos
  usan una sola rampa jade; el guinda queda **reservado para estado crítico** y no se usa como serie.
- **Una sola cifra héroe por pantalla** (48 px). El resto de indicadores son compactos (26 px).
- **Las cifras grandes van en la tipografía de texto**, nunca en la display, y con figuras
  proporcionales; `tabular-nums` solo en columnas de tabla.
- **Superficies planas:** sin sombras; separación por borde de 1 px y espacio en blanco.
- **Títulos de tarjeta en gris**, 11.5 px, no en color institucional.
- Escala base bajada de 15 px a 14 px; `h1` de 28 px a 19 px; barra superior de 72 px a 64 px.

### 4.2 Paleta de datos (calculada, no elegida a ojo)

| Uso | Valores | Verificación |
|---|---|---|
| Rampa ordinal (magnitud, estatus migratorio) | `#5BBFB3 · #17A395 · #008A7B · #005249` | Pasa: L monótona, salto ≥ 0.06, extremo claro 2.14:1, matiz 3° |
| Serie categórica (género) | `#AE192D → #009887 → #C90166` en ese orden | Pasa: piso de visión normal ΔE 31.2, contraste ≥ 3:1 |

**Hallazgo importante:** la paleta anterior (jade + guinda + rosa en cualquier orden) **falla**: el par
guinda↔rosa tiene ΔE 9.6 en visión normal, por debajo del piso de 15, y el arena `#D3C2B4` lee como
gris y no alcanza contraste. Por eso el orden de la serie categórica es obligatorio: **guinda y rosa
nunca van contiguos**, y el par jade↔rosa (ΔE 6.4 en deuteranopía) siempre lleva separador de 2 px y
etiqueta directa.

### 4.3 Pantallas terminadas

| Archivo | Pantalla | Requisitos |
|---|---|---|
| `login.html` | **Inicio de sesión v2**: video de fondo, identidad real del usuario, validación y cierre de sesión | RNF05 |
| `index.html` | **Panel Estadístico** v2 | **RF14**, RNF01 |
| `registro.html` | **Alta de expediente, asistente navegable de 6 pasos** | RF01–RF06, RF08, RF09 |
| `expedientes.html` | Búsqueda, filtros progresivos y listado v2 | RF09, RNF03 |
| `expediente-detalle.html` | **Detalle del expediente**: identidad, 7 pestañas, bitácora con compositor, contacto histórico y permisos visibles | RF03, RF08, RF05–RF07, RNF01, RNF02 |
| `familiar.html` | **Expediente familiar y NNA**: maestro-detalle de grupos, reasignación de titular, oficio automático a la Procuraduría | **RF05, RF06**, RNF02 |
| `salud.html` | **Salud y Vulnerabilidad**: cartera de valoración, marcadores de vulnerabilidad con su ruta, catálogo OMS y canalización con oficio | **RF07**, RF11, RNF01, RNF03 |
| `capacitacion.html` | **Capacitación · Grupos ICATECH**: cartera de grupos por urgencia, cupo y proporción con margen, requisitos de acreditación, pase de lista y baja con motivo | **RF13**, RNF02, RNF03 |
| `empleabilidad.html` | **Empleabilidad**: cartera ordenada por vencimiento, hitos de verificación de 15 y 30 días como registro, requisitos para formalizar la contratación e historial laboral completo | **RF12**, RNF01, RNF02, RNF03 |
| `censo.html` | **Censo Empresarial offline** (vista móvil): captura en campo por secciones, guardado incompleto, estado de conexión y sincronización diferida | **RF15**, RNF03 |
| `administracion.html` | **Administración**: cuentas, matriz de permisos **del rol** con excepciones documentadas, y bitácora que registra también los intentos denegados | **RNF01, RNF02**, RNF03 |
| `canalizaciones.html` | **Canalizaciones**: registro de la serie consecutiva con firma, acuse y cancelación, y redacción por plantilla con vista previa en vivo | **RF11**, RNF01, RNF02, RNF03 |
| `revalidacion.html` | **Revalidación de Estudios**: requisitos por nivel con lo que bloquea cada uno, y registro de las negativas de atención que se reclaman por oficio | RF11, RNF02 |
| `documentacion.html` | **Documentación e Identidad**: matriz de expedientes por documento, separando lo que detiene un trámite de lo que no | RF01, RF12 |
| `constancias.html` | **Constancias**: constancia de registro imprimible a tamaño real en gafete u hoja carta, sin QR, con historial de emisiones | **RF10**, RNF03 |

### 4.4 Qué cambió en el Panel Estadístico (v2)

- Seis tarjetas KPI del mismo peso → **una cifra héroe** (personas registradas, con su tendencia en
  sparkline) **más seis indicadores compactos**. Cuatro a seis indicadores es lo que la investigación
  de dashboards señala como límite antes de que el usuario deje de leerlos.
- **Dona de género eliminada.** Comparaba 49.8% contra 48.0%: una dona es incapaz de mostrar esa
  diferencia. Se sustituyó por una barra apilada de parte-a-todo con porcentajes directos.
- **Estatus migratorio** pasó de cuatro colores arbitrarios a la **rampa ordinal de una sola tinta**,
  ordenada de menor a mayor grado de regularización, que es el orden real de la variable.
- Filtros consolidados en **una sola fila por encima de todo lo que filtran**.
- Cada gráfica tiene su **tabla gemela** ("Ver tabla"), de modo que ningún valor depende del color.
- Barras con tope de 24 px, extremo redondeado de 4 px, rejilla de 1 px sólida y **etiqueta directa
  solo en el máximo y el último dato**, no en todos.
- La lista de pendientes dejó de usar mosaicos de color y ahora es una lista con punto de estado.

### 4.5 Análisis del flujo de alta de persona

Se revisó el flujo original de 5 pasos (datos generales → foto → movilidad → contacto →
consentimiento) contra el SRS y contra buenas prácticas de formularios por pasos. **Huecos
detectados y cómo se resolvieron:**

| # | Hueco detectado | Resolución en v2 |
|---|---|---|
| 1 | No había verificación de duplicados antes de crear el expediente, pese a que la conciliación de bases históricas existe en los requerimientos. | **Nuevo paso 1 “Identificación y verificación”**: busca por CURP, nombre y fecha de nacimiento contra el expediente único y la base histórica antes de permitir el alta. |
| 2 | El paso 1 tenía 14 campos; la práctica recomendada es 5–9 por paso. | Cinco campos obligatorios visibles y el resto dentro de **“Datos complementarios”** plegable. |
| 3 | No existía la ramificación de NNA (RF06) durante el alta. | La fecha de nacimiento **calcula la edad y despliega automáticamente** el bloque de clasificación NNA cuando la persona es menor, con aviso de oficio automático a la Procuraduría si es *Separado* o *No acompañado*. |
| 4 | El expediente familiar (RF05) no se podía iniciar desde el alta, aunque en ventanilla la familia llega junta. | Bloque de **grupo familiar** en el paso 5: sin acompañantes / crear grupo como titular / vincular a folio existente. |
| 5 | No había paso de revisión antes de guardar. | **Paso 6 “Revisión y consentimiento”**: resumen agrupado de todo lo capturado, con botón *Corregir* por bloque que regresa al paso correspondiente sin perder datos. |
| 6 | Al guardar no pasaba nada: no había cierre ni siguientes acciones. | **Pantalla de éxito** con folio definitivo, tiempo de captura y acciones siguientes (ver 4.7). |
| 7 | La vulnerabilidad (RF07) solo existía en un módulo aparte, así que en ventanilla se perdía la señal. | **Marcadores rápidos de vulnerabilidad** en el paso 5, que generan la tarea de valoración en el módulo de Salud. |
| 8 | El aviso de privacidad aparecía hasta el final, sin anticipación. | Se **informa en el paso 1** y se **acepta explícitamente en el paso 6**, antes de guardar (cumple RF04 y mejora la práctica). |
| 9 | Faltaba el campo de bitácora u observaciones solicitado por la Dirección: el alta no permitía documentar nada de lo ocurrido en ventanilla (RF08). | Bloque **“Observaciones de la ventanilla”** en el paso 6, con tipo de nota, límite de 500 caracteres y contador. Se guarda como **primera nota de la bitácora del expediente**, con autor, área y fecha; la pantalla de cierre confirma que quedó registrada. |

**Además, para sostener la meta de menos de 5 minutos por persona (RNF04):** validación por paso con
resumen de errores y foco automático en el primer campo faltante, `Enter` avanza al siguiente paso,
indicador de borrador guardado, cronómetro visible de la captura, y navegación libre hacia atrás por
los pasos ya completados.

### 4.7 Cierre del alta y encadenamiento de registros

En ventanilla la persona capturista atiende una fila: al guardar un expediente, lo más probable es
que deba capturar de inmediato a la siguiente persona. Por eso el cierre del alta no termina el
flujo, lo encadena:

- **Acción primaria “Registrar otra persona”**: limpia por completo la identidad, la fotografía, los
  documentos, la ruta migratoria y el consentimiento, reinicia el cronómetro y regresa al paso 1
  (verificación de duplicados), con el foco puesto en el primer campo.
- **Acción secundaria “Registrar acompañante”**: conserva los datos de movilidad y residencia del
  caso anterior, vincula automáticamente a la persona al mismo grupo familiar y arranca en el paso 2,
  porque así llegan las familias a la ventanilla. Un banner explica qué se está heredando.
- **La identidad nunca se hereda** en ninguno de los dos modos: nombre, apellidos y fecha de
  nacimiento siempre se capturan desde cero.
- **Confirmación persistente**: un aviso conserva el folio del expediente recién guardado, con enlaces
  para verlo o imprimir su constancia, de modo que encadenar registros no hace perder el hilo.
- **Contador de sesión** en el encabezado (“3 altas en esta sesión”), útil para la ventanilla y para
  medir el cumplimiento de la meta de 5 minutos por persona.
- Las demás acciones del expediente recién creado (constancia, salud, capacitación, volver al panel)
  quedan agrupadas debajo, con menor peso visual que la acción primaria.

### 4.9 Pantallas de expediente (listado y detalle)

**Listado.** Se rehízo por tres defectos medibles: el folio se partía en cuatro líneas, la tabla
desbordaba y cortaba la columna de acciones, y los chips de estatus usaban los colores de categoría
que ya sabíamos que fallan. Ahora:

- El folio vive **dentro de la celda de la persona**, como línea secundaria bajo el nombre; se
  eliminó una columna y la tabla cabe sin desbordar.
- **El estatus migratorio es una categoría, no un estado**, así que va en chip neutro. El color queda
  reservado para lo que exige acción: la marca de NNA no acompañado.
- Filtros en una sola fila con búsqueda prominente; los seis filtros avanzados se despliegan bajo
  demanda (divulgación progresiva) en lugar de ocupar dos filas permanentes.
- La fila completa es clicable, además del enlace explícito *Abrir*.

**Detalle.** Estructura de página de registro:

- **Cabecera de identidad permanente**: fotografía, nombre, folio, CURP, chips de estado y una línea
  de metadatos (municipio, fecha de registro, quién capturó, grupo familiar, última actualización).
  El nombre se compone en la tipografía de texto, no en la display en mayúsculas: es un nombre
  propio, no un rótulo.
- **Siete pestañas fijas al desplazar** (Resumen, Datos generales, Movilidad humana, Familia y NNA,
  Salud y vulnerabilidad, Documentos, Bitácora). En un expediente largo, las pestañas pegajosas son
  la única orientación que le queda al usuario.
- **Resumen como primera pestaña**, con la *ruta de atención* (en qué etapa de las siete va la
  persona), los módulos vinculados y los tres últimos movimientos. Divulgación progresiva: lo
  importante primero, el detalle a un clic.
- **Aislamiento de datos visible** (RNF01): el módulo de Empleabilidad aparece con candado y la
  leyenda “sin acceso: dirección distinta”. Se muestra que el módulo existe sin filtrar su
  contenido, en lugar de ocultarlo y dejar al usuario sin saber que hay información.
- **Permisos explícitos** (RNF02): un aviso indica que el expediente es de solo lectura para el
  perfil de Capturista Municipal y que modificarlo requiere oficio y autorización del Director de
  Área. La acción *Cerrar expediente* aclara que cerrar no elimina (RNF03).
- **Bitácora con compositor arriba** y tipo de nota, filtros por categoría y línea de tiempo. Las
  notas nuevas se agregan en vivo al principio de la lista.
- **Historial de contacto** en el panel lateral: los medios anteriores se muestran tachados y con su
  vigencia, nunca se borran (RF03).

### 4.10 Expediente familiar (RF05 y RF06)

Se resolvió como **maestro-detalle**: lista de grupos a la izquierda, grupo seleccionado a la
derecha. Es el patrón correcto cuando la colección es pequeña y el usuario tiene que actuar sobre
ella, porque conserva el contexto de todos los grupos mientras se trabaja en uno.

- **Lo que exige acción va primero.** Si el grupo tiene integrantes clasificados como *Separado* o
  *No acompañado*, un aviso encabeza el detalle con el botón para generar el oficio a la Procuraduría
  Regional y el plazo de 24 horas. Al generarlo, el aviso cambia a estado *generado* con su folio.
- **En la lista, el pendiente se distingue sin depender del color**: además del texto en guinda lleva
  el ícono de alerta y la leyenda “Oficio pendiente”, y existe un filtro “Solo con NNA pendiente de
  oficio”.
- **Nada de árbol genealógico.** Un diagrama de parentesco es vistoso y difícil de leer; la
  información real (parentesco, dependencia, si viaja con el grupo, condición) se lee mejor en una
  lista con la persona titular fijada arriba y marcada con distintivo.
- **Reasignación de titular como panel con motivo obligatorio** (fallecimiento o abandono), no como
  un menú suelto. Solo aparecen como candidatas las personas mayores de edad, y si no hay ninguna, el
  panel advierte que los NNA pasarán a *No acompañados* con oficio automático — que es exactamente la
  regla del SRS, ahora visible antes de confirmar.
- **Integrantes sin expediente propio** se muestran con su distintivo y acción directa *Crear
  expediente*, con la explicación de por qué lo necesitan (atención individual en salud, capacitación
  o empleo).
- **Agregar integrante** captura los datos mínimos y clasifica automáticamente como NNA si la edad es
  menor de 18, marcando el oficio como pendiente cuando corresponde.
- La **composición del grupo** (integrantes, NNA, dependientes, sin expediente) va en cifras
  pequeñas: es contexto, no el mensaje de la pantalla.

### 4.11 Inicio de sesión v2, identidad real y cierre de sesión

**Identidad.** El usuario entregó dos PNG (`solo-icon.png` y `nombre-completo-mas-icono.png`). Se
conservan como fuente en la raíz y se sirven versiones optimizadas desde `assets/img/`: los
originales pesaban 2.5 MB entre los dos, inaceptable para la primera pantalla del sistema; recortados
y redimensionados quedan en 0.45 MB.

- El **lockup completo** va en la columna clara del formulario, que es donde importa identificar el
  sistema. Se le recortó el sello "Humanismo que transforma" del pie porque ya aparece dos veces más
  en la misma pantalla, y al quitarlo la proporción pasó de 1.5:1 a 2.5:1, que a 304 px deja legibles
  las líneas descriptivas.
- El **isotipo** va en la columna oscura pero **como textura, no como logotipo**: al 10% de opacidad,
  a 72% de ancho y sangrando por el borde inferior derecho. Repetir el mismo símbolo dos veces a 700 px
  de distancia se lee como redundancia; a esa escala se lee como ilustración de fondo.
- **La barra superior conserva la marca geométrica monocroma.** Se probó el isotipo real a 30, 36 y
  44 px sobre guinda: la ilustración pierde toda la figura y el aro guinda desaparece contra el fondo
  guinda. Un logotipo ilustrativo no sobrevive a la escala de un chrome.
- El isotipo a 96 px sí funciona como **favicon** y se aplicó a las seis pantallas.

**Video de fondo.** Se generó con `ffmpeg` un bucle propio de 12 s (720×960, 333 KB) en
`assets/video/`. Sí queda bien, con tres condiciones que se aplicaron:

- **Movimiento lento y sin sujeto.** El campo de color se construye interpolando entre tintas
  profundas de la identidad (guinda `#741024`, jade `#04453F`, rosa `#8E0B48`) que se desplazan en
  órbitas de periodo exacto, más la greca institucional a la deriva. El primer intento sumaba luz en
  lugar de interpolar y el resultado leía **gris**: sumar blancos desatura.
- **El contraste no depende del cuadro.** Encima del video hay un velo de dos degradados, así que el
  texto blanco conserva contraste aunque el video no cargue o se detenga.
- **Respeta `prefers-reduced-motion`**: el video se oculta y se pausa, y queda el poster JPG.

**Buenas prácticas aplicadas al formulario.**

- `<form>` real con envío por `Enter` y `autocomplete` correcto (`username` / `current-password`).
- **Una sola región de error** con `role="alert"` encima de los campos, no un mensaje por campo, y
  foco automático en el primero que falta.
- **Aviso de Bloq Mayús**, que es la causa más común de un acceso fallido.
- Ojo de contraseña con `aria-pressed` y etiqueta que cambia; el campo reserva el espacio para que el
  botón no tape el texto.
- La casilla "Recordar este equipo" advierte que no se active en equipos compartidos de ventanilla.
- El pie de la columna clara dejó de repetir la firma institucional (ya está en la columna oscura y
  dentro del lockup) y ahora da el contacto de mesa de ayuda.

**Cierre de sesión (nuevo en todas las pantallas).** La ficha de usuario de la barra superior pasó de
ser un `div` decorativo a un **menú de cuenta** desplegable: perfil, cambiar contraseña, ayuda y
**Cerrar sesión**. Abre con clic, cierra con `Escape` o clic fuera, y expone `aria-haspopup`,
`aria-expanded` y `role="menu"`. Sale a `login.html?salir=1`, y con ese parámetro el login confirma
"Cerraste sesión correctamente" y recuerda que la sesión quedó en la bitácora de auditoría.

### 4.12 Salud y Vulnerabilidad (RF07)

El guion original de esta pantalla era un formulario suelto: casillas del catálogo OMS y, debajo, la
canalización. Se rehízo por tres razones que se sostienen en el propio dominio.

**1. La pantalla no es un formulario, es una cartera de trabajo.** Al módulo se llega desde el menú
lateral, sin persona seleccionada, y los casos llegan solos: los *marcadores rápidos de vulnerabilidad*
que la ventanilla captura en el paso 5 del alta (§4.5, hueco 7) generan aquí la tarea de valoración.
Por eso se resolvió como **maestro-detalle**, igual que el expediente familiar: a la izquierda la
cartera ordenada **por urgencia y no por fecha** —primero lo que tiene plazo legal, luego la cita
vencida, luego lo pendiente y al final el seguimiento—, y a la derecha la valoración de la persona
seleccionada. Así el módulo cierra el circuito que el alta abre.

**2. Salud y vulnerabilidad son dos registros distintos y no pueden ser una sola rejilla de casillas.**
Una condición de salud describe un padecimiento; un marcador de vulnerabilidad **activa una ruta con
plazo**. Se separaron en dos bloques y, sobre todo, **cada marcador declara su consecuencia junto a la
casilla**: al marcar *NNA separado o no acompañado* aparece en el acto el oficio a la Procuraduría
Regional y el plazo de 24 horas (RF06); al marcar *víctima de delito* o *indicios de trata*, el aviso
a la Fiscalía y a la CEAV. Marcar una casilla nunca es informativo, y la interfaz lo dice antes de que
la persona la marque, no después.

El **nivel de atención** que encabeza el bloque lo decide el marcador con plazo legal, no el conteo:
un solo marcador obligatorio manda a *Atención inmediata (24 h)* aunque sea el único. El aviso que
encabeza el detalle **separa las rutas obligatorias de las derivadas**, de modo que el número del
encabezado corresponda a lo que se lista debajo.

**3. Una condición no es una casilla, es un registro con estado, fecha y responsable.** "Diabetes"
detectada en marzo y controlada en agosto es el dato real; una casilla marcada no lo es. Por eso el
catálogo OMS/CIE-10 alimenta una tabla de *Condiciones registradas* con código, grupo, fecha de
detección, quién la registró y estado (*Activa · En tratamiento · Controlada · Resuelta*). Y como
**nada se elimina** (RNF03), solo las condiciones aún **sin guardar** pueden quitarse: una vez
guardada, una condición se marca como *Resuelta* pero conserva su historial. La interfaz lo dice en el
pie de la tabla y lo hace cumplir en el propio catálogo, donde desmarcar una condición ya guardada no
la borra.

**Decisiones de detalle:**

- **El catálogo se pliega, pero el buscador recorre los seis grupos.** Treinta casillas abiertas a la
  vez son dos pantallas de desplazamiento y contradicen la meta de rapidez (RNF04); dos grupos abiertos
  y un buscador que abre los que coinciden conservan la posibilidad de explorar el catálogo completo.
  Existe además el campo abierto *Condición no incluida en el catálogo*, que se registra marcada como
  pendiente de codificar.
- **La vista previa del oficio se arma en vivo** conforme se llena institución, motivo y fecha de cita.
  El oficio nace en estado **Borrador · pendiente de firma del Director de Área**: eso demuestra RF07
  completo sin contradecir RNF02, porque el perfil de ventanilla prepara la canalización pero no la
  firma. La hoja lleva membrete, greca institucional y la nota de que **la validación es por folio y
  sello, sin código QR**.
- **Las rutas obligadas se conectan con el mecanismo que las cumple:** *Preparar canalización* precarga
  institución y motivo en el formulario, y la ruta de NNA enlaza al expediente familiar, que es donde
  ya vive la emisión de ese oficio. No se duplicó la lógica.
- **La barra de guardado dice la verdad:** sin cambios pendientes, *Guardar valoración* y *Descartar*
  aparecen desactivados; con cambios, el mensaje cuenta cuántas condiciones nuevas hay.
- **Sin gráficas ni tarjetas KPI.** El panorama estadístico de salud pertenece al Panel (RF14); este
  módulo es una superficie de trabajo. Los conteos que sí hacen falta viven en los chips de filtro de
  la cartera (*Requieren acción 3 · Sin valorar 4 · En seguimiento 2 · Todas 8*), donde además sirven
  para filtrar. Es la lección de la corrección 1 aplicada desde el principio.
- **El aviso de información sensible encabeza la pantalla** (RNF01) e incluye que los reportes
  agregados se usan siempre anonimizados y que ninguna condición se elimina.

### 4.13 Capacitación · Grupos ICATECH (RF13)

El guion original era una sola tarjeta de curso con su medidor de cupo y la lista de inscritos. Se
rehízo partiendo de una observación sobre el propio requisito: **las tres reglas de RF13 no son la
misma clase de cosa y no fallan en el mismo momento**, así que no pueden mostrarse como un solo
semáforo.

- El **cupo** bloquea la inscripción *hoy*.
- La **proporción mayoritaria extranjera** es una regla del grupo que una sola alta puede romper, y
  se verifica al cerrar la inscripción. Por eso se **predice antes de confirmar**, no se reporta
  después.
- La **documentación** (CURP vigente y constancia COMAR) no impide inscribirse: impide **acreditar**,
  con plazo hasta el cierre del curso.
- La **asistencia** mínima del 80% es el cuarto requisito y el único irreversible.

De ahí salen las decisiones de la pantalla:

- **Maestro-detalle, igual que Salud y que el expediente familiar**, porque al módulo se llega desde
  el menú sin curso seleccionado. La cartera de la izquierda se ordena **por urgencia** —proporción
  incumplida, curso por concluir con documentación pendiente, cierre de inscripción próximo,
  asistencia perdida— y cada grupo declara su pendiente en texto con ícono, no solo con color. La
  **selección inicial es el grupo en curso**, porque pasar lista es la tarea diaria; el grupo que
  exige acción sigue arriba de la lista con su alerta visible.
- **El medidor de cupo no es una dona.** Se sustituyó el "medidor circular 16/18" del guion por
  **una casilla por lugar**: se cuentan los lugares libres directamente, que es la pregunta real de
  la ventanilla, y respeta la decisión de la corrección 1 de no usar donas.
- **La proporción se dibuja como magnitud contra un umbral, no como dos categorías.** Colorear
  "extranjeras vs. mexicanas" habría exigido un par categórico, y el par disponible (guinda + jade)
  choca con la regla de reservar el guinda para estado crítico. Como la regla real es *"más del
  50%"*, se dibuja **una sola tinta jade con una marca de umbral al 50%**: se lee si se está por
  encima de la línea y por cuánto, sin introducir un color nuevo. Cuando no se cumple, la barra pasa
  a guinda — ahí sí es estado crítico.
- **El margen es la forma accionable de la regla.** No basta decir "cumple": la tarjeta dice *"caben
  2 personas mexicanas más sin romperla"*, y cuando el margen es cero, *"toda alta adicional debe ser
  de persona extranjera"*.
- **La asistencia se juzga por lo alcanzable, no por el porcentaje de hoy.** Con 8 de 12 sesiones
  impartidas, quien lleva 5 asistencias ya no puede llegar al mínimo de 10 aunque asista al resto: eso
  es irreversible y la interfaz lo dice (*"ya no alcanza 10 de 12"*, en guinda), mientras que quien
  lleva 6 aparece en rosa como *"necesita las 4 que faltan"*. Un solo porcentaje habría confundido los
  dos casos.
- **Una sola cifra héroe: quién está en condiciones de acreditar.** Es el mensaje de la pantalla, y
  debajo se desglosa en los tres requisitos con su conteo. Los requisitos que aún no aplican
  (evaluación final, o la asistencia de un grupo que no ha iniciado) muestran **"—" y barra arena**,
  no un cero ni un 100% engañoso.
- **El pase de lista es un modo de la misma tabla**, no otra pantalla: mantiene visible la asistencia
  acumulada de cada persona mientras se marca Presente / Ausente / Justificada, que es justo el dato
  que el instructor necesita para saber a quién le urge. No se guarda hasta confirmar y el pie dice
  cuántas faltan por marcar.
- **Nada se elimina (RNF03):** no hay "quitar del grupo". Hay *Registrar baja* con motivo obligatorio;
  la persona se queda en la lista, tachada, con su motivo y su asistencia acumulada, y libera un lugar.
- **Permisos explícitos (RNF02):** el aviso de cabecera declara que la ventanilla conforma el grupo y
  pasa lista, pero que **la acreditación y la constancia de competencia las emite ICATECH**. El SIMH
  verifica requisitos, no acredita.
- **Sin gráficas ni tarjetas KPI**, como en Salud: es una superficie de trabajo y el panorama
  estadístico pertenece al Panel (RF14). Los conteos viven en los chips de filtro, donde además filtran.
- La **lista para firma física** se declara con membrete, folio y sello, y **sin código QR**.
- La nota del guion *"no hay límite de cursos por persona"* se convirtió en dato útil en vez de pie de
  página: los cursos previos aparecen bajo el folio de cada persona y en la predicción del alta, como
  información, nunca como impedimento.

Atajos de revisión: `capacitacion.html?g=021` (grupo con la proporción incumplida), `?lista=1` (pase
de lista), `?g=021&cand=0455` (predicción de un alta que rompe la proporción), `?g=003` (grupo
concluido).

### 4.14 Empleabilidad · Vinculación laboral y seguimiento (RF12)

El guion original resolvía esta pantalla como tres tarjetas KPI, la tabla del historial laboral de
*una* persona y un panel lateral de "Seguimiento" con dos chips (15 días / 30 días). Se rehízo por
cuatro razones que salen del propio requisito.

**1. Las tarjetas KPI no van aquí.** Es la misma lección de Salud (§4.12) y Capacitación (§4.13): el
panorama estadístico pertenece al Panel (RF14) y este módulo es una superficie de trabajo. Además las
tres cifras propuestas —vacantes registradas, entrevistas agendadas, contrataciones del mes— son
objetos de tres niveles distintos y ninguna es sobre la persona que se tiene en pantalla. Los conteos
que sí sirven viven en los **chips de filtro** de la cartera, donde además filtran.

**2. Al módulo no se llega con una persona seleccionada: lo que llega solo son los vencimientos.**
Por eso es **maestro-detalle** ordenado **por vencimiento y no por fecha de alta**: verificación
vencida → verificación por vencer → entrevista sin resultado capturado → contratación sin fecha de
inicio → sin colocación ni postulación abierta. Cada renglón declara su pendiente en texto con ícono,
nunca solo con color.

**3. Un hito de seguimiento no es un chip de estado: es un registro.** Un chip que dice "Vencido" no
deja constancia de nada ni indica qué hacer. Cada verificación se captura con **fecha real, medio
(llamada al patrón, llamada a la persona, visita al centro de trabajo, comparecencia), resultado y
responsable**. Los tres resultados posibles tienen consecuencias distintas y declaradas antes de
confirmar:

- *Continúa laborando* → el hito queda cumplido.
- *Ya no labora* → **motivo obligatorio de catálogo**, la vinculación pasa a *Concluida* y la persona
  regresa a la cartera como caso a revincular. Nada se elimina (RNF03).
- *No se pudo contactar* → no cierra el hito: registra el intento, **reprograma 3 días** y al tercer
  intento el caso se turna al Enlace de Vinculación.

**4. "Contratación (Sí / No)" no es un booleano.** Colapsa "todavía no hay entrevista" con "no la
contrataron", que es justo la distinción que necesita quien da seguimiento. Se sustituyó por la
**etapa** de la vinculación (Postulación → Entrevista agendada → Entrevista realizada → Contratación
registrada → Colocación vigente → Concluida / Sin contratación) y el resultado aparece **solo cuando
ya aplica**. Las etapas nombran el estado de la *vinculación*, no el de la persona, para que el texto
no concuerde en género con el nombre de quien se atiende.

**Decisiones de detalle:**

- **El reloj arranca en la fecha de inicio de labores, no en la contratación ni en la postulación**, y
  solo existe para vinculaciones que llegaron a contratación. Por eso hay un estado propio para
  *contratada sin fecha de inicio*: es un pendiente real (el seguimiento no puede programarse) y la
  cifra héroe muestra "—", no un cero. Una postulación no genera hitos, y la tarjeta lo dice en vez
  de dibujar dos chips vacíos.
- **Una sola cifra héroe: los días que lleva en pie la colocación actual.** RF12 mide permanencia, no
  altas; ese es el número que decide. Cuando no hay colocación vigente se compone "—" en gris y
  tamaño reducido: a 48 px un guion largo se lee como una barra negra.
- **La línea de hitos reutiliza el componente `.ruta`** del sistema de diseño, con dos estados nuevos
  (*vencido* en guinda, *por vencer* en rosa). Es la misma idea que la ruta de atención del
  expediente, así que no se inventó un componente.
- **Requisitos para formalizar la contratación, no para postularse.** CURP y documento que autoriza
  trabajar son obligatorios para *firmar*; no impiden postularse ni entrevistarse, y la interfaz lo
  declara en lugar de bloquear. **RFC y NSS aparecen como opcionales al inicio** con su estado
  (*registrado · en trámite por el patrón · pendiente*), que es exactamente la regla del dominio. Para
  persona mexicana el documento migratorio se muestra como **"No aplica"**, nunca como incumplimiento.
- **El motivo es el dato de política pública.** Tanto el de no contratación como el de conclusión se
  capturan **de catálogo, no en texto libre**, porque sirven para saber *por qué* no se contrata o no
  se sostienen las colocaciones de las personas en movilidad. Ninguna vinculación se elimina (RNF03).
- **Se agregó el paso que faltaba en el guion:** una postulación sin entrevista no tenía dónde
  capturar la fecha de entrevista, así que el flujo se quedaba sin salida. Ahora la cadena completa
  es recorrible: postular → agendar → resultado → contratación → inicio de labores → 15 días →
  30 días → cierre.
- **Aislamiento visible en el sentido contrario (RNF01).** `expediente-detalle.html` muestra
  Empleabilidad con candado; aquí es **Salud y Vulnerabilidad** la que aparece bloqueada, con la
  leyenda de que ninguna condición de salud puede usarse como criterio para vincular o descartar a
  una persona.
- **Permisos explícitos (RNF02),** con la misma forma que Salud y Capacitación: la ventanilla registra
  la vinculación y captura las verificaciones, pero la **constancia de colocación y el cierre formal
  del seguimiento los emite el Enlace de Vinculación Laboral**.
- **Sin gráficas, sin donas y sin colores nuevos:** la pantalla no introduce ninguna tinta que no
  estuviera ya en los tokens (jade para magnitud, rosa para riesgo, guinda para estado crítico).

Atajos de revisión: `empleabilidad.html?e=0412` (verificación de 30 días vencida, selección por
omisión), `?e=0412&ver=30` (panel de verificación abierto), `?e=0435&nueva=1` (alta de vinculación de
una persona sin documento que autorice trabajar), `?e=0447` (entrevista sin resultado capturado),
`?e=0464` (contratación sin fecha de inicio de labores) y `?e=0658` (historial con dos vinculaciones,
una concluida con motivo).

### 4.15 Empleabilidad v2 · revisión de accesibilidad y carga cognitiva

El usuario reportó que la pantalla **no le parecía accesible y la sentía confusa y muy compleja**. La
revisión confirmó que el fondo era correcto —el análisis de RF12 de §4.14 se sostiene— pero que la
pantalla **mostraba todo el análisis a la vez**. El diagnóstico, y lo que se hizo con cada punto:

**1. Siete bloques abiertos al mismo tiempo, unos 2 000 px de alto.** El detalle apilaba aviso,
cabecera, cifra héroe, seguimiento, requisitos, perfil, historial y módulos. Son **tres tareas
distintas** —trabajar el pendiente del día, consultar el expediente laboral y revisar la ficha de
referencia— y solo la primera es diaria. Se separaron en **pestañas** (`Seguimiento`,
`Vinculaciones`, `Requisitos y perfil`), que es el componente `.pestanas` que ya usa
`expediente-detalle.html`; no se inventó nada. La cabecera y la barra de acción quedan **fuera** de
las pestañas, así que el pendiente se ve siempre. La página bajó de ~2 000 px a ~1 100 px.

**2. El mismo dato se enunciaba tres veces.** "La verificación de 30 días venció hace 4 días"
aparecía en el aviso rojo, en el pie de la cifra héroe y en la fila del hito, con **dos botones
idénticos** a 200 px de distancia. Ahora hay **una sola barra de acción** que responde en este orden:
qué pasa, por qué importa, qué botón lo resuelve. Los cinco pesos de `pendiente()` producen esa
barra —antes solo los dos de vencimiento tenían aviso y los otros tres había que descubrirlos
leyendo la tabla— y cuando no hay nada pendiente **lo dice** en vez de callar. Con un panel de
captura abierto, el botón que lo abrió deja de dibujarse.

**3. El estado de los hitos viajaba solo en el color.** El marcador de la cartera eran dos puntos de
color con la leyenda "15 d · 30 d de seguimiento": nombraba los hitos pero **no su estado**, y sin
nombre accesible. Se sustituyó por pastillas con **glifo + palabra + color** (`✓ 15 d: cumplida`,
`! 30 d: vencida`): tres canales, legible impresa en blanco y negro y para un lector de pantalla.

**4. `--gris-claro` no pasaba AA.** Era `#8C8C8C`: **3.36:1 sobre blanco y 2.87:1 sobre el hueso de
la página**, contra el 4.5:1 que exige el manual, y lo usan las migas de pan, los rótulos de dato y
las fechas de la ruta, que son texto para leer. Se cambió el **token** a `#6A6A6A` —el gris más claro
que pasa AA sobre las dos superficies (5.41:1 y 4.62:1)— con lo que queda corregido en las nueve
pantallas de una sola vez, sin perder el escalón respecto de `--gris`. En esta pantalla, además,
ningún texto baja de 12.5 px y los controles tienen 44 px de alto mínimo (36 px los chips de filtro,
con 8 px de separación), que es el área táctil que pide el manual.

**5. Faltaba lo básico de teclado y lector de pantalla.** La lista de personas usaba `aria-pressed`,
como si fueran cinco interruptores independientes en vez de una **selección única**: ahora es
`role="listbox"` con `role="option"` y `aria-selected`. El detalle se repinta entero con `innerHTML`,
así que el foco caía al vacío: ahora pasa al nombre de la persona y un `role="status"` anuncia a
quién se seleccionó y qué está pendiente. Las pestañas responden a flechas, Inicio y Fin; abrir un
panel mete el foco en su primer campo; hay anillo de foco visible en toda la pantalla. Se agregó la
utilidad `.sr-solo` a `simh.css` para el texto que debe leerse pero no verse.

**6. Cinco párrafos de texto normativo permanentes.** Entre el aviso de cabecera y los pies de las
cuatro tarjetas había ~120 palabras de RF y RNF fijas en gris pequeño: era **documentación de diseño,
no información de ventanilla**. El aviso de cabecera se volvió un plegable con las tres reglas
ordenadas (qué sí puede la ventanilla, qué no, aislamiento) y los pies se recortaron a su frase
operativa. El porqué de cada regla sigue estando, pero a un clic.

**7. La tabla del historial volvía a desbordar.** Con seis columnas el chip de etapa (que trae
`white-space:nowrap`) desbordaba su 13% y **se encimaba con la columna de resultado**, y "Cerrar
vinculación" se partía a mitad de palabra. Se bajó a **cuatro columnas**: etapa y resultado cuentan
lo mismo y van juntos —el resultado ahora **complementa al chip en vez de repetirlo**, así que donde
el chip dice "Concluida" la línea aporta el motivo— y el responsable baja a la celda de las fechas.

**8. Dos correcciones que salieron de la propia revisión.** La pestaña `Seguimiento` se abría por
omisión también para una contratación **sin fecha de inicio**, donde la cifra héroe mostraba "—" al
lado de una tarjeta vacía que explicaba lo mismo que la barra de acción: tres veces el mismo dato.
Ahora esa pestaña es la de omisión solo cuando hay un reloj corriendo, y sin colocación vigente se
dibuja únicamente la tarjeta explicativa. Y el guardia que corregía la pestaña activa en cada
pintado hacía que un clic en `Seguimiento` sobre alguien sin colocación **no hiciera nada visible**;
se eliminó, porque `pestPorOmision()` ya elige bien al cambiar de persona.

Atajo de revisión nuevo: `empleabilidad.html?tab=seg|vinc|ficha` abre esa pestaña.

### 4.16 Censo Empresarial offline (RF15) · la única pantalla móvil

Es la última pantalla del alcance y la única que no se usa en ventanilla sino **en campo, en la
puerta de un negocio, con el teléfono en una mano**. Eso decide todo lo demás.

**Cómo se presenta.** Se llega desde el menú lateral del escritorio, así que no puede ser una página
de 390 px suelta dentro de una ventana de 1440: se vería rota. Se muestra el **teléfono enmarcado**
(390 × 844) con un **panel de revisión** al lado que permite conmutar los dos estados de conexión y
las dos vistas que pide el requisito — una pantalla que trata sobre la conexión no se puede revisar
en un solo estado. Por debajo de 900 px el marco desaparece y la interfaz ocupa toda la ventana: es
una pantalla móvil de verdad, no la fotografía de una. El panel declara que **no forma parte de la
aplicación**: en campo el estado de la red lo decide el teléfono, no quien captura.

**Lo que el guion pedía y no se sostiene:**

| Guion original | Qué falla | Cómo quedó |
|---|---|---|
| Diez campos de igual peso en una columna | Se captura de pie, con una persona esperando, y la entrevista se interrumpe | Tres secciones tituladas —el negocio, personas en movilidad, contacto— y se puede **guardar incompleto desde el principio**, que es el caso más frecuente y el que el guion no contemplaba |
| "Contrata personas en movilidad (Sí / No)" como octavo campo | Es el corazón del censo puesto como casilla, y el booleano confunde "no contrata" con "no quiso responder" — el mismo error de "Contratación (Sí/No)" ya corregido en RF12 | Sección propia con cuatro respuestas (contrata · ha contratado antes · no contrata · prefirió no responder) y **consecuencia declarada**: si contrata, el negocio entra a la bolsa de vacantes de Empleabilidad |
| "Vacantes disponibles" como número | Un "3" no se puede vincular con nadie | Renglones de **puesto + plazas**, que sí alimentan RF12 |
| Chip "SIN CONEXIÓN · 14 registros pendientes" | Enuncia el problema y no responde la única pregunta real en campo: *¿se va a perder lo que llevo?* | Bloque que dice **dónde están los datos, cuántos son, de cuándo es el más viejo y cuándo salen solos** |
| "SINCRONIZAR AHORA" desactivado con su explicación | Un botón muerto ocupa el lugar de la acción sin poder hacerla, igual que un chip que dice "Vencido" | Sin conexión **no se dibuja el botón**: se enuncia la regla. Con conexión aparece el botón real |
| "14 registros pendientes" fijo | No correspondía a ningún dato | El contador **se deriva** de la lista del dispositivo |

**Decisiones de detalle:**

- **El motivo de quien no contrata es el hallazgo del censo**, no un dato menor: separa el obstáculo
  legal ("desconoce si puede contratar a una persona extranjera") del informativo ("no sabe qué
  documento pedir") y del de desconfianza ("teme una revisión"). De catálogo, porque se va a contar,
  y con su consecuencia declarada: el desconocimiento activa la ruta de orientación al sector
  patronal. Es la misma regla de motivos de RF12.
- **El GPS funciona sin conexión** y la interfaz lo dice: es un dato técnico cierto y tranquilizador.
  La fotografía advierte que se envía al final, cuando haya red suficiente.
- **Verificación de duplicados acotada a la verdad:** sin conexión solo puede compararse contra lo
  capturado en ese dispositivo, y el aviso lo declara en vez de prometer el padrón completo.
- **El botón de envío dice el número que de verdad va a mandar.** Un registro incompleto no se envía,
  así que "pendientes" y "enviables" no son el mismo número y el botón usa el segundo.
- **Nada se elimina (RNF03):** un registro pendiente se completa; uno ya enviado se corrige con
  oficio, no desde el dispositivo.
- **48 px de alto en cada campo** en vez de los 44 del resto del sistema: aquí se captura de pie, con
  una mano y a veces bajo el sol.

**Corrección al chrome que salió de esta pantalla.** La barra superior estaba armada solo para
escritorio: `.marca` reservaba 236 px fijos y el buscador global no encogía, así que en pantalla
angosta la ficha de usuario se salía del borde (medido: `right=483` en un ancho de 481 px). No se
veía en `scrollWidth` porque `.topbar` es `position:fixed`. Y por debajo de 900 px el menú lateral se
oculta con `translateX(-100%)` **sin nada que lo abriera**: en un teléfono no había forma de navegar.
Se agregó el botón de menú con su velo (Escape y clic fuera lo cierran) y la barra se colapsa a
isotipo + menú + avatar. Beneficia a las nueve pantallas; en escritorio no cambia nada.

Atajos de revisión: `censo.html?vista=registros` (lo guardado en el dispositivo), `?red=1` (estado
con conexión, combinable: `?vista=registros&red=1`) y `?vista=exito` (acuse de guardado).

**Limitación de la verificación:** el headless de Edge no baja de ~481 px de ancho de viewport, así
que el desbordamiento se comprobó a ese ancho —con las reglas móviles ya activas, porque el corte es
a 900 px— pero **no a los 390 px reales de un teléfono**. Conviene revisarlo en un dispositivo o con
la emulación de las herramientas de desarrollo antes de presentar.

### 4.17 Administración · Usuarios, permisos y bitácora (RNF01, RNF02)

Dos pestañas, como pide el guion: **Usuarios y permisos** y **Bitácora de auditoría**. El fondo del
guion es correcto y hay cuatro cosas que no se sostienen.

**1. La matriz del guion tiene una columna “Eliminar”.** Todo el sistema se sostiene sobre lo
contrario —nada se elimina (RNF03) y la palabra no debe aparecer en ninguna interfaz—, así que un
permiso para una acción que no existe no es un error de redacción: **legitima la acción**. La columna
se sustituyó por **Cerrar**, que es la única forma real de retirar algo de operación (cerrar
expediente, cerrar vinculación, cerrar grupo) conservando el historial. El pie de la matriz lo
declara. Una cuenta tampoco se elimina: se **suspende**, con motivo y oficio, y conserva su rastro
en la bitácora.

**2. Los permisos no viven en las personas, viven en los roles.** El guion pone casillas por usuario:
45 casillas por cada persona del sistema es inadministrable y hace creer que cada quien puede tener
su combinación. Aquí la matriz es **la del rol**, y lo que se concede a alguien en particular es una
**excepción** con oficio, motivo y fecha de término, listada aparte y con su celda distinguida. Al
vencer, el permiso vuelve solo a lo que da el rol. Eso además es exactamente lo que exige RNF02:
modificar requiere oficio y autorización.

**3. El aislamiento entre direcciones estaba resuelto como una frase en un aviso.** Ahora se ve en la
matriz: para quien pertenece a una dirección, los módulos de la otra son **filas bloqueadas** con su
leyenda (*“Sin acceso · Dirección de Capacitación y Empleo”*). La regla se demuestra en vez de
anunciarse, igual que el candado de Empleabilidad en el expediente y el de Salud en Empleabilidad.
El candado del aislamiento **no se tiñe de guinda** como el que pide oficio: no es un permiso que
pueda solicitarse, es un muro, y la diferencia está escrita en la fila, no solo en el tono.

**4. La bitácora era una tabla de siete columnas con filtro por fecha y usuario.** Lo que un auditor
pregunta no es “lista todo”, sino qué le pasó a un expediente y quién lo tocó. Por eso:

- se busca **por folio afectado**, persona usuaria u oficio, y se filtra por módulo y tipo de acción;
- cada edición muestra **antes → después** (`CURP: MACY940318MNEXXX01 → MACY940318MCSRRL07`), que es
  lo que convierte un “Editó” en una constancia;
- los **intentos denegados también se registran**, en guinda y con su motivo. Un control que no deja
  rastro de lo que impidió no demuestra nada: el renglón en que el Director de Salud intenta consultar
  Empleabilidad es la prueba de RNF01 operando, y el de la capturista intentando cerrar un expediente
  es la de RNF02;
- el pie declara que la bitácora **solo crece**: ninguna línea puede modificarse ni retirarse, tampoco
  por el superadministrador.

**Decisiones de detalle:**

- **La matriz va a ancho completo bajo la tabla, no en un panel lateral de 380 px.** Son nueve módulos
  por cinco acciones; en una columna estrecha se vuelve ilegible o desborda. Además así aparece
  siempre en el mismo sitio, como los paneles de captura de Empleabilidad.
- **Seis estados de celda, no dos:** concedido, requiere oficio, excepción vigente, sin acceso por
  aislamiento, no concedido y **no aplica**. Los dos últimos no son lo mismo y confundirlos era parte
  del problema: “Cerrar” no tiene sentido en el Panel Estadístico y eso no es un permiso negado. Cada
  celda lleva glifo, color y nombre accesible, con leyenda completa.
- **La tabla de usuarios tiene seis columnas, no siete:** el cargo vive bajo el nombre en la misma
  celda, que es la corrección ya aplicada al listado de expedientes, con `table-layout:fixed` y
  `colgroup`.
- **La fila entera es clicable, pero el control accesible es el botón del nombre.** Poner
  `role="button"` sobre el `<tr>` destruye la semántica de tabla para un lector de pantalla. Es el
  mismo criterio del listado de expedientes. Ojo: `.btn` trae `white-space:nowrap` y dentro de una
  celda del 31 % vuelve a desbordar, así que el botón del nombre se compone como texto.
- **Las acciones de administración no se simulan a medias.** Cambiar de rol, registrar una excepción o
  suspender una cuenta exigen oficio y quedan en la bitácora; el prototipo lo declara en vez de fingir
  un formulario que no guarda nada.

Atajos de revisión: `administracion.html?tab=bitacora` abre la bitácora y `?u=u4` la matriz de la
capturista con una excepción vigente (`?u=u3` muestra el aislamiento entre direcciones de un
Director de Área, `?u=u7` una cuenta suspendida).

### 4.18 Oficios y Constancias (RF10, RF11)

El guion trae dos pantallas —la 12, constancia de registro, y la 13, emisión automatizada de
oficios— y el menú lateral trae **una sola entrada**. La entrada tiene razón: son las dos formas que
tiene el sistema de producir papel con validez y comparten serie, firma y bitácora. Van como dos
pestañas de un solo archivo, igual que Administración resolvió usuarios y bitácora.

> **Corregido el 28/08/2026 (ver §4.21).** La Dirección aclaró que su «OTRA PESTAÑA» quería decir
> otro **módulo**, con su entrada de menú, no una pestaña dentro de una pantalla. Lo que sigue en
> esta sección describe el razonamiento de contenido, que se conserva íntegro; la organización en
> archivos es la de §4.21.

**1. El guion hace editable el cuerpo del oficio, con las variables a la vista como
`{{nombre_persona}}`.** Eso no es emisión *automatizada* (RF11), es un editor de plantillas, y pone
a la ventanilla a redactar texto con efectos legales. Aquí el cuerpo lo arma la plantilla con los
datos del expediente y lo que se captura es un conjunto acotado de variables. Enseñar la sintaxis de
las variables es enseñar la maquinaria: lo que necesita ver quien firma es **qué parte del texto no
se escribió a mano**, así que en la vista previa los datos tomados del expediente van marcados y hay
una leyenda que lo dice. Es la misma regla que ya rige las cifras del resto del prototipo, aplicada
a la prosa.

**2. El guion asigna el folio al abrir el formulario** («autogenerado y bloqueado»). Un folio de una
serie consecutiva no puede nacer con el borrador: si el borrador se abandona, el folio queda quemado
y la serie tiene un hueco, que es exactamente lo que un auditor busca. Aquí el borrador lleva
**referencia interna** (`BOR-0034`) y **el folio se asigna al firmar**. Lo que existe antes de la
firma no es un oficio, y la hoja lo dice en su propia cara con un sello de estado: un borrador que
se ve idéntico a un oficio firmado es una trampa.

**3. El guion pone tres botones al mismo nivel:** «Guardar borrador», «Generar oficio (PDF)» y
«Enviar a firma». Son tres puntos de no retorno distintos dibujados igual, y el orden sugiere que se
puede producir el PDF definitivo sin firma —un PDF con folio real circulando sin firmar es el modo
de fallo—. Aquí hay **una acción principal por estado** y la manda el estado: borrador → *Enviar a
firma*; en firma → *Avisar a la Dirección* (porque este perfil no firma); emitido → *Registrar
acuse*; acusado → solo descarga; cancelado → el oficio que lo sustituye.

**4. Al guion le falta el antes y el después.** Salud y Expediente Familiar ya emiten oficios; si
esta pantalla fuera solo un compositor, duplicaría esa lógica. Su trabajo principal es el
**registro**: la serie consecutiva, qué espera firma, qué salió sin acuse y qué se canceló. Las
plantillas cuyo dato vive en otro módulo —canalización, notificación por NNA, vinculación laboral—
**no se capturan aquí**: se enuncia la regla y se enlaza al módulo. Las dos que sí se redactan aquí
son la *solicitud de modificación de expediente* (RNF02) y la *comunicación institucional*.

**5. Nadie pedía el acuse de recibo.** Un oficio que sale y nunca se acusa es el riesgo real de
operación, sobre todo el de la Procuraduría, que tiene plazo legal. El acuse es un estado propio,
con fecha esperada y con su panel de captura, y la columna de plazo es distinta de la de estado: el
estado dice en qué punto va el documento, el plazo dice si va a tiempo.

**6. La constancia del guion ofrece «Formato: Imprimible / Digital».** Para una población sin acceso
a dispositivos móviles —la misma razón por la que no hay QR— esa distinción no significa nada. Lo
que de verdad cambia es el **soporte**, que además es la decisión abierta de §5.3: el gafete se
dibuja **a tamaño real** (54 × 86 mm) y la hoja carta al 50 %, en milímetros y no en píxeles, y las
dos **se imprimen de verdad** al tamaño correcto —el `@page` se reescribe según el soporte elegido y
la impresión sale en una sola página, sin el chrome del sistema—. Así la Dirección decide mirando.

**7. La constancia no decía qué no es.** Sin esa frase se va a usar como documento migratorio, así
que la lleva impresa. Y quitar el QR sin poner otra vía deja el documento inverificable: la
verificación es por folio y sello en ventanilla, y así lo dice el impreso. De ahí salió otra falta
del guion: el pie prometía un sello y la hoja no dejaba **dónde ponerlo**; en carta hay ahora
recuadro de sello y firma de la ventanilla.

**Otras decisiones de detalle:**

- **La casilla «Incluir fotografía» no puede mentir.** Si el expediente no tiene fotografía, no se
  dibuja una casilla muerta: se dice que falta y dónde se agrega.
- **Un expediente cerrado no ampara una constancia vigente.** El expediente se conserva íntegro
  (RNF03) y su constancia anterior sigue existiendo, pero una nueva afirmaría un registro en
  operación que ya no lo está. Se enuncia la regla y qué la desbloquea, sin botón apagado.
- **Reimprimir una constancia exige motivo de catálogo.** Una constancia reimpresa sin motivo no se
  distingue de una falsificada; cada emisión queda en el historial con folio propio (`CR-####`).
- **Los permisos no se inventaron en esta pantalla: se leyeron de la matriz de Administración.** Para
  el módulo «oficios» el perfil de Capturista Municipal tiene *ver* y *crear*, *editar* con oficio y
  **no exporta**. De ahí que el botón de exportar el registro **no se dibuje** y la regla se enuncie
  en el pie de la tabla; que la firma se enuncie como acto del Director de Área (RNF02); y que
  registrar el acuse sí proceda, porque no modifica el oficio, agrega un hecho sobre él.
- **La consecuencia de una modificación se calcula, no se escribe.** Corregir una fecha de nacimiento
  puede sacar a una persona de la clasificación de NNA y cerrar una ruta de protección con plazo
  legal; el panel lo declara antes de confirmar, comparando la edad de antes con la de después.

**Deuda del prototipo que se saldó de paso:**

- **Tres componentes locales subieron al sistema de diseño**, porque esta pantalla iba a ser su
  segundo consumidor y copiarlos habría dejado dos definiciones que mantener: `.filtros-fila`
  (simh.css §20, venía de Administración), `.accion` (§21, venía de Empleabilidad) y `.oficio-hoja`
  (§22, venía de Salud). Las tres pantallas de origen quedaron con un comentario que apunta al
  sistema, y las tres se volvieron a renderizar para comprobar que no cambió nada.
- **El folio `SFS/0912/2026` estaba usado dos veces**, como canalización en Salud y como oficio de
  excepción de permisos en Administración. Una serie consecutiva no ampara dos documentos, y menos
  en la pantalla que existe para demostrar que la serie es auditable: la excepción pasó a
  `SFS/0943/2026`, que además es coherente con su fecha de firma.
- **El oficio a la Procuraduría nacía con folio en `familiar.html`.** Salud ya lo hacía bien (nace en
  borrador pendiente de firma); Expediente Familiar era el que se salía de la regla. Ahora las tres
  pantallas dicen lo mismo y el aviso enlaza al oficio concreto del registro.

Atajos de revisión: en §2.

### 4.19 Menú colapsable (mejora de UX transversal)

El menú lateral ocupaba 244 px fijos en las doce pantallas y no había forma de cerrarlo: el botón de
menú solo existía por debajo de 900 px. En las pantallas anchas —la matriz de permisos, la de
documentación, la tabla de oficios— esos 244 px son justo lo que le falta a la tabla.

Ahora **el mismo botón hace dos cosas según el ancho**, porque en cada uno estorba algo distinto:

- **En escritorio** el lateral no puede desaparecer, porque es la navegación. Se contrae a un **riel
  de 66 px** con solo los iconos, que devuelve 178 px al contenido y **conserva el sitio de cada
  entrada**: la memoria muscular no se rompe, que es lo que pasa cuando un menú se esconde del todo.
  La preferencia se recuerda entre visitas.
- **Por debajo de 900 px** el lateral ya está fuera de pantalla y el botón abre el **cajón** sobre el
  contenido, con velo y Escape, que es como funcionaba antes.

Detalles que costaron:

- **El token hace el trabajo.** Contraer es redefinir `--sidebar-w` en `<html>`; el contenido y la
  marca ya se miden con él, así que ninguna pantalla tuvo que enterarse. Once pantallas se volvieron
  a renderizar en riel para comprobarlo.
- **La etiqueta flotante aparece también con el foco del teclado, no solo con el ratón.** Un riel de
  iconos sin nombre es navegable con ratón y no con teclado. El rótulo sigue en el DOM —el lector de
  pantalla lo necesita para nombrar el enlace— y se muestra en una etiqueta suelta en `<body>`,
  porque `.sidebar` tiene `overflow-y:auto` y un hijo absoluto se recorta contra ese borde.
- **Un bug que solo se ve mirando:** al principio la etiqueta se ocultaba en cualquier desplazamiento.
  Enfocar una entrada hace que el navegador la desplace a la vista, y ese desplazamiento disparaba el
  ocultado: la etiqueta desaparecía en el mismo cuadro en que aparecía. Ahora el desplazamiento la
  **recoloca** en vez de cerrarla.
- **El rótulo del botón dice lo que va a pasar** («Contraer el menú» / «Abrir el menú»), no en qué
  estado está, y `aria-expanded` acompaña.

Nota de verificación: `--screenshot` en Edge headless no captura estados de foco ni de hover. La
etiqueta se comprobó con `--dump-dom` (posición, texto y estilo calculado) y con una página aislada.

### 4.20 Lo que pidió la Dirección el 28/08/2026

El archivo `DOCUMENTO DE MEJORAS DE SIAMH.docx` trae veinte apuntes sobre ocho pantallas. Están todos
aplicados. Los que cambiaron algo de fondo:

**El módulo deja de llamarse Oficios y pasa a ser Canalizaciones y Documentos.** Tiene razón el
apunte: el oficio es el instrumento, la canalización es lo que de verdad hacen. Y con el cambio de
nombre entran las dos pestañas nuevas que pidieron.

**Revalidación de estudios (pestaña nueva).** Se pidió «que se parezca a la de salud y
vulnerabilidad», y así se hizo: cartera ordenada por urgencia y caso a la derecha. La corrección de
fondo es que **la educación básica no se revalida**: una niña o un niño se inscribe aunque no traiga
papeles y la escuela regulariza después. Casi todas las negativas que motivaron la pestaña son de ese
tipo, así que la pantalla no podía tratar la básica como un trámite con requisitos: dice que el
requisito no existe y que lo que hay que registrar es la negativa. Cada requisito declara **quién lo
expide y qué bloquea**, y los que no bloquean nada lo dicen con esas palabras.

**La negativa de atención es un registro, no una queja.** «Que no los quieren atender» solo sirve si
queda con fecha, institución, motivo de catálogo y qué se hizo. Un caso con negativa **sin reclamar**
encabeza la cartera, y el botón lleva al compositor con el hecho ya citado: es el mismo criterio del
intento denegado de la bitácora de Administración.

**Documentación e identidad (pestaña nueva).** La pregunta es de conjunto —qué falta y a quién—, así
que aquí no va otra cartera sino una **matriz de personas por documento**, con el lenguaje de celda ya
probado en la matriz de permisos. La distinción que ordena la pantalla es entre faltantes que
**detienen un trámite** y faltantes que no: el comprobante de domicilio es el que más falta y no
impide nada, y encabezar con él mandaría a la ventanilla a perseguir el papel equivocado. La
constancia de la COMAR lleva su **número de registro**, que era el dato que se echaba en falta.

**El número de oficio como campo propio del municipio.** Se pidió que ellos generen su folio y que la
numeración automática del sistema quede general. Las dos cosas conviven sin romper la serie: el
**folio del SIMH** sigue siendo consecutivo y se asigna al firmar, y al lado se captura el **folio de
la dependencia**, el número que el oficio lleva en el libro de la ventanilla. El municipio cita el
suyo, la Secretaría el de la serie, y el registro los guarda juntos.

**Fechas aproximadas en el alta.** Mucha gente en movilidad no sabe su fecha exacta de nacimiento.
Obligar a un día exacto no produce un dato mejor, produce uno inventado que después no se corrige sin
oficio. Ahora la fecha lleva su **precisión** —día, mes y año, solo el año, o edad declarada— y la
edad deja de ser un número para ser un intervalo. De ahí sale lo importante: **cuando el intervalo
cruza los 18, rige la presunción de minoría de edad**. Se clasifica como NNA y se activa su ruta de
protección hasta que un documento diga otra cosa, porque equivocarse hacia arriba deja a una persona
menor sin oficio a la Procuraduría.

**Solo parentescos directos.** El catálogo traía «Sobrino», «Sobrina» y «Otro», que son colaterales.
No es una poda de catálogo: es la regla que decide si un NNA queda **acompañado o separado**. Quien
viaja con su tía no viaja con quien ejerce la patria potestad, y por eso está separado. Con «Sobrino»
en la lista el sistema recibía un vínculo que parecía suficiente y se quedaba sin saber por qué ese
NNA estaba separado. Ahora el catálogo es de línea recta, hermanos y cónyuge; todo lo demás es
**persona acompañante**, y el alta declara la consecuencia antes de confirmar. El grupo
`SIMH-FAM-2026-0338` se reetiquetó y por fin explica su propia clasificación.

**El panel filtra de verdad por municipio.** El selector existía y no hacía nada. Ahora el panel
entero se deriva de una tabla por municipio: cifra héroe, seis indicadores, cuatro gráficas,
territorio y pendientes. «Todos los municipios» **no es una fila más, es la suma de las seis**, así
que la cifra del estado y la de cada municipio no pueden contradecirse. Los perfiles de nacionalidad
y estatus son propios de cada municipio, porque repartir el total del estado en la misma proporción
para todos inventaría un dato uniforme que no existe: Suchiate es cruce con Guatemala y Tapachula
concentra la población haitiana y hondureña. Los pendientes también son del municipio.

**Marca de acompañamiento en Empleabilidad.** Si la Secretaría está gestionando el RFC o la tarjeta
de una persona, tiene que verse **desde la cabecera** y no dentro de la tercera pestaña: si no se ve,
en la ventanilla se vuelve a pedir el papel que la propia Secretaría está tramitando. La marca lleva
glifo y palabra, y la observación que la sostiene cuelga del requisito que corresponde.

**La cuenta no es un correo.** Se entra con una cuenta institucional `nombre.apellido`. Un correo
cambia de titular, se comparte y sobrevive a la adscripción; una cuenta institucional se suspende con
la persona y conserva su rastro en la bitácora. La cuenta se ve ahora en la tabla de usuarios, bajo el
cargo, y se puede buscar por ella.

**Cursos por municipio.** El municipio estaba escondido dentro del nombre de la sede. Es un campo
propio, con selector sobre la cartera, y los recuentos de los chips cuentan **dentro** del municipio
elegido: si dijeran el total del estado, el chip prometería grupos que la lista no va a mostrar.

**Estatus migratorio del grupo familiar.** Un grupo no tiene un estatus, tiene tantos como
integrantes, y esa diferencia decide quién puede trabajar y quién tiene plazo de trámite. Cada
etiqueta dice lo que significa en la práctica.

**Canalización a educación.** Faltaba la plantilla. Se añadió con su fundamento (art. 3.º
constitucional, Ley General de Educación y Acuerdo 286) y se compone desde el caso de revalidación,
no desde cero: si la negativa no está registrada, aquí no hay nada que reclamar.

**El login, más claro.** El velo era parejo del 62 % y apagaba la imagen entera. Ahora el peso se
concentra en la banda izquierda, que es donde está el texto: se sube el brillo donde no hay nada que
leer y se conserva el contraste donde sí lo hay. El video entra con `brightness(1.28)` y el respaldo
sin video dejó de ser un plano casi negro.

Ya estaban resueltos de antes: **ocupación actual y de origen** en el alta (paso 2, datos
complementarios) y el **usuario sin correo** en el formulario de acceso.

### 4.21 Cuatro módulos independientes, no cuatro pestañas

La Dirección escribió «OTRA PESTAÑA» en su lista de mejoras y se leyó mal: se entendió como una
pestaña dentro de la pantalla de documentos, y eran **módulos independientes, como los demás**. La
corrección es de organización, no de contenido: el razonamiento de §4.20 se conserva entero, pero
ahora vive en cuatro archivos con cuatro entradas de menú.

| Módulo | Archivo | Qué resuelve |
|---|---|---|
| Canalizaciones | `canalizaciones.html` | La serie de oficios: firma, folio, acuse y cancelación (RF11) |
| Revalidación de Estudios | `revalidacion.html` | Requisitos del trámite y negativas de atención registradas |
| Documentación e Identidad | `documentacion.html` | Qué documento le falta a cada expediente y qué detiene |
| Constancias | `constancias.html` | La constancia de registro imprimible (RF10) |

**Por qué la corrección era necesaria y no cosmética.** Una pestaña dice «esto es una vista más de
lo mismo»; un módulo dice «esto es otro trabajo». Y son otro trabajo: quien registra una negativa
escolar no está emitiendo un oficio, quien revisa qué papel falta no está imprimiendo constancias.
Además, en la matriz de permisos de `administracion.html` **una pestaña no se puede conceder ni
negar**: los permisos se dan por módulo. Con las cuatro entradas separadas, la matriz pasó de una
fila a cuatro y por fin dice cosas distintas de cada una — *Documentación* no tiene *Crear* porque
ahí no se da de alta nada, y *Constancias* no tiene *Editar* porque una constancia emitida no se
corrige, se reemite con motivo.

**Lo que costó separarlos:**

- **El catálogo de personas era el mismo para los cuatro.** Cuatro copias serían cuatro sitios donde
  una edad, una CURP o un folio pueden dejar de coincidir, que es justo el error que se nota en una
  demostración. Se creó `assets/js/simh-datos.js` con el reloj del prototipo, los permisos de quien
  opera y el catálogo de personas. Es la primera vez que el proyecto rompe la regla de «cada página
  lleva sus datos dentro», y se rompe a propósito: los cuatro módulos trabajan sobre las mismas
  siete personas.
- **Los casos de revalidación también son de dos módulos.** El oficio de educación cita la negativa
  registrada, así que `NIVELES`, `MOT_NEG`, `REVAL` y `negAbierta()` viven en el módulo de datos
  compartido. Los requisitos por nivel, en cambio, solo los usa Revalidación y se quedaron allí.
- **Lo que era cambiar de pestaña ahora es navegar.** «Reclamar por oficio» lleva de Revalidación a
  Canalizaciones con la plantilla y el caso ya elegidos (`?nuevo=educacion&caso=r2`, con respaldo en
  `sessionStorage`), y «Ver el oficio» va al documento concreto. El salto conserva el contexto: el
  compositor llega con el hecho citado y el destinatario puesto, no en blanco.
- **Cinco piezas de CSS subieron al sistema (§23 de `simh.css`):** `.sec-tit`, `.vacio`, el piso de
  foco, `.cartera`/`.cart-item` y `.req-item`. Las compartían Administración y tres de los cuatro
  módulos nuevos; copiarlas cuatro veces era tener cuatro definiciones que mantener.
- **Tres iconos nuevos en `simh.js`:** libro abierto para Revalidación, credencial para Documentación
  y documento con sello para Constancias. Reutilizar el birrete de Capacitación en Revalidación
  habría hecho indistinguibles dos entradas contiguas, que es lo que el icono tiene que evitar.

`oficios.html` dejó de existir; `familiar.html` y `empleabilidad.html` apuntan ahora al módulo que
corresponde.

### 4.8 Correcciones técnicas ya aplicadas

- Barras horizontales sin relleno (`span` inline sin `display:block`).
- Iconos SVG sin dimensiones intrínsecas que se renderizaban a 300×150.
- Banderas emoji invisibles en Windows → insignias con código ISO.
- Orden del DOM de barra y menú corregido con `DocumentFragment`.
- Burbujas del mapa superpuestas en la costa → coordenadas separadas.
- El resumen del paso 6 mostraba campos de bloques no aplicables (NNA en persona adulta) → ahora
  omite lo que está oculto y formatea las fechas a dd/mm/aaaa.
- Nombre del expediente heredaba mayúsculas y color guinda de `h1` → se compone como nombre propio.
- Bolita de la ruta de atención y folio del listado eran `span` inline: la línea conectora cruzaba el
  texto y el folio se pegaba al nombre → `display:block` en ambos.
- El resumen del paso 6 salía vacío: el filtro que omite bloques no aplicables descartaba los paneles
  completos, porque en el paso 6 los pasos 2, 3 y 5 están ocultos. Ahora solo omite lo oculto
  **dentro** del panel, no el panel mismo.
- En `capacitacion.html` la columna `1fr` del grid maestro-detalle no encogía y la tabla de
  participantes desbordaba la página, cortando la columna de acciones. Es el mismo defecto del
  listado de expedientes: se corrigió con `minmax(0,1fr)` más `min-width:0` en los hijos del grid,
  y además se acortaron las etiquetas de documentación a `CURP` / `COMAR` y se eliminó la columna
  *Expediente* llevando el enlace al nombre de la persona.
- `.aviso strong{display:block}` convierte en bloque **todo** `<strong>` dentro de un aviso: el
  texto del aviso de permisos salía partido en seis renglones. El énfasis interno de un aviso va
  en `<b>`; el `<strong>` inicial se reserva para el título del aviso.
- Concordancia de verbo en los textos generados: `plural()` solo declinaba el sustantivo y
  producía "faltan 1 persona" o "caben 1 persona". Se agregaron ayudantes `faltan()`, `quedan()`
  y el caso singular de "cabe".
- En `empleabilidad.html` la tabla del historial volvió a desbordar y a cortar la columna de
  acciones —el mismo defecto del listado de expedientes y de `capacitacion.html`, ahora con seis
  columnas—. La corrección definitiva es `table-layout:fixed` con `<colgroup>` de anchos declarados,
  `word-break:break-word` en las celdas y `white-space:normal` en los encabezados. Ojo con `.btn`:
  trae `white-space:nowrap`, así que dentro de una celda estrecha hay que anularlo o la tabla
  desborda otra vez por el botón.
- **Colisión de nombres de clase con el sistema de diseño:** la clase local `.opc` (tarjeta de opción)
  pisaba la `.opc` de `simh.css`, que compone el "(opcional)" de las etiquetas de campo, y convertía
  esa palabra en una caja con borde debajo del rótulo. Se renombró a `.opcion`. Antes de nombrar una
  clase local conviene comprobar que no exista ya en `simh.css`.
- `.hero` trae `justify-content:center`: dentro de una rejilla `g-hero` la tarjeta se estira a la
  altura de su vecina y la cifra queda flotando en medio de un hueco. Se corrige con `align-self:start`.
- El panel de marca del login salía vacío y el video aparecía como una caja con márgenes: la regla
  `.login-marca > *{position:relative}` alcanzaba también al `<video>` y al velo y les quitaba el
  `position:absolute`, así que el video pasaba a ser un elemento de flujo y con `height:100%` empujaba
  todo el texto fuera de la pantalla. La regla se acotó a las tres clases de contenido.

---

## 5. Lo que falta

### 5.1 Pantallas pendientes

**No queda ninguna.** Las catorce pantallas del guion están construidas y todas las entradas del
menú lateral resuelven. RF10 y RF11 se reparten entre los cuatro módulos de documentos
(`canalizaciones`, `revalidacion`, `documentacion` y `constancias`), como se explica en §4.21.

Lo que sigue no son pantallas nuevas sino pasadas de revisión sobre lo construido:

| Prioridad | Qué | Por qué |
|---|---|---|
| Alta | Repasar `expedientes.html` y `expediente-detalle.html` con el piso de accesibilidad de §4.15 | Son las dos pantallas que quedan de antes de esa revisión: no tienen el piso de 12.5 px, el área táctil de 44 px ni el estado con glifo + palabra. `index.html` ya se rehízo en §4.20 |
| Alta | Llevar el filtro por municipio a `expedientes.html`, `salud.html` y `empleabilidad.html` | El Panel y Capacitación ya filtran por municipio (§4.20); las carteras de las demás direcciones todavía no, y es el mismo corte |
| Media | Enlazar el registro de oficios desde Salud, Empleabilidad y el detalle de expediente | Hoy el enlace existe solo desde el Expediente Familiar; el oficio se emite en un módulo y se sigue en otro |
| Media | Unificar el nombre del sistema (SIMH / SIAMH) antes de presentar | §5.3 |

### 5.2 Dependencias externas

- **Isotipo en vector.** El usuario ya entregó la identidad en PNG y está aplicada en el login y el
  favicon (§4.11). Falta el **SVG o el vector original** para poder usar la marca real en la barra
  superior: el PNG ilustrativo no es legible a 38 px, así que el chrome sigue con la reconstrucción
  geométrica de `SIMH.isotipo()`.
- **Tipografías con licencia** Novecento Wide y Gilroy.
- **GeoJSON municipal** si se requiere un mapa preciso en lugar del esquemático.

### 5.3 Decisiones por confirmar con la Dirección

- **Nombre del sistema: hay dos en uso.** El prototipo dice *SIMH — Sistema Integral de Movilidad
  Humana*, pero la identidad entregada por el usuario dice *SIAMH — Sistema de Monitoreo y Gestión
  para Personas en Contexto de Movilidad*. Hoy el login muestra el lockup entregado y el resto de las
  pantallas dicen SIMH. Hay que unificar antes de presentar.
- Si el panel debe restringir cifras por municipio según el rol del usuario.
- **Si la constancia se imprime en formato credencial o en hoja carta.** `constancias.html` ya permite
  decidirlo mirando: dibuja el gafete a tamaño real (54 × 86 mm) y la hoja carta al 50 %, y las dos
  se imprimen de verdad al tamaño correcto. Falta que la Dirección elija una, porque el texto legal
  cabe completo en carta y recortado en gafete.
- **Cuánto dura la vigencia de una constancia.** El prototipo asume doce meses desde la emisión y lo
  imprime en el documento. Si la Dirección decide otra cosa, es un solo cambio en `vigencia()`.
- **Quién firma cada plantilla de oficio.** El prototipo asume que toda firma es del Director de
  Área. Si la comunicación institucional de otra dirección la firma su propia titular, hay que
  declararlo por plantilla.
- **Si la numeración automática debe incluir el municipio.** El apunte de la Dirección decía que el
  automático «vaya muy general para los oficios para los municipios». Se leyó como que la serie del
  SIMH sigue siendo general (`SFS/####/2026`) y que el municipio captura la suya aparte, en el campo
  *folio de la dependencia*. Si lo que se quería es una serie por municipio (`SFS/TAP/####/2026`),
  el cambio es de una línea, pero hay que decidirlo antes de que existan folios reales.
- **Cuántos días vale una constancia de la COMAR.** El alta asume 30 días de vigencia y lo calcula
  contra la fecha capturada. Confirmar el plazo real.
- **Si la presunción de minoría de edad se aplica también con edad declarada sin documento.** Hoy el
  prototipo la aplica solo cuando el intervalo de edad cruza los 18. Con una edad declarada de 17 o
  18 exactos no hay intervalo, y ahí la regla podría ser más protectora.
- Si el paso de verificación de duplicados debe ser bloqueante (no permitir alta si hay coincidencia)
  o solo informativo, como está hoy.

---

## 6. Bitácora de correcciones solicitadas

| # | Fecha | Pantalla / archivo | Corrección solicitada | Estado | Nota |
|---|---|---|---|---|---|
| 1 | 24/08/2026 | `index.html`, `assets/css/simh.css`, `assets/js/simh.js` | Letras demasiado grandes y diseño saturado en el dashboard; investigar buenas prácticas. | **Aplicado** | Ver 4.1, 4.2 y 4.4. Escala reducida, color contenido, dona sustituida, paleta de datos validada con el script. |
| 2 | 24/08/2026 | `registro.html` | Hacer funcional la navegación del alta de persona y analizar si al flujo le falta algo. | **Aplicado** | Ver 4.5. Asistente navegable de 6 pasos con validación, ramificación NNA, revisión y pantalla de éxito. |
| 3 | 24/08/2026 | `registro.html` | Al terminar un registro debe poder seguirse capturando altas: falta “agregar nuevo registro” que continúe con la siguiente sección. | **Aplicado** | Ver 4.7. Acción primaria “Registrar otra persona” más “Registrar acompañante” (hereda movilidad y grupo familiar), con aviso del folio guardado y contador de altas de la sesión. |
| 4 | 24/08/2026 | `expedientes.html`, `expediente-detalle.html` | Continuar con las pantallas de expediente aplicando buenas prácticas de diseño. | **Aplicado** | Ver 4.9. Listado rehecho (folio en la celda de persona, chips neutros, filtros progresivos) y detalle nuevo con siete pestañas, ruta de atención, bitácora con compositor y permisos visibles. |
| 5 | 24/08/2026 | `familiar.html` | Continuar con el expediente familiar con buenas prácticas de diseño. | **Aplicado** | Ver 4.10. Maestro-detalle de grupos, aviso de oficio a la Procuraduría al frente, reasignación de titular con motivo y regla de NNA no acompañados, alta de integrantes con clasificación automática. |
| 6 | 24/08/2026 | `registro.html` | Falta en el alta el campo de bitácora u observaciones que solicitó la Dirección. | **Aplicado** | Bloque “Observaciones de la ventanilla” en el paso 6, con tipo de nota y contador; se guarda como primera nota de la bitácora del expediente (RF08). De paso se corrigió un bug que dejaba vacío el resumen del paso 6. |
| 7 | 25/08/2026 | `login.html`, `assets/css/simh.css`, `assets/js/simh.js`, `assets/img/`, `assets/video/` | Mejorar el diseño del login con buenas prácticas; usar las imágenes de identidad entregadas; permitir cerrar sesión y volver al login; y valorar un video de fondo en la columna izquierda. | **Aplicado** | Ver 4.11. Login rehecho (formulario real, región única de error, aviso de Bloq Mayús, ojo de contraseña accesible); lockup en la columna clara e isotipo como textura en la oscura, ambos optimizados de 2.5 MB a 0.45 MB; favicon en las seis pantallas. **El video sí quedó bien y se dejó**: bucle propio de 12 s generado con `ffmpeg`, con velo de contraste, poster de respaldo y `prefers-reduced-motion`. Menú de cuenta con Cerrar sesión en la barra superior de todas las pantallas. |
| 8 | 25/08/2026 | `salud.html` | Continuar con el diseño de la pantalla de salud y vulnerabilidad. | **Aplicado** | Ver 4.12. Se resolvió como cartera de trabajo maestro-detalle ordenada por urgencia, con marcadores de vulnerabilidad que declaran su ruta y plazo, catálogo OMS plegable con buscador, condiciones como registro con estado y fecha (no como casilla), y canalización con vista previa del oficio en vivo que nace en borrador pendiente de firma. |
| 9 | 27/08/2026 | `capacitacion.html` | Continuar con la generación de la siguiente pantalla pendiente (Capacitación · Grupos ICATECH). | **Aplicado** | Ver 4.13. Cartera de grupos ordenada por urgencia con detalle de conformación; medidor de cupo por casillas en vez de dona; proporción como magnitud contra umbral del 50% (sin introducir color nuevo); predicción del efecto de cada alta antes de confirmarla; asistencia juzgada por lo alcanzable y no por el porcentaje del día; pase de lista como modo de la misma tabla; baja con motivo en lugar de eliminar (RNF03); acreditación declarada como competencia de ICATECH (RNF02). |
| 10 | 27/08/2026 | `empleabilidad.html` | Generar la pantalla de empleabilidad con las mejores prácticas de diseño y programación. | **Aplicado** | Ver 4.14. Cartera maestro-detalle ordenada por vencimiento en vez de tarjetas KPI; los hitos de 15 y 30 días pasaron de ser dos chips de estado a **registros** con fecha, medio, resultado y responsable, con consecuencia declarada antes de confirmar; "Contratación Sí/No" sustituido por la **etapa** de la vinculación; el reloj arranca en la fecha de inicio de labores y hay estado propio para *contratada sin fecha de inicio*; requisitos que impiden **firmar** y no postularse, con RFC y NSS como opcionales al inicio y "No aplica" para persona mexicana; motivos de catálogo, nada se elimina (RNF03); Salud bloqueada desde este módulo (RNF01) y constancia de colocación reservada al Enlace de Vinculación (RNF02). Se agregó el paso *agendar entrevista*, que faltaba en el guion y dejaba el flujo sin salida. |
| 11 | 27/08/2026 | `empleabilidad.html`, `assets/css/simh.css` | La pantalla de empleabilidad no parece accesible y se siente confusa y muy compleja; mejorarla analizando bien los requisitos. | **Aplicado** | Ver 4.15. El análisis de RF12 se sostiene, el problema era que la pantalla mostraba **todo el análisis a la vez**: siete bloques abiertos (~2 000 px), el mismo vencimiento dicho tres veces con dos botones idénticos y ~120 palabras de texto normativo fijas. Ahora hay **pestañas** (Seguimiento · Vinculaciones · Requisitos y perfil) con la cabecera y **una sola barra de acción** siempre visible, y ~1 100 px de alto. Accesibilidad: el estado de los hitos pasó de dos puntos de color a pastillas con **glifo + palabra + color**; el token `--gris-claro` subió de `#8C8C8C` (2.87:1 sobre el fondo de página, **reprueba AA**) a `#6A6A6A`, lo que corrige las nueve pantallas; piso de 12.5 px y área táctil de 44 px; la cartera pasó de `aria-pressed` a `role="listbox"`; foco y anuncio `role="status"` tras cada repintado; nueva utilidad `.sr-solo`. Se corrigió además el desbordamiento de la tabla (seis columnas → cuatro; el chip de etapa se encimaba con el resultado). |
| 12 | 27/08/2026 | `censo.html` (nuevo), `assets/js/simh.js`, `assets/css/simh.css` | Continuar con la pantalla de Censo Empresarial. | **Aplicado** | Ver 4.16. Es la única pantalla móvil del sistema: se presenta el teléfono enmarcado con un panel de revisión que conmuta los dos estados de conexión, y por debajo de 900 px el marco desaparece y la interfaz ocupa toda la ventana. Del guion se corrigieron cinco cosas: los diez campos seguidos pasaron a tres secciones con **guardado incompleto** desde el principio (la entrevista se interrumpe); "Contrata personas en movilidad (Sí/No)" dejó de ser el octavo campo y de colapsar "no contrata" con "no quiso responder" — ahora es sección propia con cuatro respuestas y **motivo de catálogo**, que es el hallazgo de política pública del censo; "vacantes" pasó de número suelto a renglones de puesto y plazas, que sí alimentan RF12; el chip de conexión se volvió un bloque que dice dónde están los datos y cuándo salen; y el botón "SINCRONIZAR AHORA" desactivado se eliminó (sin red se enuncia la regla, con red aparece el botón real). El contador de pendientes se deriva de los datos en vez del "14" fijo del guion, y el botón de envío dice el número que de verdad va a mandar, porque un registro incompleto no se envía. De paso se corrigió el **chrome en pantalla angosta**: la ficha de usuario se salía del borde (`right=483` en 481 px, invisible a `scrollWidth` por ser `position:fixed`) y el menú lateral se ocultaba sin nada que lo abriera, así que en un teléfono no había forma de navegar; se agregó el botón de menú con velo y la barra se colapsa a isotipo + menú + avatar. |
| 13 | 27/08/2026 | `administracion.html` (nuevo) | Continuar con la parte de administración (oficios y constancias quedan pendientes). | **Aplicado** | Ver 4.17. Dos pestañas: usuarios y permisos, y bitácora de auditoría. Cuatro correcciones al guion: (1) la matriz traía una columna **"Eliminar"** que contradice RNF03 y que, más que un error de redacción, legitima una acción que no existe — se sustituyó por **Cerrar**, y una cuenta tampoco se elimina, se suspende; (2) las casillas por usuario pasaron a ser la matriz **del rol**, con las concesiones individuales como **excepción con oficio, motivo y vigencia**, que es lo que exige RNF02; (3) el aislamiento entre direcciones dejó de ser una frase en un aviso y se ve en la matriz como filas bloqueadas con su leyenda (RNF01), con candado neutro y no guinda porque no es un permiso que pueda pedirse; (4) la bitácora se busca por folio afectado, cada edición muestra **antes → después**, y los **intentos denegados también se registran** — un control que no deja rastro de lo que impidió no demuestra nada. Seis estados de celda en vez de dos, distinguiendo "no concedido" de "no aplica". La matriz va a ancho completo y no en panel lateral, porque nueve módulos por cinco acciones no caben en 380 px. |
| 14 | 28/08/2026 | `oficios.html` (nuevo), `familiar.html`, `administracion.html`, `salud.html`, `empleabilidad.html`, `assets/css/simh.css` | Hacer la pantalla de oficios y constancias aplicando la calidad de programación que se ha venido trabajando. | **Aplicado** | Ver 4.18. Las dos pantallas del guion (RF10 y RF11) quedaron como dos pestañas de un solo archivo, porque el menú tiene una sola entrada y los dos documentos comparten serie, firma y bitácora. Siete correcciones al guion: (1) el cuerpo editable con `{{variables}}` a la vista se sustituyó por un cuerpo armado desde el expediente, con los datos tomados de ahí **marcados** en la vista previa —lo que hay que ver no es la sintaxis, es qué no se escribió a mano—; (2) el folio ya no se asigna al abrir el borrador sino **al firmar**, porque un borrador abandonado dejaría un hueco en la serie consecutiva, y la hoja lleva sello de estado para que un borrador no se vea igual que un oficio firmado; (3) los tres botones al mismo nivel pasaron a **una acción principal por estado**, y desapareció el «Generar PDF» previo a la firma, que permitía circular un folio real sin firmar; (4) la pantalla dejó de ser solo un compositor y es el **registro** de la serie: las plantillas cuyo dato vive en Salud, Expediente Familiar o Empleabilidad no se capturan aquí, se enuncia dónde se emiten y se enlaza; (5) se agregó el **acuse de recibo** como estado propio con fecha esperada, que es el riesgo real de operación; (6) «Formato: Imprimible / Digital» se sustituyó por el **soporte** —gafete de 54 × 86 mm a tamaño real u hoja carta al 50 %, dibujados en milímetros y con impresión real de una sola página— que es la decisión abierta de §5.3 y ahora se decide mirando; (7) la constancia declara **qué no es** (no es documento migratorio) y lleva la vía de verificación que sustituye al QR, más el recuadro de sello que el pie prometía y la hoja no tenía. Los permisos no se inventaron: se leyeron de la matriz de Administración, y por eso el botón de exportar no se dibuja y la firma se enuncia como acto del Director de Área. De paso se saldó deuda: tres componentes locales subieron a `simh.css` (§20 `.filtros-fila`, §21 `.accion`, §22 `.oficio-hoja`), el folio `SFS/0912/2026` que estaba usado dos veces se separó, y el oficio a la Procuraduría de `familiar.html` dejó de nacer con folio para seguir la misma regla que Salud. |

| 15 | 28/08/2026 | `oficios.html`, `index.html`, `registro.html`, `familiar.html`, `capacitacion.html`, `empleabilidad.html`, `administracion.html`, `login.html`, `assets/css/simh.css`, `assets/js/simh.js` | Aplicar el documento de mejoras de la Dirección (`DOCUMENTO DE MEJORAS DE SIAMH.docx`), agregar las pestañas nuevas y poder desplazar o cerrar el menú para mejorar la experiencia de uso. | **Aplicado** | Ver 4.19 y 4.20. **UX:** el menú lateral se contrae a un riel de 66 px que devuelve 178 px al contenido y conserva el sitio de cada entrada, con etiqueta flotante al pasar el ratón y **también al enfocar con el teclado**, y la preferencia se recuerda; por debajo de 900 px el mismo botón sigue abriendo el cajón. **Pestañas nuevas:** el módulo pasó a llamarse *Canalizaciones y Documentos* y ahora tiene cuatro pestañas, con *Revalidación de estudios* y *Documentación e identidad*. Correcciones de fondo: la **educación básica no se revalida** —se inscribe—, así que la pestaña registra la **negativa de atención** en vez de pedir requisitos que no existen; la matriz de documentación separa los faltantes que **detienen un trámite** de los que no, porque el comprobante de domicilio es el que más falta y no impide nada; la constancia de la COMAR lleva su **número de registro**. El **folio del municipio** convive con la serie del SIMH sin romperla. En el alta, las **fechas admiten precisión** (mes, año o edad declarada) y cuando el intervalo cruza los 18 rige la **presunción de minoría de edad**. El catálogo de parentesco quedó **solo directo**, que es lo que explica por qué un NNA está separado. El **panel filtra de verdad por municipio** y «Todos» es la suma de los seis, no una fila más. Empleabilidad muestra la **marca de acompañamiento** en la cabecera; Capacitación filtra los cursos **por municipio**; la cuenta de acceso se ve y **no es un correo**; y el login subió de brillo concentrando el velo en la banda del texto. |

| 16 | 28/08/2026 | `canalizaciones.html`, `revalidacion.html`, `documentacion.html`, `constancias.html` (nuevos), `assets/js/simh-datos.js` (nuevo), `assets/js/simh.js`, `assets/css/simh.css`, `familiar.html`, `empleabilidad.html`, `administracion.html` | Las pestañas eran módulos independientes, como los otros. | **Aplicado** | Ver 4.21. «OTRA PESTAÑA» del documento de la Dirección quería decir otro **módulo**, no una pestaña dentro de una pantalla: `oficios.html` se separó en cuatro archivos con cuatro entradas de menú y tres iconos nuevos. El contenido de §4.20 se conserva entero. La corrección no es cosmética: en la matriz de permisos **una pestaña no se puede conceder ni negar**, así que la fila única pasó a cuatro y cada una dice algo distinto —Documentación no tiene *Crear* y Constancias no tiene *Editar*, porque una constancia emitida no se corrige, se reemite con motivo—. Para separarlos hizo falta un módulo de datos compartido (`simh-datos.js`) con el reloj, los permisos y el catálogo de personas: cuatro copias del mismo catálogo serían cuatro sitios donde una edad o un folio pueden dejar de coincidir. Lo que era cambiar de pestaña ahora es navegación que conserva el contexto: «Reclamar por oficio» llega al compositor con el hecho citado y el destinatario puesto. Cinco piezas de CSS subieron a `simh.css` §23. |

---

## 7. Cómo retomar el trabajo

1. Abrir `index.html` para ver el panel y `registro.html` para recorrer el alta completa.
2. Si se va a usar Stitch, reiniciar la sesión de Claude Code para que carguen sus herramientas.
3. Toda pantalla nueva debe: reutilizar `assets/css/simh.css`, llamar a `SIMH.chrome("<id-menú>")`,
   respetar las reglas de color de datos de la sección 4.2 y **verificarse con una captura** antes de
   darse por terminada.
4. Si un componente local va a tener un segundo consumidor, **sube a `simh.css`** y la pantalla de
   origen queda con un comentario que apunta a la sección; después hay que volver a renderizar las
   pantallas de origen para comprobar que nada cambió.
5. Los datos ficticios se cruzan entre pantallas (folios, CURP, nombres, oficios). Antes de inventar
   uno nuevo conviene buscarlo: dos documentos con el mismo folio o dos edades distintas para la
   misma persona son el tipo de error que se nota justo en la demostración.
