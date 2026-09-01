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
  var YO = {
    n: "María Gómez Pérez",
    rol: "Capturista Municipal",
    mun: "Tapachula",
    puedeCrear: true,
    puedeFirmar: false,
    puedeExportar: false
  };

  var DIRECTOR = { n: "Dr. Luis A. Ramírez Toledo", cargo: "Director de Atención y Salud" };

  /* ------------------------------------------------------- Personas -------
     Los mismos folios, nombres y CURP que Salud y Expediente Familiar.
     Ninguna edad está escrita a mano: sale de la fecha de nacimiento contra
     el reloj del prototipo.                                                */
  var PERS = [
    { f:"SIMH-2026-TAP-0412", n:"Yolanda Esperanza Martínez Cruz", ini:"YM", pais:"Honduras",
      nac:"1994-03-18", curp:"MACY940318MCSRRL07", reg:"2026-08-20", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:true, grupo:"SIMH-FAM-2026-0341",
      emis:[
        { fol:"CR-0731/2026", t:"2026-08-20 12:40", mot:"Primera emisión", sop:"gafete",
          por:"María Gómez Pérez" },
        { fol:"CR-0768/2026", t:"2026-08-27 16:05", mot:"Reposición por extravío", sop:"gafete",
          por:"María Gómez Pérez" }
      ] },

    { f:"SIMH-2026-TAP-0410", n:"Keiner Alexander Rojas Mora", ini:"KR", pais:"Venezuela",
      nac:"2010-07-22", curp:"ROMK100722HNEXXX03", reg:"2026-08-22", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:false, grupo:"SIMH-FAM-2026-0338",
      nna:"Separado", tutor:"Marisol Rojas Peña · titular del grupo familiar", emis:[] },

    { f:"SIMH-2026-SUC-0177", n:"Marta Lucía Xicoténcatl Pérez", ini:"MX", pais:"Guatemala",
      nac:"1985-02-14", curp:"XIPM850214MNEXXX07", reg:"2026-08-18", mun:"Suchiate",
      cap:"Ing. Rubén Castellanos Díaz", est:"activo", foto:true, grupo:"SIMH-FAM-2026-0332",
      emis:[
        { fol:"CR-0702/2026", t:"2026-08-18 10:15", mot:"Primera emisión", sop:"gafete",
          por:"Ing. Rubén Castellanos Díaz" }
      ] },

    { f:"SIMH-2026-FCO-0094", n:"Yamilé Rodríguez Betancourt", ini:"YR", pais:"Cuba",
      nac:"1997-07-12", curp:"ROBY970712MNEXXX04", reg:"2026-08-14", mun:"F. Comalapa",
      cap:"María Gómez Pérez", est:"activo", foto:true, grupo:"—",
      emis:[
        { fol:"CR-0664/2026", t:"2026-08-14 09:50", mot:"Primera emisión", sop:"carta",
          por:"María Gómez Pérez" }
      ] },

    { f:"SIMH-2026-TAP-0411", n:"Jean-Baptiste Pierre Louis", ini:"JP", pais:"Haití",
      nac:"1999-01-18", curp:"PILJ990118HNEXXX05", reg:"2026-08-21", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:false, grupo:"—", emis:[] },

    { f:"SIMH-2026-TAP-0408", n:"Wilmer Josué Aguilar Paz", ini:"WA", pais:"Honduras",
      nac:"2017-02-03", curp:"AUPW170203HNEXXX06", reg:"2026-08-20", mun:"Tapachula",
      cap:"María Gómez Pérez", est:"activo", foto:true, grupo:"SIMH-FAM-2026-0341",
      nna:"Acompañado", tutor:"Yolanda Esperanza Martínez Cruz · titular del grupo familiar",
      emis:[
        { fol:"CR-0733/2026", t:"2026-08-20 12:52", mot:"Primera emisión", sop:"gafete",
          por:"María Gómez Pérez" }
      ] },

    /* Expediente cerrado: no se elimina nunca (RNF03), pero tampoco ampara
       una constancia vigente. Las pantallas lo dicen y dicen qué lo
       desbloquea, en vez de dibujar un botón apagado.                      */
    { f:"SIMH-2026-HUI-0203", n:"Nery Estuardo Batz Cuc", ini:"NB", pais:"Guatemala",
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
  var NIVELES = {
    basica:  { t:"Educación básica · primaria y secundaria", revalida:false,
      regla:"La educación básica no se revalida. La escuela debe inscribir a la niña, niño o " +
            "adolescente aunque no traiga documentos y regularizar el expediente después; " +
            "condicionar la inscripción a papeles es justamente la negativa que se registra aquí " +
            "(Acuerdo 286 de la SEP y normativa de inclusión educativa)." },
    media:   { t:"Media superior · bachillerato", revalida:true,
      regla:"La revalidación puede ser parcial, por materias acreditadas. La apostilla se exige para " +
            "la revalidación total; para la parcial la autoridad puede resolver con el cotejo." },
    superior:{ t:"Superior · licenciatura o técnico superior", revalida:true,
      regla:"La revalidación se resuelve por materias contra el plan de estudios mexicano " +
            "equivalente. Sin el plan de estudios de origen solo cabe una resolución total." }
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
    { id:"r1", per:"SIMH-2026-TAP-0408", nivel:"basica",
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

    { id:"r2", per:"SIMH-2026-TAP-0410", nivel:"media",
      destino:"Revalidación parcial de 1.º y 2.º de bachillerato",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-25", limite:"2026-09-15", limiteTxt:"Cierre de inscripciones extemporáneas",
      req:{ cert:"si", apost:"falta", trad:"na", ident:"si", curp:"si", pago:"tramite" },
      neg:[ { t:"2026-08-27 13:10", inst:"Secretaría de Educación del Estado",
              motivo:"Exigen apostilla no exigible para el trámite solicitado",
              detalle:"La ventanilla rechazó la solicitud de revalidación parcial por no traer el " +
                      "certificado apostillado, siendo que la parcial se resuelve por cotejo.",
              hizo:"", oficio:null } ] },

    { id:"r3", per:"SIMH-2026-SUC-0177", nivel:"superior",
      destino:"Revalidación de licenciatura en enfermería para ejercer en Chiapas",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-19", limite:null, limiteTxt:"",
      req:{ cert:"si", plan:"si", apost:"si", trad:"tramite", ident:"si", curp:"si", pago:"falta" },
      neg:[] },

    { id:"r4", per:"SIMH-2026-TAP-0411", nivel:"superior",
      destino:"Revalidación de estudios técnicos en construcción",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-22", limite:null, limiteTxt:"",
      req:{ cert:"si", plan:"falta", apost:"falta", trad:"falta", ident:"si", curp:"si", pago:"na" },
      neg:[] },

    { id:"r5", per:"SIMH-2026-FCO-0094", nivel:"superior",
      destino:"Revalidación de licenciatura en contaduría",
      inst:"Secretaría de Educación del Estado · Departamento de Revalidación",
      abierto:"2026-08-05", limite:null, limiteTxt:"", resuelto:"2026-08-24",
      req:{ cert:"si", plan:"si", apost:"si", trad:"si", ident:"si", curp:"si", pago:"si" },
      neg:[] }
  ];


  function negAbierta(c) {
    return c.neg.filter(function (x) { return !x.oficio; })[0] || null;
  }

  global.DATOS = {
    HOY:HOY, dt:dt, fecha:fecha, hora:hora, fechaHora:fechaHora,
    horas:horas, dias:dias, horasTxt:horasTxt, edad:edad, plural:plural,
    YO:YO, DIRECTOR:DIRECTOR, PERS:PERS,
    persona:persona, activos:activos, corto:corto,
    NIVELES:NIVELES, MOT_NEG:MOT_NEG, REVAL:REVAL, negAbierta:negAbierta
  };
})(window);
