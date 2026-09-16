# SIAMH · Prototipo de diseño

**Sistema Integral de Atención a la Movilidad Humana**
Secretaría de la Frontera Sur · Gobierno de Chiapas 2024–2030

Prototipo de interfaz en HTML, CSS y JavaScript **sin dependencias ni servidor**: se abre
haciendo doble clic en `Prototipo/index.html` (o `Prototipo/login.html` para entrar por el
inicio de sesión). No hay que instalar nada, ni `npm`, ni levantar un servidor local.

---

## Cómo revisarlo

1. Descarga o clona el repositorio.
2. Abre `Prototipo/login.html` en Edge o Chrome.
3. Desde el menú lateral se llega a los quince módulos.

Cada pantalla tiene **atajos por URL** para abrir directamente el caso que interesa mostrar
(por ejemplo `empleabilidad.html?e=0412` abre el caso con la verificación de 30 días vencida).
La lista completa está en `Prototipo/AVANCES.md`, sección 2.

---

## Dónde está documentado el trabajo

| Archivo | Qué contiene |
|---|---|
| `Prototipo/AVANCES.md` | **La bitácora completa.** Qué se construyó, por qué se decidió así, qué quedó pendiente y qué puntos hay que confirmar con la Dirección. Es el documento que hay que leer antes de tocar código. |
| `SIAMH_Especificacion_de_Mejoras_y_Requerimientos.docx` | Los 21 requerimientos que pidió la Dirección el 15/09/2026, en cinco módulos más la regla transversal de los campos 'Otro'. |
| `SIAMH_Estado_de_Requerimientos_15-09-2026.pdf` | Estado de cada requerimiento a esa fecha. |
| `Prototipo/Primera direcccion.pdf` | SRS v3.0: RF01–RF15 y RNF01–RNF06. Es lo que manda en el diseño. |
| `Prototipo/segunda direccion.pdf` | Documento maestro de la Dirección de Capacitación y Empleo: modelo de datos y entidades. |
| `Prototipo/manual-identidad-humanismo.pdf` | Identidad visual obligatoria (RNF05). |

---

## Última entrega · 15/09/2026

Se aplicaron los **bloques 1 a 3** de los siete en que se ordenó el documento de mejoras.
El detalle razonado está en `AVANCES.md` §4.22; aquí va el resumen.

### Regla transversal de los campos 'Otro' (§3 del documento)

Al elegir *Otro* aparece un campo de texto obligatorio y en la base se guarda la clave `OTRO`
con el texto en un campo complementario. Se escribió **una sola vez** —`SIMH.activarOtro()`,
`valorOtro()`, `textoOtro()`, con marcado declarativo `data-otro`— en lugar de repetirla en los
siete campos que la usan. Los resúmenes muestran *"Otra · Mopán"* y no *"Otra"* a secas.

### Catálogos compartidos en `assets/js/simh-datos.js`

- **Países: de 8 a 50**, agrupados por región y con los siete de mayor flujo en la frontera sur
  al principio. El catálogo estaba escrito cuatro veces y ya no coincidía entre sí: una persona
  registrada como nicaragüense era **imposible de encontrar** por nacionalidad en Expedientes.
- **Escolaridad: un solo catálogo**, con la educación trunca explícita **por nivel**
  (`Secundaria trunca`, `Licenciatura trunca`, …). Eran dos listas incompatibles, y entre
  catálogos que no coinciden no puede haber autollenado.
- **Lenguas**: dejó de ser texto libre; ahora es catálogo con su opción 'Otra'.
- Etnias, motivos de migración, estatus migratorio (con *Por razones humanitarias* y *Con amparo*),
  sectores económicos y claves LADA.

### Escolaridad y situación laboral (requerimientos 2.1 y 2.2)

- La escolaridad se captura **una sola vez**: el **nivel** vive en el registro general y
  Empleabilidad solo lo **detalla** (área o especialidad, institución, año, documento que lo
  acredita). Corregirlo desde Empleabilidad corrige el expediente único, no una copia.
- *"Situación laboral actual"* se separó en dos campos —**¿cuenta con empleo?** y **aspiración
  laboral**—. Mezclados, no se podía registrar a quien **sí tiene empleo y quiere cambiarlo**,
  que es la mitad de la cartera de RF12.

