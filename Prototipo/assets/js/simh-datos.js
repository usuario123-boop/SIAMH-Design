/* ============================================================================
   SIMH · Datos compartidos del prototipo
   ----------------------------------------------------------------------------
   Los cuatro módulos de documentos —Canalizaciones, Revalidación de Estudios,
   Documentación e Identidad y Constancias— trabajan sobre LAS MISMAS personas.
   Cada pantalla del prototipo es autónoma y lleva sus datos dentro, pero
   cuatro copias del mismo catálogo son cuatro sitios donde una edad, una CURP
   o un folio pueden dejar de coincidir, y eso es exactamente el error que se
   nota en una demostración. El catálogo y el reloj viven aquí.

   Aquí NO va el sistema de diseño (eso es simh.js) ni datos de una sola
   pantalla: los oficios viven en Canalizaciones, los casos de revalidación en
   Revalidación, y así.
   ========================================================================= */
(function (global) {
  "use strict";

  /* ------------------------------------------------- Reloj del prototipo --
     Fecha fija, un día después de la última pantalla (Administración quedó en
     27/08/2026). `dt` parsea a mano porque `new Date("2026-08-28")` se
     interpreta como UTC y `new Date("2026-08-28T11:20")` como local: mezclar
     las dos formas desplaza las diferencias el huso horario completo.      */
  var HOY = "2026-08-28 11:20";

  function dt(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/.exec(s);
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  }
  function fecha(s) {
    var d = dt(s);
    return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) +
           "/" + d.getFullYear();
  }
  function hora(s) { return s.slice(11, 16); }
  function fechaHora(s) { return fecha(s) + " · " + hora(s); }
  function horas(s) { return (dt(s) - dt(HOY)) / 3600000; }
  function dias(s) {
    var a = dt(s), b = dt(HOY);
    a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
    return Math.round((a - b) / 86400000);
  }
  function horasTxt(h) {
    if (h < 1) return Math.max(1, Math.round(h * 60)) + " min";
    return Math.round(h) + (Math.round(h) === 1 ? " hora" : " horas");
  }
  function edad(nac) {
    var n = dt(nac), h = dt(HOY), e = h.getFullYear() - n.getFullYear();
    var m = h.getMonth() - n.getMonth();
    if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--;
    return e;
  }
  function plural(n, s, p) { return n + " " + (n === 1 ? s : p); }

  /* ---------------------------------------------------- Quién opera -------
     El chrome inicia sesión como María Gómez Pérez, Capturista Municipal. Sus
     permisos no se inventan en cada pantalla: son los que calcula la matriz de
     `administracion.html` para los módulos de documentos —ver · crear ·
     editar con oficio · sin exportar—. De ahí salen tres consecuencias:
       · sí puede redactar y mandar a firma;
       · NO puede firmar — la firma no es una casilla de la matriz, es un acto
         del Director de Área (RNF02);
       · NO puede exportar, así que ese botón no se dibuja. Un botón apagado
         con su explicación ocupa el lugar de la acción sin poder hacerla.
     Registrar un acuse sí procede: no modifica el oficio, agrega un hecho
     sobre él, y eso es `crear`.                                            */
  /* Desde el 22/09/2026 quien opera sale de la sesión del chrome
     (`SIMH.sesion()`), y los permisos se derivan del rol con la misma regla
     de la matriz: solo el Director de Área firma; la ventanilla no exporta. */
  var SES = (global.SIMH && global.SIMH.sesion) ? global.SIMH.sesion()
          : { n:"María Gómez Pérez", rolT:"Capturista Municipal", mun:"Tapachula", rol:"capturista" };
  var YO = {
    n: SES.n,
    rol: SES.rolT,
    mun: SES.mun,
    puedeCrear: true,
    puedeFirmar: SES.rol === "director",
    puedeExportar: SES.rol !== "capturista"
  };

  var DIRECTOR = { n: "Dr. Luis A. Ramírez Toledo", cargo: "Director de Atención y Salud" };

  /* ------------------------------------------------------- Personas -------
     Los mismos folios, nombres y CURP que Salud y Expediente Familiar.
     Ninguna edad está escrita a mano: sale de la fecha de nacimiento contra
     el reloj del prototipo.                                                */
  var PERS = [
    { f:"SIAMH-2026-TAP-0412", n:"Yolanda Esperanza Martínez Cruz", ini:"YM", pais:"Honduras",
      nac:"1994-03-18", curp:"MACY940318MCSRRL07", reg:"2026-08-20", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:true, grupo:"SIAMH-FAM-2026-0341",
      emis:[
        { fol:"CR-0731/2026", t:"2026-08-20 12:40", mot:"Primera emisión", sop:"gafete",
          por:"María Gómez Pérez" },
        { fol:"CR-0768/2026", t:"2026-08-27 16:05", mot:"Reposición por extravío", sop:"gafete",
          por:"María Gómez Pérez" }
      ] },

    { f:"SIAMH-2026-TAP-0410", n:"Keiner Alexander Rojas Mora", ini:"KR", pais:"Venezuela",
      nac:"2010-07-22", curp:"ROMK100722HNEXXX03", reg:"2026-08-22", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:false, grupo:"SIAMH-FAM-2026-0338",
      nna:"Separado", tutor:"Marisol Rojas Peña · titular del grupo familiar", emis:[] },

    { f:"SIAMH-2026-SUC-0177", n:"Marta Lucía Xicoténcatl Pérez", ini:"MX", pais:"Guatemala",
      nac:"1985-02-14", curp:"XIPM850214MNEXXX07", reg:"2026-08-18", mun:"Suchiate",
      cap:"Ing. Rubén Castellanos Díaz", est:"activo", foto:true, grupo:"SIAMH-FAM-2026-0332",
      emis:[
        { fol:"CR-0702/2026", t:"2026-08-18 10:15", mot:"Primera emisión", sop:"gafete",
          por:"Ing. Rubén Castellanos Díaz" }
      ] },

    { f:"SIAMH-2026-FCO-0094", n:"Yamilé Rodríguez Betancourt", ini:"YR", pais:"Cuba",
      nac:"1997-07-12", curp:"ROBY970712MNEXXX04", reg:"2026-08-14", mun:"F. Comalapa",
      cap:"María Gómez Pérez", est:"activo", foto:true, grupo:"—",
      emis:[
        { fol:"CR-0664/2026", t:"2026-08-14 09:50", mot:"Primera emisión", sop:"carta",
          por:"María Gómez Pérez" }
      ] },

    { f:"SIAMH-2026-TAP-0411", n:"Jean-Baptiste Pierre Louis", ini:"JP", pais:"Haití",
      nac:"1999-01-18", curp:"PILJ990118HNEXXX05", reg:"2026-08-21", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:false, grupo:"—", emis:[] },

    { f:"SIAMH-2026-TAP-0408", n:"Wilmer Josué Aguilar Paz", ini:"WA", pais:"Honduras",
      nac:"2017-02-03", curp:"AUPW170203HNEXXX06", reg:"2026-08-20", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:true, grupo:"SIAMH-FAM-2026-0341",
      nna:"Acompañado", tutor:"Yolanda Esperanza Martínez Cruz · titular del grupo familiar",
      emis:[
        { fol:"CR-0733/2026", t:"2026-08-20 12:52", mot:"Primera emisión", sop:"gafete",
          por:"María Gómez Pérez" }
      ] },

    /* Expediente cerrado: no se elimina nunca (RNF03), pero tampoco ampara
       una constancia vigente. Las pantallas lo dicen y dicen qué lo
       desbloquea, en vez de dibujar un botón apagado.                      */
    { f:"SIAMH-2026-HUI-0203", n:"Nery Estuardo Batz Cuc", ini:"NB", pais:"Guatemala",
      nac:"1991-11-09", curp:"BACN911109HNEXXX02", reg:"2026-08-02", mun:"Huixtla",
      cap:"Sofía Márquez Ruiz", est:"cerrado", cierre:"2026-08-24",
      cierreMot:"Retorno voluntario asistido", foto:true, grupo:"—",
      emis:[
        { fol:"CR-0588/2026", t:"2026-08-02 13:20", mot:"Primera emisión", sop:"gafete",
          por:"Sofía Márquez Ruiz" }
      ] }
  ];

  function persona(f) {
    return PERS.filter(function (p) { return p.f === f; })[0] || null;
  }
  function activos() {
    return PERS.filter(function (p) { return p.est === "activo"; });
  }
  /* Nombre corto para las barras de acción: "Keiner Alexander" y no el
     nombre completo, que en una frase se lee como una lista. */
  function corto(p) { return p.n.split(" ").slice(0, 2).join(" "); }

  /* ------------------------------------------ Revalidación de estudios --
     Los casos los trabaja `revalidacion.html`, pero `canalizaciones.html`
     los lee para citar la negativa que el oficio reclama: sin el hecho
     registrado no hay nada que reclamar. Por eso son datos de dos
     módulos y viven aquí.
     reclamar. Es el mismo criterio del intento denegado de la bitácora de
     Administración: un control que no deja rastro de lo que impidió no
     demuestra nada.
     ------------------------------------------------------------------ */
  /* El "principio de no revalidación en básica" se retiró de la interfaz y
     de la lógica por pedido de la Dirección (22/09/2026): los tres niveles
     se trabajan con la misma lista de cotejo, segmentada por tipo de
     escuela en `revalidacion.html`. */
  var NIVELES = {
    basica:  { t:"Educación básica · primaria y secundaria" },
    media:   { t:"Media superior · bachillerato" },
    superior:{ t:"Superior · licenciatura o técnico superior" }
  };

  /* Motivos de catálogo, redactados como los enuncia la norma que se
     incumple, para que el oficio pueda citarlos sin reescribirlos. */
  var MOT_NEG = [
    "Condicionan la inscripción a documentos que la norma no exige",
    "Se niegan a recibir la solicitud",
    "Exigen apostilla no exigible para el trámite solicitado",
    "Condicionan el trámite a un pago sin informar de la exención",
    "Argumentan falta de cupo sin darlo por escrito",
    "Piden acreditar situación migratoria regular"
  ];

  var REVAL = [
    { id:"r1", per:"SIAMH-2026-TAP-0408", nivel:"basica",
      destino:"Inscripción a 2.º de primaria en el ciclo en curso",
      inst:"Escuela Primaria Federal Belisario Domínguez · Tapachula",
      abierto:"2026-08-24", limite:"2026-09-01", limiteTxt:"Inicio del ciclo escolar",
      req:{ valora:"falta", acta:"falta", curp:"tramite", boletas:"na" },
      neg:[ { t:"2026-08-26 09:20", inst:"Escuela Primaria Federal Belisario Domínguez",
              motivo:"Condicionan la inscripción a documentos que la norma no exige",
              detalle:"La dirección del plantel pidió CURP y acta de nacimiento apostillada como " +
                      "condición para recibir la solicitud de inscripción.",
              hizo:"Se emitió oficio a la Secretaría de Educación del Estado.",
              oficio:"SFS/0944/2026" } ] },

    { id:"r2", per:"SIAMH-2026-TAP-0410", nivel:"media",
      destino:"Revalidación parcial de 1.º y 2.º de bachillerato",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-25", limite:"2026-09-15", limiteTxt:"Cierre de inscripciones extemporáneas",
      req:{ cert:"si", apost:"falta", trad:"na", ident:"si", curp:"si", pago:"tramite" },
      neg:[ { t:"2026-08-27 13:10", inst:"Secretaría de Educación del Estado",
              motivo:"Exigen apostilla no exigible para el trámite solicitado",
              detalle:"La ventanilla rechazó la solicitud de revalidación parcial por no traer el " +
                      "certificado apostillado, siendo que la parcial se resuelve por cotejo.",
              hizo:"", oficio:null } ] },

    { id:"r3", per:"SIAMH-2026-SUC-0177", nivel:"superior",
      destino:"Revalidación de licenciatura en enfermería para ejercer en Chiapas",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-19", limite:null, limiteTxt:"",
      req:{ cert:"si", plan:"si", apost:"si", trad:"tramite", ident:"si", curp:"si", pago:"falta" },
      neg:[] },

    { id:"r4", per:"SIAMH-2026-TAP-0411", nivel:"superior",
      destino:"Revalidación de estudios técnicos en construcción",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-22", limite:null, limiteTxt:"",
      req:{ cert:"si", plan:"falta", apost:"falta", trad:"falta", ident:"si", curp:"si", pago:"na" },
      neg:[] },

    { id:"r5", per:"SIAMH-2026-FCO-0094", nivel:"superior",
      destino:"Revalidación de licenciatura en contaduría",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-05", limite:null, limiteTxt:"", resuelto:"2026-08-24",
      req:{ cert:"si", plan:"si", apost:"si", trad:"si", ident:"si", curp:"si", pago:"si" },
      neg:[] }
  ];


  function negAbierta(c) {
    return c.neg.filter(function (x) { return !x.oficio; })[0] || null;
  }


  /* ======================================================== Catálogos ====
     Catálogos de captura compartidos por varias pantallas.

     Viven aquí por la misma razón que las personas: el catálogo de países
     estaba escrito cuatro veces —dos en el registro, una en el filtro de
     expedientes y otra en empleabilidad— y ampliarlo copiando y pegando es
     la forma más segura de que las cuatro copias dejen de coincidir. Una
     pantalla que ofrece "Nicaragua" en el alta y no la ofrece en el filtro
     es una persona que después no se puede volver a encontrar.

     Regla técnica de la opción 'Otro' (Especificación de Mejoras §3): la
     opción se emite con value="OTRO" y el texto que escribe la ventanilla
     viaja en un campo complementario. La clave es estable aunque la
     etiqueta cambie, que es lo que permite contar "Otro" en un informe sin
     depender de cómo esté redactada la opción en pantalla.
     ==================================================================== */

  /* ---------------------------------------------------------- Países ----
     Agrupados, y el primer grupo es el de mayor concurrencia en la frontera
     sur: en ventanilla casi todas las altas salen de esas siete opciones, y
     bajar cincuenta renglones para encontrar "Honduras" cuesta segundos en
     cada captura contra una meta de cinco minutos (RNF04).               */
  var PAISES = [
    { g:"Mayor flujo en la frontera sur",
      p:["Honduras", "Guatemala", "Venezuela", "Haití", "Cuba", "El Salvador", "Nicaragua"] },
    { g:"América",
      p:["Argentina", "Belice", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
         "Ecuador", "Estados Unidos", "México", "Panamá", "Paraguay", "Perú",
         "República Dominicana", "Uruguay"] },
    { g:"África",
      p:["Angola", "Camerún", "Congo", "Eritrea", "Ghana", "Guinea", "Mauritania",
         "Nigeria", "República Democrática del Congo", "Senegal", "Somalia", "Sudán"] },
    { g:"Asia",
      p:["Afganistán", "Bangladesh", "China", "India", "Irán", "Iraq", "Nepal",
         "Pakistán", "Siria", "Uzbekistán", "Vietnam", "Yemen"] },
    { g:"Europa",
      p:["Georgia", "Rusia", "Turquía", "Ucrania"] }
  ];

  /* Lista plana, para filtros y comparaciones que no necesitan los grupos. */
  function paisesPlanos() {
    return PAISES.reduce(function (acc, g) { return acc.concat(g.p); }, []);
  }

  /* ----------------------------------------------------- Escolaridad ----
     Un solo catálogo para Registro y Empleabilidad. Antes eran dos listas
     incompatibles —cinco opciones sin truncas en el registro, nueve con
     truncas en empleabilidad—, y entre dos catálogos que no coinciden no
     puede haber autollenado: no hay a qué mapear "Secundaria".

     La especificación pide "Educación trunca" explícita. Se implementa por
     nivel y no como una opción suelta porque "trunca" sin decir de qué
     nivel no sirve para lo que la propia especificación quiere después:
     que Empleabilidad reciba la escolaridad precargada y la detalle.     */
  var ESCOLARIDAD = [
    "Sin instrucción formal",
    "Primaria trunca", "Primaria concluida",
    "Secundaria trunca", "Secundaria concluida",
    "Bachillerato trunco", "Bachillerato concluido",
    "Carrera técnica trunca", "Carrera técnica concluida",
    "Licenciatura trunca", "Licenciatura concluida",
    "Posgrado"
  ];

  /* ------------------------------------------------- Etnia y lengua -----
     La lengua deja de ser un campo de texto libre: escrita a mano, el mismo
     idioma entra como "creole", "criollo haitiano" y "kreyol", y después no
     hay forma de contar cuántas personas necesitan intérprete de esa lengua
     —que es justamente para lo que sirve el dato—.                       */
  var ETNIAS = [
    "No se autoadscribe",
    "Maya ch'ortí", "Maya k'iche'", "Maya mam", "Maya q'eqchi'", "Maya kaqchikel",
    "Tzeltal", "Tzotzil", "Ch'ol", "Tojolabal", "Zoque", "Mochó",
    "Garífuna", "Lenca", "Xinca", "Miskito", "Náhuatl", "Afrodescendiente"
  ];

  var LENGUAS = [
    "Español",
    "K'iche'", "Mam", "Q'eqchi'", "Kaqchikel", "Ch'ortí",
    "Tzeltal", "Tzotzil", "Ch'ol", "Tojolabal", "Zoque",
    "Créole haitiano", "Garífuna", "Miskito",
    "Francés", "Inglés", "Portugués",
    "Árabe", "Bengalí", "Hindi", "Mandarín", "Ruso", "Urdu", "Wolof"
  ];

  /* ------------------------------------------- Motivos de la migración --
     "Laboral" y "Motivos económicos" se parecen y son distintos: el primero
     es quien sale con una oferta o un oficio que ejercer, el segundo quien
     sale porque en origen no alcanza para vivir. La diferencia decide si el
     caso entra por vinculación directa o por capacitación, así que se
     capturan por separado aunque en el informe agregado terminen juntos. */
  var MOTIVOS_MIGRACION = [
    "Violencia",
    "Motivos económicos",
    "Laboral",
    "Reunificación familiar",
    "Desastre natural",
    "Persecución política"
  ];

  /* ------------------------------------------------ Estatus migratorio --
     Cada estatus carga su propia nota. Antes la nota vivía en un objeto
     indexado por el texto literal de la opción, dentro de registro.html:
     agregar una opción sin acordarse de ese objeto pintaba la palabra
     "undefined" en la pantalla. Con la nota pegada al dato eso no puede
     pasar, y es la razón por la que ambas cosas viajan juntas.           */
  var ESTATUS_MIGRATORIO = [
    { t:"Solicitante de refugio",
      n:"Requiere Constancia de Trámite COMAR vigente para inscribirse a cursos de " +
        "capacitación (RF13). La constancia se renueva cada 30 días." },
    { t:"Refugiado / Residente",
      n:"Adquiere los mismos derechos que una persona mexicana: sin restricción de " +
        "movilidad estatal." },
    { t:"Por razones humanitarias",
      n:"La Tarjeta de Visitante por Razones Humanitarias autoriza a trabajar en el país " +
        "y no restringe la movilidad estatal. Verifique su vigencia antes de formalizar " +
        "una contratación: vencida, la colocación no puede firmarse." },
    { t:"Con amparo",
      n:"Una suspensión otorgada por un juez federal protege a la persona mientras esté " +
        "vigente: no puede ser devuelta ni trasladada. Registre el número de expediente " +
        "y el juzgado en las observaciones; sin ese dato el amparo no se puede acreditar " +
        "ante otra autoridad." },
    { t:"Naturalizado",
      n:"Adquiere los mismos derechos que una persona mexicana: sin restricción de " +
        "movilidad estatal." },
    { t:"Sin trámite",
      n:"Sin trámite iniciado: el sistema restringe alertas de movilidad y sugiere " +
        "canalización a orientación jurídica." }
  ];

  function estatus(t) {
    return ESTATUS_MIGRATORIO.filter(function (e) { return e.t === t; })[0] || null;
  }

  /* ------------------------------------------------ Sectores productivos */
  var SECTORES = [
    "Agroindustria", "Belleza y cuidado personal", "Comercio", "Construcción",
    "Manufactura de alimentos", "Servicio al cliente",
    "Servicios de hospedaje y alimentos", "Servicios de limpieza",
    "Textil y confección", "Transporte y almacenaje"
  ];

  /* --------------------------------- Escolaridad del registro general ---
     El alta de persona captura la escolaridad UNA vez; Empleabilidad la
     hereda y la detalla. Por eso el nivel vive aquí y no dentro de
     Empleabilidad: si Empleabilidad tuviera el suyo volvería a ser una
     segunda captura del mismo hecho —justo lo que pide evitar el
     requerimiento 2.1— y las dos capturas podrían discrepar sin que nadie
     se entere.

     `nivel` es siempre una opción de ESCOLARIDAD. Lo que NO es nivel —el
     área, la institución, el año, el documento que lo acredita— es el
     detalle que agrega Empleabilidad y va en campos aparte. Meterlo dentro
     del nivel fue lo que produjo valores como "Técnico en soldadura
     industrial" o "Licenciatura en Administración (trunca)", que no son
     ningún nivel del catálogo: un <select> sin coincidencia cae en su
     primera opción, así que esa persona aparecía en pantalla como "Sin
     instrucción formal".

     OJO con la numeración: estos expedientes son los de la Dirección de
     Empleabilidad y Capacitación, y sus números coinciden con la cola de
     los folios del expediente único sin ser la misma persona (el 0412 de
     aquí es Yesenia Ramírez Coc; SIAMH-2026-TAP-0412 es Yolanda Esperanza
     Martínez Cruz). Está anotado en §5.3 para unificarlo.               */
  var ESC_REGISTRO = {
    "0412": { nivel:"Secundaria concluida",       inst:"Instituto Nacional de Educación Básica · Quetzaltenango", anio:2015 },
    "0429": { nivel:"Primaria concluida",         inst:"Escuela Rural Mixta El Progreso · Yoro", anio:2004 },
    "0447": { nivel:"Bachillerato concluido",     inst:"Instituto Nacional Miguel Larreynaga · Managua", anio:2021 },
    "0464": { nivel:"Carrera técnica concluida",  area:"Soldadura industrial",
              inst:"Politécnico José Antonio Echeverría · La Habana", anio:2008 },
    "0470": { nivel:"Licenciatura trunca",        area:"Administración",
              inst:"Universidad del Zulia · Maracaibo", anio:2019 },
    "0658": { nivel:"Secundaria concluida",       inst:"Instituto Oficial Primero de Mayo · San Pedro Sula", anio:2016 },
    "0201": { nivel:"Secundaria concluida",       inst:"Escuela Secundaria Técnica 45 · Tapachula", anio:2006 },
    "0435": { nivel:"Secundaria concluida",       inst:"Centro Escolar Distrito Italia · Tonacatepeque", anio:2012 }
  };

  /* Copia, no la referencia: quien lee el registro general no debe poder
     modificarlo por descuido. Para corregirlo está escRegistroFija().   */
  function escRegistro(exp) {
    var x = ESC_REGISTRO[exp];
    if (!x) return null;
    return { nivel:x.nivel, area:x.area || "", inst:x.inst || "", anio:x.anio || null,
             doc:x.doc || "Certificado o título" };
  }

  /* Corregir la escolaridad desde Empleabilidad corrige el expediente
     único, no una copia local: si cada módulo guardara la suya, la
     duplicidad que el requerimiento venía a eliminar volvería por la
     puerta de atrás.                                                    */
  function escRegistroFija(exp, datos) {
    if (!ESC_REGISTRO[exp]) ESC_REGISTRO[exp] = {};
    var d = ESC_REGISTRO[exp];
    ["nivel", "area", "inst", "anio", "doc"].forEach(function (k) {
      if (datos[k] !== undefined) d[k] = datos[k];
    });
    return escRegistro(exp);
  }

  /* Cómo se acredita el nivel. "En trámite de revalidación" no es un
     adorno: es el estado que conecta con el módulo de Revalidación de
     Estudios, y sin él la ventanilla vuelve a pedir un papel que ya está
     en trámite.                                                         */
  var DOC_ESCOLAR = [
    "Certificado o título",
    "Boletas o constancia parcial",
    "En trámite de revalidación",
    "Sin documento probatorio"
  ];

  /* ------------------------------------------------------------ LADA ----
     Clave telefónica internacional. El orden repite el de PAISES —primero
     el país donde se captura y los de mayor flujo— porque es un selector
     que se toca en cada alta.

     `d` son los dígitos del número NACIONAL, sin la clave. Sin ese dato la
     validación solo puede decir "número inválido", que no le sirve a quien
     está capturando; con él la pantalla dice **qué** falta: "faltan 2
     dígitos para un número de Honduras". Un teléfono mal capturado no es un
     error cosmético: es la persona a la que después no se le puede avisar
     de su cita, y el módulo de Empleabilidad verifica a los 15 y 30 días
     justamente por teléfono.                                             */
  var LADA = [
    { c:"+52",    p:"México", d:10 },
    { c:"+504",   p:"Honduras", d:8 },
    { c:"+502",   p:"Guatemala", d:8 },
    { c:"+58",    p:"Venezuela", d:10 },
    { c:"+509",   p:"Haití", d:8 },
    { c:"+53",    p:"Cuba", d:8 },
    { c:"+503",   p:"El Salvador", d:8 },
    { c:"+505",   p:"Nicaragua", d:8 },
    { c:"+54",    p:"Argentina", d:10 },
    { c:"+501",   p:"Belice", d:7 },
    { c:"+591",   p:"Bolivia", d:8 },
    { c:"+55",    p:"Brasil", d:11 },
    { c:"+56",    p:"Chile", d:9 },
    { c:"+57",    p:"Colombia", d:10 },
    { c:"+506",   p:"Costa Rica", d:8 },
    { c:"+593",   p:"Ecuador", d:9 },
    { c:"+1",     p:"Estados Unidos", d:10 },
    { c:"+507",   p:"Panamá", d:8 },
    { c:"+595",   p:"Paraguay", d:9 },
    { c:"+51",    p:"Perú", d:9 },
    { c:"+1809",  p:"República Dominicana", d:7 },
    { c:"+598",   p:"Uruguay", d:8 },
    { c:"+244",   p:"Angola", d:9 },
    { c:"+237",   p:"Camerún", d:9 },
    { c:"+242",   p:"Congo", d:9 },
    { c:"+291",   p:"Eritrea", d:7 },
    { c:"+233",   p:"Ghana", d:9 },
    { c:"+224",   p:"Guinea", d:9 },
    { c:"+222",   p:"Mauritania", d:8 },
    { c:"+234",   p:"Nigeria", d:10 },
    { c:"+243",   p:"República Democrática del Congo", d:9 },
    { c:"+221",   p:"Senegal", d:9 },
    { c:"+252",   p:"Somalia", d:8 },
    { c:"+249",   p:"Sudán", d:9 },
    { c:"+93",    p:"Afganistán", d:9 },
    { c:"+880",   p:"Bangladesh", d:10 },
    { c:"+86",    p:"China", d:11 },
    { c:"+91",    p:"India", d:10 },
    { c:"+98",    p:"Irán", d:10 },
    { c:"+964",   p:"Iraq", d:10 },
    { c:"+977",   p:"Nepal", d:10 },
    { c:"+92",    p:"Pakistán", d:10 },
    { c:"+963",   p:"Siria", d:9 },
    { c:"+998",   p:"Uzbekistán", d:9 },
    { c:"+84",    p:"Vietnam", d:9 },
    { c:"+967",   p:"Yemen", d:9 },
    { c:"+995",   p:"Georgia", d:9 },
    { c:"+7",     p:"Rusia", d:10 },
    { c:"+90",    p:"Turquía", d:10 },
    { c:"+380",   p:"Ucrania", d:9 }
  ];

  /* Clave que corresponde a un país, para preseleccionar el selector de
     LADA a partir de la nacionalidad ya capturada. */
  function ladaDe(pais) {
    var x = LADA.filter(function (l) { return l.p === pais; })[0];
    return x ? x.c : "+52";
  }


  /* ------------------------------------ Expediente único · población de
     Capacitación y Empleabilidad (22/09/2026)
     --------------------------------------------------------------------
     Lo que OTROS módulos saben de cada persona de la cartera de empleo, para
     que Empleabilidad lo lea en vez de volver a preguntarlo:
       · reg   → Registro de Persona (sexo, teléfono en residencia,
                 domicilio, ingreso a México, permanencia estimada)
       · fam   → Expediente Familiar (integrantes del grupo; null = la
                 persona no tiene grupo registrado, [] = grupo unipersonal)
       · cursos → Capacitación (grupos en que está o estuvo inscrita; los
                 del ciclo 2026 son los de capacitacion.html)
       · salud → lo ÚNICO que Salud comparte con Empleo: si hay una
                 condición registrada (enf) y si lleva control médico
                 (control). Nunca el diagnóstico ni el código (RNF01).
                 Sin la clave, Salud no tiene valoración de la persona.
     En el sistema real es una consulta a la base; en el prototipo, cada
     pantalla lleva sus datos dentro y esta tabla hace de base común. */
  var EXP_EMPLEO = {
    "0412": { reg:{ sexo:"Mujer", tel:"+52 962 104 3381", dom:"Col. Las Américas, Tapachula", mun:"Tapachula",
                    ingreso:"2025-06-20", permanencia:"Indefinida" },
              fam:[ { n:"Brandon Ramírez Coc", p:"Hijo", e:8, mun:"Tapachula" } ],
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" },
                       { t:"Repostería básica", inst:"ICATECH Tapachula", est:"acreditado", g:"2025" } ] },
    "0429": { reg:{ sexo:"Hombre", tel:"+52 962 211 0457", dom:"Col. 5 de Febrero, Tapachula", mun:"Tapachula",
                    ingreso:"2025-10-28", permanencia:"Más de 6 meses" },
              fam:[],
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" },
                       { t:"Electricidad básica", inst:"ICATECH Tapachula", est:"acreditado", g:"2025" },
                       { t:"Albañilería y acabados", inst:"ICATECH Tapachula", est:"acreditado", g:"2025" } ] },
    "0447": { reg:{ sexo:"Mujer", tel:"+52 964 102 7719", dom:"Barrio San Juan, Huixtla", mun:"Huixtla",
                    ingreso:"2026-02-25", permanencia:"1 a 6 meses" },
              fam:null,
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" } ] },
    "0464": { reg:{ sexo:"Hombre", tel:"+52 962 330 8841", dom:"Col. Centro, Tapachula", mun:"Tapachula",
                    ingreso:"2024-08-15", permanencia:"Indefinida" },
              fam:[ { n:"Yanet Rodríguez Batista", p:"Cónyuge", e:36, mun:"Tapachula" } ],
              salud:{ enf:true, control:true, f:"2026-07-30" },
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" } ] },
    "0470": { reg:{ sexo:"Mujer", tel:"+52 962 187 5520", dom:"Fracc. Los Laureles, Tapachula", mun:"Tapachula",
                    ingreso:"2025-08-10", permanencia:"Más de 6 meses" },
              fam:[ { n:"Carmen Silva de Rondón", p:"Madre", e:55, mun:"Tapachula" },
                    { n:"Valentina Rondón Silva", p:"Hija", e:6, mun:"Tapachula" } ],
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" } ] },
    "0658": { reg:{ sexo:"Mujer", tel:"+52 962 145 6603", dom:"Col. Solidaridad 2000, Tapachula", mun:"Tapachula",
                    ingreso:"2025-12-20", permanencia:"" },
              fam:null,
              cursos:[ { t:"Corte y confección", inst:"ICATECH Tapachula", est:"inscrita, inicia el 07/09/2026", g:"G-2026-021" } ] },
    "0201": { reg:{ sexo:"Mujer", tel:"+52 962 118 2290", dom:"Ejido Viva México, Tapachula", mun:"Tapachula",
                    ingreso:"", permanencia:"" },
              salud:{ enf:false, f:"2026-06-12" },
              fam:[ { n:"Kevin Roblero Pérez", p:"Hijo", e:12, mun:"Tapachula" },
                    { n:"Ximena Roblero Pérez", p:"Hija", e:15, mun:"Tapachula" } ],
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" },
                       { t:"Cocina económica", inst:"ICATECH Tapachula", est:"acreditado", g:"2025" } ] },
    "0435": { reg:{ sexo:"Mujer", tel:"+52 962 290 1164", dom:"Col. Indeco Cebadilla, Tapachula", mun:"Tapachula",
                    ingreso:"2025-03-02", permanencia:"Indefinida" },
              fam:[ { n:"Mauricio Hernández Ruiz", p:"Cónyuge", e:33, mun:"Tapachula" } ],
              salud:{ enf:true, control:false, f:"2026-08-02" },
              cursos:[ { t:"Panadería básica", inst:"ICATECH Tapachula", est:"en curso", g:"G-2026-018" } ] }
  };
  function expEmpleo(folio) { return EXP_EMPLEO[folio] || null; }

  /* ------------------------------ Altas rápidas desde Empleabilidad -----
     22/09/2026. Una persona que llega solo por empleo se registra primero
     (expediente único) con el alta rápida de Registro, y vuelve a
     Empleabilidad. Sin servidor, el alta se guarda en el navegador y se
     suma aquí al expediente común, para que el cuestionario la lea como a
     las demás. «Limpiar datos de prueba» las borra.                      */
  var LLAVE_ALTAS = "SIAMH_ALTAS_EMPLEO";
  function altasEmpleo() {
    try { return JSON.parse(localStorage.getItem(LLAVE_ALTAS) || "[]"); } catch (e) { return []; }
  }
  function agregaAltaEmpleo(a) {
    var l = altasEmpleo().filter(function (x) { return x.e !== a.e; });
    l.push(a);
    try { localStorage.setItem(LLAVE_ALTAS, JSON.stringify(l)); } catch (e) { /* sin persistencia */ }
  }
  function folioAltaEmpleo() {
    var n = 800 + altasEmpleo().length + 1;
    return ("000" + n).slice(-4);
  }
  altasEmpleo().forEach(function (a) {
    EXP_EMPLEO[a.e] = { reg:{ sexo:a.sexo, tel:a.tel, dom:a.dom, mun:a.mun, ingreso:a.ingreso,
                              permanencia:a.permanencia }, fam:null, cursos:null };
  });

  global.DATOS = {
    HOY:HOY, dt:dt, fecha:fecha, hora:hora, fechaHora:fechaHora,
    horas:horas, dias:dias, horasTxt:horasTxt, edad:edad, plural:plural,
    YO:YO, DIRECTOR:DIRECTOR, PERS:PERS,
    persona:persona, activos:activos, corto:corto,
    NIVELES:NIVELES, MOT_NEG:MOT_NEG, REVAL:REVAL, negAbierta:negAbierta,
    EXP_EMPLEO:EXP_EMPLEO, expEmpleo:expEmpleo,
    altasEmpleo:altasEmpleo, agregaAltaEmpleo:agregaAltaEmpleo, folioAltaEmpleo:folioAltaEmpleo,

    /* Catálogos de captura compartidos */
    PAISES:PAISES, paisesPlanos:paisesPlanos, ESCOLARIDAD:ESCOLARIDAD,
    ETNIAS:ETNIAS, LENGUAS:LENGUAS, MOTIVOS_MIGRACION:MOTIVOS_MIGRACION,
    ESTATUS_MIGRATORIO:ESTATUS_MIGRATORIO, estatus:estatus,
    SECTORES:SECTORES, LADA:LADA, ladaDe:ladaDe,
    escRegistro:escRegistro, escRegistroFija:escRegistroFija, DOC_ESCOLAR:DOC_ESCOLAR
  };
})(window);