### Contacto y teléfono (requerimientos 1.6 y 1.7)

- El contacto se separó en **residencia** y **país de origen**, cada uno con su uso: al de
  residencia se le llama para una cita de la semana que entra; al de origen se le busca para
  localizar a la familia de un NNA, a veces meses después.
- El teléfono pasó a ser **componente** (`SIMH.activarTelefono`) con clave internacional,
  formato, almacenamiento en E.164 y una validación que dice **cuántos dígitos faltan o sobran
  para el país elegido**, en vez de un genérico "número inválido".

### Errores corregidos de paso

- El aviso del estatus migratorio estaba indexado por el texto de la opción y **habría pintado
  `undefined`** con los estatus nuevos.
- Tres personas tenían escolaridades que no existen en el catálogo; un `<select>` sin
  coincidencia cae en la primera opción, así que un técnico en soldadura con catorce años de
  oficio aparecía como **"Sin instrucción formal"**.
- `nuevaAlta()` limpiaba el teléfono por un selector que este mismo cambio renombró: habría
  heredado el número de la persona anterior al siguiente expediente **en silencio**.
- Dos desbordes de layout detectados en la captura de pantalla obligatoria, y un resumen que
  mostraba el `value` interno de los `<select>` (*"dia"*, *"aprox"*) en vez de su etiqueta.

### Verificación

Sintaxis de los `<script>` embebidos de las quince páginas, captura de pantalla de cada pantalla
tocada y un banco de **40 pruebas sobre el DOM real** (regla de 'Otro', registro compartido de
escolaridad y componente de teléfono). Las 40 pasan.

---

## Lo que sigue

En orden, porque cada paso destraba al siguiente. El detalle está en `AVANCES.md` §5.4.

| Orden | Requerimiento |
|---|---|
| 4 | Separar Capacitación de Empleabilidad (3.1) y regla de examen / 3 asistencias (3.2) |
| 5 | Solicitud de Empleo: formulario, generación y previsualización (2.3–2.5) y carga de documentos (2.6) |
| 6 | Aviso de Privacidad automatizado (4.1) y depuración del historial telefónico (4.2) |
| 7 | Captura multimedia y previsualización de foto (5.1, 5.2) — la cámara web queda **solo declarada**: `getUserMedia` no funciona con `file://` |

### Puntos abiertos que hay que confirmar con la Dirección

- Quitar las tachaduras del historial telefónico (4.2) **contradice RF03**, que pide conservar
  los números anteriores con su vigencia. Se leyó como cambio de presentación, no de datos.
- La regla de **3 asistencias sin examen** (3.2) convive con el **80 % de asistencia** vigente.
  Se asumen rutas alternas; hace falta incorporar el concepto de examen al modelo de grupo.
- **Dos poblaciones distintas comparten los mismos números de expediente**: el `0412` de
  Empleabilidad y `SIAMH-2026-TAP-0412` no son la misma persona. Hay que unificar la numeración
  antes del requerimiento 2.6.

---

## Estructura

```
Prototipo/
├── index.html              Tablero de gráficas estadísticas (RF14)
├── login.html              Inicio de sesión
├── registro.html           Alta de expediente, 6 pasos
├── expedientes.html        Búsqueda y filtros
├── expediente-detalle.html Expediente único
├── familiar.html           Expediente familiar
├── salud.html              Módulo de salud
├── capacitacion.html       Grupos ICATECH
├── empleabilidad.html      Diagnóstico laboral y vinculación
├── censo.html              Captura en campo, sin conexión
├── canalizaciones.html     Oficios de canalización
├── revalidacion.html       Revalidación de estudios
├── documentacion.html      Documentación migratoria
├── constancias.html        Emisión de constancias
├── administracion.html     Usuarios, permisos y bitácora
└── assets/
    ├── css/simh.css        Hoja de estilo única
    ├── js/simh.js          Componentes y utilidades compartidas
    ├── js/simh-datos.js    Catálogos, permisos y datos de demostración
    └── img/ · video/
```

Todo el JavaScript es de navegador, sin módulos ni empaquetador. Los datos son de demostración
y viven en `simh-datos.js`.
