/* ============================================================================
   SIMH · Sistema Integral de Movilidad Humana
   Utilidades del prototipo: chrome institucional, iconografía, gráficas SVG y
   componentes. Sin dependencias externas; funciona con file://.
   ----------------------------------------------------------------------------
   Reglas de graficación aplicadas (verificadas con el validador de paleta):
     · Magnitud → una sola tinta jade; el color no repite lo que ya dice el largo.
     · Categorías → orden fijo guinda, jade, rosa (nunca guinda y rosa contiguos),
       con separador de 2px y etiqueta directa como codificación secundaria.
     · Marcas delgadas (≤24px), extremo redondeado de 4px, rejilla de 1px sólida.
     · Etiqueta directa selectiva (extremo o máximo), nunca un número por dato.
     · Toda gráfica tiene su tabla gemela accesible ("Ver tabla").
   ========================================================================= */
(function (global) {
  "use strict";

  /* ------------------------------------------- Preferencia del menú ------
     Se aplica en cuanto carga el script, antes de que corra el IIFE de la
     página, para que el contenido no dé un salto al restaurarse el riel.
     `file://` no siempre concede localStorage, así que todo va en try/catch
     y la ausencia de preferencia simplemente deja el menú abierto.       */
  var LLAVE_MENU = "simh-menu";
  function leePref() {
    try { return localStorage.getItem(LLAVE_MENU); } catch (e) { return null; }
  }
  function guardaPref(v) {
    try { localStorage.setItem(LLAVE_MENU, v); } catch (e) { /* sin persistencia */ }
  }
  if (leePref() === "riel") document.documentElement.classList.add("menu-riel");

  var TINTA = { d1:"#5BBFB3", d2:"#17A395", d3:"#008A7B", d4:"#005249" };
  var CAT   = ["#AE192D", "#009887", "#C90166"];   /* orden fijo, no ciclar */
  var SUP   = "#FFFFFF";                            /* superficie: separadores */
  var REJA  = "#EFECE5";
  var EJE   = "#8C8C8C";

  /* ------------------------------------------------------- Iconografía --- */
  var ICO = {
    inicio:      '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    registro:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    expedientes: '<path d="M4 4h9l2 3h5v13H4z"/><path d="M8 12h8M8 16h5"/>',
    familia:     '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.2"/><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20"/><path d="M17 14.5h.5a3.5 3.5 0 0 1 3.5 3.5V20"/>',
    salud:       '<path d="M12 21s-7-4.6-7-9.6A4.4 4.4 0 0 1 12 8a4.4 4.4 0 0 1 7 3.4c0 5-7 9.6-7 9.6z"/><path d="M9.5 12h2l1-2 1.5 4 1-2h1.5"/>',
    empleo:      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12h18"/>',
    capacita:    '<path d="M12 4 2 9l10 5 10-5-10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
    oficios:     '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h6M10 16h6"/>',
    censo:       '<path d="M3 21h18"/><path d="M5 21V8l6-4 6 4v13"/><path d="M9 21v-5h4v5"/>',
    /* Libro abierto: revalidación de estudios. */
    estudios:    '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v16H5.5A1.5 1.5 0 0 0 4 20.5z"/>' +
                 '<path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v16h6.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
    /* Credencial con fotografía: documentación e identidad. */
    identidad:   '<rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="8.5" cy="10.6" r="2"/>' +
                 '<path d="M5.2 15.8a3.4 3.4 0 0 1 6.6 0"/><path d="M14.6 9.6h4.2M14.6 13.2h4.2"/>',
    /* Documento con sello: constancia de registro. */
    constancia:  '<path d="M5 3h8l4 4v8H5z"/><path d="M13 3v4h4"/><circle cx="15.5" cy="17" r="2.9"/>' +
                 '<path d="M13.6 19.2 12.9 22.6l2.6-1.4 2.6 1.4-.7-3.4"/>',
    admin:       '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    buscar:      '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    campana:     '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    alerta:      '<path d="M12 3 1.8 20h20.4z"/><path d="M12 9v5M12 17.5v.5"/>',
    info:        '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
    reloj:       '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    doc:         '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>',
    excel:       '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12l4 6M14 12l-4 6"/>',
    pdf:         '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 17v-4h1.5a1.5 1.5 0 0 1 0 3H10"/>',
    descarga:    '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 21h16"/>',
    arriba:      '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
    abajo:       '<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
    check:       '<path d="M4 12.5 9.5 18 20 6"/>',
    mas:         '<path d="M12 5v14M5 12h14"/>',
    camara:      '<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/>',
    candado:     '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    persona:     '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    nube:        '<path d="M6.5 19a4.5 4.5 0 0 1 .3-9A6 6 0 0 1 18 10.5a4.25 4.25 0 0 1-.5 8.5z"/><path d="M3 3l18 18"/>',
    /* La misma nube sin la diagonal: "nube" es SIN conexión y "nubeok" es
       con conexión. El censo empresarial necesita las dos.                */
    nubeok:      '<path d="M6.5 19a4.5 4.5 0 0 1 .3-9A6 6 0 0 1 18 10.5a4.25 4.25 0 0 1-.5 8.5z"/>',
    ojo:         '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    izq:         '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
    der:         '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    guardar:     '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3"/><path d="M8 21v-7h8v7"/>',
    editar:      '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
    mapa:        '<path d="M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6z"/><path d="M9 3v15M15 6v15"/>',
    salir:       '<path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2"/><path d="M20 12H9"/><path d="M17 8l4 4-4 4"/>',
    llave:       '<circle cx="8" cy="14" r="4"/><path d="M11 11 20 2"/><path d="M17 5l2.5 2.5"/><path d="M15 7l2.5 2.5"/>',
    ayuda:       '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 1 1 3.2 2.5c-.5.2-.7.6-.7 1.1v.4"/><path d="M12 16.8v.4"/>',
    caret:       '<path d="M6 9.5l6 6 6-6"/>'
  };

  function icono(nombre, clase) {
    var d = ICO[nombre] || "";
    return '<svg viewBox="0 0 24 24" width="18" height="18" class="' + (clase || "") + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }

  /* -------------------------------------------------------- Isotipo ------ */
  /* Isotipo oficial del SIAMH · Secretaría de la Frontera Sur              */
  function isotipo(alto, mono) {
    return '<img class="marca-logo" src="assets/img/simh-isotipo.png" alt="Logo SIAMH" style="height:' + (alto || 38) + 'px;width:auto;flex:none;object-fit:contain">';
  }

  /* ---------------------------------------------- Sesión y sede --------
     Quién opera y DESDE DÓNDE. Hasta el 22/09/2026 la sesión estaba escrita
     a mano en el chrome (María Gómez Pérez, Tapachula). La Dirección pidió
     que la Revalidación de Estudios solo esté habilitada y visible para las
     sedes de la Secretaría de la Frontera Sur y de Tuxtla, y para quien
     administra: eso es una regla de SEDE, no de rol, y necesita saber desde
     qué sede se entra.

     La regla vive aquí una sola vez y la leen tres consumidores: el menú
     lateral (no dibuja la entrada), la propia pantalla (enuncia la regla si
     se llega por URL) y la matriz de Administración (la muestra por cuenta).

     El prototipo trae cuatro cuentas de demostración para poder recorrer
     los dos lados de la regla; el login elige la cuenta por su usuario y el
     menú de cuenta permite cambiarla.                                     */
  var SEDES = {
    sfs:      { t:"Secretaría de la Frontera Sur · Tapachula" },
    tuxtla:   { t:"Oficinas centrales · Tuxtla Gutiérrez" },
    vent_tap: { t:"Ventanilla municipal · Tapachula" },
    vent_suc: { t:"Ventanilla municipal · Suchiate" },
    vent_hui: { t:"Ventanilla municipal · Huixtla" }
  };

  /* Módulo → sedes que lo tienen habilitado. Quien administra (rol super)
     entra desde cualquier sede. Un módulo que no está aquí no se restringe
     por sede. */
  var MOD_SEDE = { revalida: ["sfs", "tuxtla"] };

  var CUENTAS = [
    { usu:"maria.gomez", n:"María Gómez Pérez", ini:"MG", rol:"capturista",
      rolT:"Capturista Municipal", mun:"Tapachula", sede:"vent_tap" },
    { usu:"luis.ramirez", n:"Dr. Luis A. Ramírez Toledo", ini:"LR", rol:"director",
      rolT:"Director de Área", mun:"Tapachula", sede:"sfs" },
    { usu:"jorge.pineda", n:"Mtro. Jorge Pineda Ovalle", ini:"JP", rol:"super",
      rolT:"Superadmin", mun:"Tuxtla Gutiérrez", sede:"tuxtla" },
    { usu:"ruben.castellanos", n:"Ing. Rubén Castellanos Díaz", ini:"RC", rol:"capturista",
      rolT:"Capturista Municipal", mun:"Suchiate", sede:"vent_suc" }
  ];
  var LLAVE_SESION = "simh-sesion";

  function sesion() {
    /* Atajo de revisión: `?cuenta=luis.ramirez` entra con esa cuenta. */
    var q = /[?&]cuenta=([a-z.]+)/.exec(location.search);
    if (q) return iniciarSesion(q[1]);
    var u = null;
    try { u = localStorage.getItem(LLAVE_SESION); } catch (e) { /* sin persistencia */ }
    return CUENTAS.filter(function (c) { return c.usu === u; })[0] || CUENTAS[0];
  }
  function iniciarSesion(usu) {
    var c = CUENTAS.filter(function (x) { return x.usu === String(usu || "").trim().toLowerCase(); })[0];
    try { localStorage.setItem(LLAVE_SESION, c ? c.usu : CUENTAS[0].usu); } catch (e) { /* idem */ }
    return c || CUENTAS[0];
  }

  /* ¿La cuenta puede usar el módulo desde su sede? Sin cuenta, la de la
     sesión. Acepta cualquier objeto con `rol` y `sede`, así la matriz de
     Administración la aplica a sus propias filas de usuario. */
  function accesoSede(modulo, cuenta) {
    var c = cuenta || sesion();
    var sedes = MOD_SEDE[modulo];
    if (!sedes || c.rol === "super") return true;
    return sedes.indexOf(c.sede) >= 0;
  }
  function sedesDe(modulo) {
    return (MOD_SEDE[modulo] || []).map(function (k) { return SEDES[k].t; });
  }

  /* ------------------------------------------ Serie de folios compartida --
     Revalidación y el simulador de oficios de Capacitación asignaban folio
     cada uno con su propio contador y podían repetir `SFS/SMH/0951/2026`. La
     serie es una sola: aquí se lleva el último folio y la última referencia
     de borrador, persistidos para que dos pantallas no los repitan. Los
     arranques son los últimos que existen en los datos del prototipo.    */
  var SERIE = { folio: { llave:"simh-serie-folio", base:950 },
                bor:   { llave:"simh-serie-bor",   base:40 } };
  function siguiente(tipo) {
    var sr = SERIE[tipo], n = sr.base;
    try { n = Math.max(n, parseInt(localStorage.getItem(sr.llave), 10) || 0); } catch (e) { /* idem */ }
    n += 1;
    try { localStorage.setItem(sr.llave, String(n)); } catch (e) { sr.base = n; }
    return ("000" + n).slice(-4);
  }
  function folioOficio() { return "SFS/SMH/" + siguiente("folio") + "/2026"; }
  function refBorrador() { return "BOR-" + siguiente("bor"); }

  /* ---------------------------------------- Datos de prueba (4.1) --------
     La Dirección pidió un botón para LIMPIAR los datos de prueba y otro
     para volver a POBLARLOS, y así recorrer el flujo sin los casos
     ficticios. Cada pantalla lleva sus datos dentro, así que "limpiar" no
     borra nada: marca el modo y cada módulo, al arrancar, pinta su estado
     vacío en lugar de sus registros. "Poblar" devuelve el modo normal.
     La carga de los datos reales de producción depende de que la Dirección
     los entregue; el control ya queda donde se usará.                    */
  var LLAVE_DATOS = "simh-datos-prueba";
  function sinDatos() {
    try { return localStorage.getItem(LLAVE_DATOS) === "vacio"; } catch (e) { return false; }
  }
  function datosPrueba(poblar) {
    try {
      if (poblar) localStorage.removeItem(LLAVE_DATOS);
      else {
        localStorage.setItem(LLAVE_DATOS, "vacio");
        /* Lo generado sobre los datos de prueba se va con ellos. */
        localStorage.removeItem("SIAMH_OFICIOS_EXTRA");
        localStorage.removeItem("simh-serie-folio");
        localStorage.removeItem("simh-serie-bor");
        localStorage.removeItem("SIAMH_ALTAS_EMPLEO");
      }
    } catch (e) { /* sin persistencia */ }
  }

  /* Estado vacío de un módulo: conserva migas y encabezado, retira las
     acciones que operan sobre registros y deja una sola salida útil.     */
  function vacioModulo(o) {
    var main = document.querySelector(".contenido");
    if (!main) return;
    var keep = [main.querySelector(".migas"), main.querySelector(".enc")].filter(Boolean);
    var acc = main.querySelector(".enc-acc");
    if (acc) acc.innerHTML = "";
    Array.prototype.slice.call(main.children).forEach(function (el) {
      if (keep.indexOf(el) < 0) el.remove();
    });
    var d = document.createElement("div");
    d.className = "tarjeta vacio-modulo";
    d.innerHTML = '<span class="vm-ico">' + icono(o.ico || "info") + "</span>" +
      '<h2 class="vm-t">' + esc(o.titulo || "Sin registros todavía") + "</h2>" +
      '<p class="vm-n">' + (o.texto || "") + " Los datos de prueba se limpiaron desde " +
        "<b>Administración › Datos de prueba</b>, donde también se vuelven a poblar.</p>" +
      '<div class="vm-acc">' + (o.accion || "") +
        '<a class="btn btn-secundario btn-s" href="administracion.html?tab=datos">' + icono("admin") +
        "Administrar datos de prueba</a></div>";
    main.appendChild(d);
  }

  /* -------------------------------------- Fotografías de demostración ---
     23/09/2026: la Dirección pidió fotos ficticias para ver el hover y cómo
     sale la constancia de registro. Son retratos ilustrados, generados en
     SVG a partir del folio (siempre el mismo para la misma persona) y sin
     archivos externos, para que funcionen con `file://`. Los expedientes de
     SIN_FOTO se quedan sin ella a propósito: son los casos de revisión de
     «el expediente no tiene fotografía».                                   */
  var SIN_FOTO = ["SIAMH-2026-TAP-0410", "SIAMH-2026-TAP-0411"];
  var HOMBRES = ["anthony","brandon","cristian","darwin","diego","jean","jean-baptiste","jefferson",
    "josé","jose","juan","keiner","kevin","marvin","mauricio","nery","óscar","oscar","osmar","ricardo",
    "wilmer","wilson","yeison","yordanis","luis","jorge","rubén","ruben","eduardo","carlos","miguel",
    "pedro","josué","alexander","osiris","samuel","daniel","fernando","edwin","jonathan"];
  var PIEL = ["#F2CDA9", "#E3B088", "#CB9068", "#AD7049", "#8C5536", "#6E4027"];
  var PELO = ["#1E1611", "#2F2119", "#4B3122", "#23170F", "#5A3A22"];
  var ROPA = ["#5B7C99", "#8A5A6E", "#4E7D6B", "#9A7B4F", "#5E5A80", "#6F6A62", "#3F6F8C"];
  var FONDO = ["#DCE3EA", "#E6E1D8", "#D8E4E0", "#E7DDE3"];
  function hashTxt(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function tieneFoto(clave) { return !!clave && SIN_FOTO.indexOf(clave) < 0; }
  function retrato(clave, nombre) {
    var h = hashTxt(String(clave || nombre || "x"));
    function de(arr, k) { return arr[(h >>> k) % arr.length]; }
    var pila = String(nombre || "").trim().split(/\s+/)[0].toLowerCase();
    var hombre = HOMBRES.indexOf(pila) >= 0;
    var piel = de(PIEL, 0), pelo = de(PELO, 4), ropa = de(ROPA, 8), fondo = de(FONDO, 12);
    var var3 = (h >>> 16) % 3;
    var atras = "", frente = "";
    if (hombre) {
      frente = var3 === 0
        ? '<path d="M35 64C32 38 45 29 60 29c16 0 29 8 25 35-3-12-11-19-25-19s-22 7-25 19z" fill="' + pelo + '"/>'
        : var3 === 1
        ? '<path d="M36 60c-1-20 10-29 24-29s25 8 24 29c-5-9-13-13-24-13s-19 4-24 13z" fill="' + pelo + '"/>'
        : '<path d="M35 66c-4-26 8-38 25-38 18 0 30 11 25 38-2-6-4-12-7-15-6 4-14 5-20 3-6-2-12 0-17 4-3 3-5 6-6 8z" fill="' + pelo + '"/>';
    } else {
      atras = var3 === 2
        ? '<circle cx="60" cy="30" r="12" fill="' + pelo + '"/>'
        : '<path d="M31 66c-4-30 11-41 29-41s33 11 29 41l3 ' + (var3 ? 36 : 52) + "c-12 6-52 6-64 0z\" fill=\"" + pelo + '"/>';
      frente = '<path d="M35 62c1-20 12-30 26-30 15 0 26 10 24 30-8-11-20-16-33-14-7 2-13 7-17 14z" fill="' + pelo + '"/>';
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150">' +
      '<rect width="120" height="150" fill="' + fondo + '"/>' + atras +
      '<path d="M8 150c2-30 24-42 52-42s50 12 52 42z" fill="' + ropa + '"/>' +
      '<path d="M49 88h22v18c0 6-22 6-22 0z" fill="' + piel + '"/>' +
      '<path d="M49 98c7 4 15 4 22 0v4c-7 4-15 4-22 0z" fill="rgba(0,0,0,.12)"/>' +
      '<ellipse cx="36" cy="69" rx="4" ry="6" fill="' + piel + '"/><ellipse cx="84" cy="69" rx="4" ry="6" fill="' + piel + '"/>' +
      '<ellipse cx="60" cy="66" rx="24" ry="29" fill="' + piel + '"/>' + frente +
      '<path d="M46 61q5-3 10 0M64 61q5-3 10 0" stroke="' + pelo + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="51" cy="68" r="2.3" fill="#2A211C"/><circle cx="69" cy="68" r="2.3" fill="#2A211C"/>' +
      '<path d="M60 70q-3 6 1 8" stroke="rgba(0,0,0,.2)" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M53 83q7 4 14 0" stroke="#8A4B3C" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  /* Miniatura con vista ampliada al pasar el cursor Y al enfocar con el
     teclado (la misma regla del riel del menú). `clase` es la del
     contenedor que ya usa la pantalla: avatar-mini, bca-foto,
     drawer-item-avatar o exp-foto. Sin fotografía, quedan las iniciales.
     Dentro de un botón (cajón selector, cartera) la miniatura no recibe
     foco propio: un control dentro de otro confunde al teclado.           */
  function fotoPersona(clave, nombre, clase, ini) {
    var enBoton = clase === "drawer-item-avatar" || clase === "avatar-mini en-boton";
    if (!tieneFoto(clave)) {
      return '<span class="' + (clase || "avatar-mini") + '">' + esc(ini || iniciales(nombre)) + "</span>";
    }
    var src = retrato(clave, nombre);
    return '<span class="' + (clase || "avatar-mini") + ' con-foto"' + (enBoton ? "" : ' tabindex="0"') + ' role="img" ' +
      'aria-label="Fotografía de ' + esc(nombre || "la persona") + '">' +
      '<img src="' + src + '" alt="" data-nombre="' + esc(nombre || "") + '"></span>';
  }
  /* La ampliación es un solo elemento flotante (position:fixed): dentro de
     carteras y tablas con overflow, un globo absoluto quedaría recortado. */
  var flot = null;
  function muestraFoto(el) {
    var img = el.querySelector("img");
    if (!img) return;
    if (!flot) {
      flot = document.createElement("div");
      flot.className = "foto-flot";
      flot.setAttribute("aria-hidden", "true");
      document.body.appendChild(flot);
    }
    flot.innerHTML = '<img src="' + img.src + '" alt=""><span class="ff-n">' +
      esc(img.getAttribute("data-nombre") || "") + "</span>";
    var r = el.getBoundingClientRect(), W = 180, H = 250;
    var x = r.right + 12, y = r.top + r.height / 2 - H / 2;
    if (x + W > window.innerWidth - 8) x = r.left - W - 12;
    if (x < 8) { x = Math.max(8, r.left); y = r.bottom + 10; }
    y = Math.max(8, Math.min(y, window.innerHeight - H - 8));
    flot.style.left = x + "px";
    flot.style.top = y + "px";
    flot.classList.add("vis");
  }
  function ocultaFoto() { if (flot) flot.classList.remove("vis"); }
  ["mouseover", "focusin"].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      var el = e.target.closest && e.target.closest(".con-foto");
      if (el) muestraFoto(el);
    });
  });
  ["mouseout", "focusout"].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      var el = e.target.closest && e.target.closest(".con-foto");
      if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) ocultaFoto();
    });
  });
  window.addEventListener("scroll", ocultaFoto, true);
  function iniciales(n) {
    return String(n || "").split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (x) { return x.charAt(0).toUpperCase(); }).join("");
  }

  /* ------------------------------------ Hoja oficial con membrete -------
     22/09/2026: la Dirección pidió que TODAS las vistas previas de
     documentos sean exactamente como los formatos de «Recursos y
     plantillas». Los cuatro .docx comparten el mismo membrete (escudo,
     lema del año, Subsecretaría, marca de agua y pie con domicilio); aquí
     se usa esa misma hoja, generada desde la plantilla en blanco, como
     fondo de una página carta, y encima el texto con la composición del
     formato: Arial 12, folio, lugar y fecha a la derecha, asunto en bloque
     derecho, destinatario en negritas, cuerpo justificado, firma y C.c.p.

     La letra se mide en `cqw` (ancho del contenedor): la hoja se ve igual
     a 380 px que a tamaño carta, solo más chica. `paginar()` pasa a la
     hoja siguiente los párrafos que no caben, como Word.                */
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
               "septiembre", "octubre", "noviembre", "diciembre"];
  function fechaLarga(iso) {
    var p = String(iso || "").slice(0, 10).split("-");
    if (p.length < 3) return "";
    return (+p[2]) + " de " + MESES[+p[1] - 1] + " del " + p[0];
  }

  var FIRMA_SFS = { n:"Eduardo Antonio Castillejos Arguello", cargo:"Subsecretario de Movilidad Humana" };
  var CCP_SFS = "C.c.p. <b>Dra. María Amalia G. Toriello Elorza.</b> Titular de la Secretaría de la " +
    "Frontera Sur. Para su conocimiento. Edificio<br><b style=\"padding-left:3.2em\">Archivo/Minutario.</b>";

  /* Borrador: el número sale con el formato de la plantilla
     («Oficio No. SFS/SMH/0008/2026») y el consecutivo en blanco, porque
     se asigna al firmar (23/09/2026). Mostrar ya el siguiente número haría
     que dos borradores enseñaran el mismo folio. */
  var FOLIO_PEND = 'SFS/SMH/<span class="o-pend">____</span>/2026';
  function hojaSFS(o) {
    var enc = "";
    if (o.encabezado) {
      enc = o.encabezado;
    } else {
      enc = '<div class="hs-der">' +
        (o.folio !== false ? '<b>Oficio No. ' + (o.folio || FOLIO_PEND) + "</b><br>" : "") +
        (o.lugar || "Tapachula de Córdova y Ordoñez, Chiapas.") + "<br>" +
        (o.fecha || "") + "</div>" +
        (o.asunto ? '<div class="hs-asunto"><b>Asunto:</b> ' + o.asunto + "</div>" : "");
    }
    var cuerpo = (o.cuerpo || []).map(function (p) {
      return /^<(div|table|ul|h\d)/.test(p) ? p : "<p>" + p + "</p>";
    }).join("");
    var firma = o.firma === false ? "" :
      "<p>" + (o.atentamente || "Atentamente") + "</p>" +
      '<div class="hs-firma"><b>' + (o.firma || FIRMA_SFS).n + "</b><br>" + (o.firma || FIRMA_SFS).cargo + "</div>";
    var ccp = o.ccp === false ? "" : '<div class="hs-ccp">' + (o.ccp || CCP_SFS) + "</div>";

    return '<div class="hoja-sfs" role="img" aria-label="Vista previa del documento" title="Clic para ver a tamaño carta">' +
      (o.sello || "") +
      '<div class="hs-pag"><div class="hs-cont">' +
        enc +
        (o.titulo ? '<div class="hs-titulo">' + o.titulo + "</div>" : "") +
        (o.dest ? '<div class="hs-dest">' + o.dest +
          (o.presente === false ? "" : "<br>P R E S E N T E.") + "</div>" : "") +
        cuerpo + firma + ccp +
      "</div></div></div>";
  }

  /* Reporte en hoja oficial (23/09/2026). Las exportaciones «PDF» de los
     módulos salen con el mismo membrete y el mismo visor que los oficios.
     `secciones` = [{ t, cols:[..], num:[índices numéricos], filas:[[..]] }].
     Cada tabla se parte en bloques de 16 renglones con su encabezado
     repetido, porque paginar() mueve bloques enteros de una hoja a otra. */
  function hojaReporte(o) {
    var cuerpo = [];
    if (o.intro) cuerpo.push(o.intro);
    (o.secciones || []).forEach(function (s) {
      if (s.t) cuerpo.push('<h4 class="hs-sec">' + esc(s.t) + "</h4>");
      var num = s.num || [];
      var cab = "<thead><tr>" + s.cols.map(function (c, i) {
        return "<th" + (num.indexOf(i) >= 0 ? ' class="num"' : "") + ">" + esc(c) + "</th>";
      }).join("") + "</tr></thead>";
      var anchos = s.anchos ? "<colgroup>" + s.anchos.map(function (a) {
        return '<col style="width:' + a + '">'; }).join("") + "</colgroup>" : "";
      if (!s.filas.length) {
        cuerpo.push('<table class="hs-tabla">' + anchos + cab + '<tbody><tr><td colspan="' + s.cols.length +
          '">Sin registros.</td></tr></tbody></table>');
      }
      for (var i = 0; i < s.filas.length; i += 16) {
        cuerpo.push('<table class="hs-tabla">' + anchos + cab + "<tbody>" +
          s.filas.slice(i, i + 16).map(function (f) {
            return "<tr>" + f.map(function (v, j) {
              return "<td" + (num.indexOf(j) >= 0 ? ' class="num"' : "") + ">" +
                (v === null || v === undefined || v === "" ? "—" : esc(String(v))) + "</td>";
            }).join("") + "</tr>";
          }).join("") + "</tbody></table>");
      }
    });
    if (o.nota) cuerpo.push('<div class="hs-nota">' + o.nota + "</div>");
    var ses = sesion ? sesion() : null;
    cuerpo.push('<div class="hs-nota">Generado en el SIAMH el ' + fechaLarga(o.fecha || HOY_ISO()) +
      (ses && ses.n ? " por " + esc(ses.n) : "") + ". Sin código QR: se verifica por folio y sello en ventanilla.</div>");
    return hojaSFS({
      encabezado: '<div class="hs-der">' + (o.lugar || "Tapachula de Córdova y Ordoñez, Chiapas.") + "<br>" +
        fechaLarga(o.fecha || HOY_ISO()) + ".</div>",
      titulo: esc(o.titulo || "REPORTE"),
      cuerpo: cuerpo,
      firma: false,
      ccp: false
    });
  }
  function HOY_ISO() {
    return (window.DATOS && DATOS.HOY) ? String(DATOS.HOY).slice(0, 10) : "2026-08-28";
  }

  /* Reparte el contenido en hojas: mientras una hoja desborde, su último
     bloque pasa al principio de la siguiente. Sin tamaño (hoja oculta) no
     hace nada, para no mover bloques a ciegas. */
  function paginar(raiz) {
    var hojas = (raiz && raiz.querySelectorAll) ? raiz.querySelectorAll(".hoja-sfs") : [];
    Array.prototype.forEach.call(hojas, function (h) {
      var i = 0, guard = 0;
      while (i < h.querySelectorAll(".hs-pag").length && guard++ < 400) {
        var pag = h.querySelectorAll(".hs-pag")[i];
        var c = pag.querySelector(".hs-cont");
        if (!c.clientHeight) return;
        if (c.scrollHeight > c.clientHeight + 1 && c.children.length > 1) {
          var sig = h.querySelectorAll(".hs-pag")[i + 1];
          if (!sig) {
            sig = document.createElement("div");
            sig.className = "hs-pag hs-sig";
            sig.innerHTML = '<div class="hs-cont"></div>';
            h.appendChild(sig);
          }
          var sc = sig.querySelector(".hs-cont");
          sc.insertBefore(c.lastElementChild, sc.firstChild);
        } else {
          i++;
        }
      }
    });
  }

  /* ------------------------------- Vista previa a pantalla completa -----
     23/09/2026: la Dirección pidió que todos los documentos se previsualicen
     igual que el aviso de privacidad del alta: el documento a tamaño carta
     sobre la pantalla, con «Cerrar» e «Imprimir o guardar PDF» arriba. Es
     la única forma de abrir un documento; ningún módulo arma la suya.
     `html` es el documento tal como se imprime (una .hoja-sfs, la .sne-hoja
     de la solicitud SNE o cualquier .doc-imp). `opts.imprimir(cierra)`
     sustituye la impresión directa cuando imprimir es además un acto que
     se registra (la emisión de una constancia); `opts.textoImprimir` es
     el rótulo de ese botón.                                              */
  function verDocumento(html, titulo, opts) {
    opts = opts || {};
    var previo = document.activeElement;
    var velo = document.createElement("div");
    velo.className = "hs-velo";
    velo.setAttribute("role", "dialog");
    velo.setAttribute("aria-modal", "true");
    velo.setAttribute("aria-label", titulo || "Documento");
    velo.innerHTML = '<div class="hs-caja"><div class="hs-barra">' +
        '<span class="hs-tit">' + esc(titulo || "Documento") + "</span>" +
        '<span class="hs-acc">' +
          '<button type="button" class="btn btn-secundario btn-s hs-cerrar">Cerrar</button>' +
          '<button type="button" class="btn btn-primario btn-s hs-imp">' + icono("pdf") +
            esc(opts.textoImprimir || "Imprimir o guardar PDF") + "</button></span></div>" +
      html + "</div>";
    Array.prototype.forEach.call(velo.querySelectorAll(".hoja-sfs"), function (h) {
      h.removeAttribute("title");
    });
    document.body.appendChild(velo);
    paginar(velo);
    function cierra() {
      velo.remove();
      document.removeEventListener("keydown", tecla);
      if (previo && previo.focus) previo.focus({ preventScroll:true });
    }
    function tecla(ev) { if (ev.key === "Escape") cierra(); }
    velo.addEventListener("click", function (ev) { if (ev.target === velo) cierra(); });
    velo.querySelector(".hs-cerrar").onclick = cierra;
    velo.querySelector(".hs-imp").onclick = function () {
      if (opts.imprimir) opts.imprimir(cierra);
      else imprimir(html, titulo);
    };
    document.addEventListener("keydown", tecla);
    velo.querySelector(".hs-imp").focus();
  }

  /* Botonera estándar junto a una vista previa. Va dentro del contenedor
     del documento (o de uno marcado con `data-doc-caja`) y actúa sobre el
     documento que haya ahí, así la vista en vivo y lo que se abre o se
     imprime nunca difieren.                                              */
  function barraDoc(titulo, rotulo) {
    return '<div class="doc-barra" data-doc-titulo="' + esc(titulo || "Documento") + '">' +
      '<span class="doc-lbl">' + esc(rotulo || "Vista previa") + "</span>" +
      '<span class="doc-acc">' +
      '<button type="button" class="btn btn-secundario btn-s" data-doc="ver">' + icono("ojo") +
        "Ver vista previa</button>" +
      '<button type="button" class="btn btn-primario btn-s" data-doc="imprimir">' + icono("pdf") +
        "Imprimir o guardar PDF</button></span></div>";
  }
  var DOC_SEL = ".hoja-sfs, .sne-hoja, .doc-imp";
  function docDe(el) {
    var caja = el.closest("[data-doc-caja]") || el.parentNode;
    while (caja && caja !== document.body && !caja.querySelector(DOC_SEL)) caja = caja.parentNode;
    return caja && caja.querySelector ? caja.querySelector(DOC_SEL) : null;
  }
  function tituloDe(el) {
    var t = el.closest("[data-doc-titulo]");
    return t ? t.getAttribute("data-doc-titulo") : "Documento";
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    /* Botones de la botonera estándar. */
    var b = e.target.closest("[data-doc]");
    if (b && !b.closest(".hs-velo")) {
      var d = docDe(b);
      if (!d) return;
      var copia = d.cloneNode(true);
      copia.removeAttribute("title");
      if (b.getAttribute("data-doc") === "imprimir") imprimir(copia.outerHTML, tituloDe(b));
      else verDocumento(copia.outerHTML, tituloDe(b));
      return;
    }
    /* Clic sobre la hoja misma: el mismo visor. */
    var h = e.target.closest(".hoja-sfs");
    if (!h || h.closest(".hs-velo") || h.closest("#zonaImpresion")) return;
    var c = h.cloneNode(true);
    c.removeAttribute("title");
    verDocumento(c.outerHTML, tituloDe(h));
  });

  /* Textos literales de los tres oficios de «Recursos y plantillas». Los
     blancos (_____) de la plantilla se llenan con el dato del expediente,
     marcado en la vista previa; si el dato falta, queda el blanco. */
  function blanco(valor, largo) {
    return valor ? '<span class="o-var">' + esc(valor) + "</span>"
                 : new Array((largo || 20) + 1).join("_");
  }
  var PLANTILLAS_SFS = {
    salud: function (d) {
      var mun = (d.mun || "Tapachula").toUpperCase();
      return {
        asunto: "Solicitud de atención a personas<br>en contexto de movilidad",
        dest: "A las personas titulares de los centros de salud<br>del municipio de " + esc(mun) + ", Chiapas",
        cuerpo: [
          "Por medio del presente, la <b>Subsecretaría de Movilidad Humana a través de la Secretaría de la Frontera Sur</b>, en el ámbito de sus atribuciones, se permite solicitar atentamente su colaboración para garantizar la atención médica de las <b>personas en contexto de movilidad humana</b> que acudan a ese Centro de Salud y requieran de los servicios correspondientes.",
          "Lo anterior, con fundamento en los artículos <b>1º y 4º de la Constitución Política de los Estados Unidos Mexicanos</b>, relativos a la protección de los derechos humanos y al derecho a la protección de la salud; <b>1º y 2º de la Ley General de Salud,</b> así como en los artículos <b>9, 10, 12, 13, 23, 26, 27 y 42 de la Ley para la Atención y Protección a los Derechos de las Personas en Contexto de Movilidad Humana del Estado de Chiapas</b>, que establecen, entre otros aspectos, la obligación de garantizar sus derechos humanos, el acceso a los servicios de salud y la atención médica urgente, <b>sin importar su situación migratoria y bajo condiciones de igualdad y no discriminación</b>.",
          "En virtud de lo anterior, se solicita que las personas en contexto de movilidad humana que requieran atención sean recibidas y atendidas conforme a los servicios, protocolos y capacidades institucionales correspondientes, procurando en todo momento un <b>trato digno, respetuoso y libre de discriminación</b>, independientemente de su nacionalidad, condición o situación migratoria. Asimismo, cuando la atención requerida exceda las capacidades de ese Centro de Salud, se agradecerá realizar la <b>canalización correspondiente a la unidad médica competente</b>, procurando evitar barreras administrativas que puedan obstaculizar el acceso efectivo al derecho a la salud, particularmente en casos de urgencia o cuando se trate de personas en situación de especial vulnerabilidad.",
          "La presente solicitud tiene como finalidad fortalecer la <b>coordinación interinstitucional</b> y contribuir a la protección efectiva del derecho a la salud de las personas en contexto de movilidad humana que se encuentran o transitan por el municipio de " + esc(d.mun || "Tapachula") + ".",
          "Agradeciendo de antemano su valiosa colaboración y disposición institucional, quedamos a disposición para establecer los mecanismos de coordinación que resulten necesarios.",
          "Reciba un cordial saludo."
        ]
      };
    },
    nna: function (d) {
      return {
        asunto: "Solicitud de intervención y<br>protección de NNA no acompañado.",
        dest: "Titular de la Procuraduría de Protección de Niñas, Niños, Adolescentes.",
        cuerpo: [
          "Por medio del presente, la <b>Subsecretaría de Movilidad Humana a través de la Secretaría de la Frontera Sur</b>, en el ámbito de sus atribuciones, solicita atentamente la intervención de esta Procuraduría para brindar <b>protección integral y atención especializada</b> a la persona adolescente " + blanco(d.nombre, 21) + ", de nacionalidad " + blanco(d.nacionalidad, 19) + ", quien se encuentra en contexto de movilidad humana y ha sido identificada como <b>NNA no acompañado.</b>",
          "Lo anterior, con fundamento en los artículos <b>1º y 4º de la Constitución Política de los Estados Unidos Mexicanos</b>; <b>89, 90, 91, 92 y 93 de la Ley General de los Derechos de Niñas, Niños y Adolescentes</b>; así como <b>100, 101, 102 y 103 de la Ley de los Derechos de Niñas, Niños y Adolescentes del Estado de Chiapas</b>, disposiciones que establecen la obligación de las autoridades de adoptar medidas especiales de protección para niñas, niños y adolescentes en contexto de movilidad humana, privilegiando en todo momento el <b>interés superior de la niñez</b>, la protección integral de sus derechos y el acceso a la asistencia y representación que corresponda.",
          "En virtud de lo anterior, se solicita respetuosamente que, en el ámbito de sus atribuciones, esa Procuraduría realice la valoración correspondiente y determine las medidas de protección necesarias, así como las acciones conducentes para la restitución y garantía de sus derechos, incluyendo, en su caso, la representación jurídica y el acompañamiento durante los procedimientos que correspondan. Asimismo, se agradecerá considerar las condiciones particulares de la persona adolescente, su opinión y necesidades específicas, procurando en todo momento que las medidas adoptadas sean acordes con su interés superior, dignidad, integridad y derecho a ser escuchada, así como con los principios de no discriminación y protección integral.",
          "De igual manera, en caso de requerirse alojamiento, atención especializada, asistencia psicológica, médica, jurídica o cualquier otro servicio de protección, se solicita realizar las canalizaciones y gestiones correspondientes ante las instancias competentes, a fin de garantizar una atención integral y oportuna. La presente solicitud tiene como finalidad fortalecer la coordinación interinstitucional y contribuir a la protección efectiva de los derechos de la persona adolescente, en observancia del marco jurídico nacional y estatal aplicable en materia de niñez y movilidad humana.",
          "Agradeciendo de antemano su atención y colaboración, quedamos a disposición para proporcionar la información y documentación necesaria para el seguimiento del caso.",
          "Sin otro particular, reciba un cordial saludo."
        ]
      };
    },
    familia: function (d) {
      return {
        asunto: "Solicitud de atención y protección integral<br>a familia en contexto de movilidad humana.",
        dest: "Titular de la Procuraduría de Protección de Niñas, Niños,<br>Adolescentes y la Familia<br>",
        cuerpo: [
          "Por medio del presente, la <b>Subsecretaría de Movilidad Humana de la Secretaría de la Frontera Sur</b>, en el ámbito de sus atribuciones, solicita atentamente la intervención de esa Procuraduría para brindar <b>atención, orientación y protección integral</b> a la familia de nombres " + blanco(d.nombres, 31) + ", quienes se encuentran en contexto de movilidad humana y actualmente requieren acompañamiento institucional para la identificación y atención de sus necesidades.",
          "Lo anterior, con fundamento en los artículos <b>1º y 4º de la Constitución Política de los Estados Unidos Mexicanos</b>; así como en los artículos <b>9, 10, 12, 13, 23, 26 y 27 de la Ley para la Atención y Protección a los Derechos de las Personas en Contexto de Movilidad Humana del Estado de Chiapas</b>, y <b>15 fracción IV, 42, 100, 101 y 103 de la Ley de los Derechos de Niñas, Niños y Adolescentes del Estado de Chiapas</b>, particularmente aquellas relativas al interés superior de la niñez, derecho a vivir en familia, protección integral, igualdad y no discriminación.",
          "En virtud de lo anterior, se solicita respetuosamente que, en el ámbito de sus atribuciones, esa Procuraduría <b>realice la valoración integral de la familia y determine las medidas de protección que, en su caso, resulten necesarias</b>, particularmente respecto de las niñas, niños o adolescentes que la integren, procurando en todo momento salvaguardar su interés superior, integridad, dignidad y derecho a vivir en familia. Asimismo, se solicita que, de considerarse necesario, se realicen las <b>gestiones y canalizaciones correspondientes</b> para facilitar el acceso a servicios de asistencia jurídica, psicológica, médica, social, alojamiento u otros que contribuyan a la protección y restitución de sus derechos.",
          "Lo anterior, bajo los principios de <b>interés superior de la niñez, unidad familiar, igualdad, no discriminación, dignidad humana y protección integral</b>, con independencia de la nacionalidad o situación migratoria de las personas integrantes de la familia.",
          "La presente solicitud tiene como finalidad fortalecer la coordinación interinstitucional y contribuir a garantizar una atención oportuna e integral a las personas en contexto de movilidad humana, particularmente cuando se encuentren en condiciones de vulnerabilidad.",
          "Agradeciendo de antemano su atención y colaboración, esta Subsecretaría queda a disposición para proporcionar la información y documentación necesaria para el seguimiento y atención del caso.",
          "Sin otro particular, reciba un cordial saludo."
        ]
      };
    }
  };
  function plantillaSFS(id, datos) {
    return PLANTILLAS_SFS[id] ? PLANTILLAS_SFS[id](datos || {}) : null;
  }

  /* ------------------------------------------------ ZIP sin compresión --
     Un .xlsx es un ZIP de archivos XML. Para exportar sin bibliotecas ni
     servidor basta el método STORE (sin comprimir): cabecera local,
     directorio central y cierre, con su CRC-32. `archivos` es
     { "ruta/dentro.xml": "texto" }; devuelve un Blob.                     */
  var CRC_T = null;
  function crc32(bytes) {
    if (!CRC_T) {
      CRC_T = [];
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        CRC_T[n] = c >>> 0;
      }
    }
    var crc = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) crc = CRC_T[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(archivos, tipo) {
    var enc = new TextEncoder(), partes = [], central = [], off = 0;
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    Object.keys(archivos).forEach(function (ruta) {
      var nom = enc.encode(ruta), dat = enc.encode(archivos[ruta]), crc = crc32(dat);
      var comun = [].concat(u16(20), u16(0x0800), u16(0), u16(0), u16(0x21),
                            u32(crc), u32(dat.length), u32(dat.length), u16(nom.length), u16(0));
      var loc = new Uint8Array([].concat(u32(0x04034b50), comun));
      partes.push(loc, nom, dat);
      central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), comun,
        u16(0), u16(0), u16(0), u32(0), u32(off))), nom);
      off += loc.length + nom.length + dat.length;
    });
    var tamCentral = central.reduce(function (a, b) { return a + b.length; }, 0);
    var fin = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0),
      u16(Object.keys(archivos).length), u16(Object.keys(archivos).length),
      u32(tamCentral), u32(off), u16(0)));
    return new Blob(partes.concat(central, [fin]), { type: tipo || "application/zip" });
  }
  function descargar(blob, nombre) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ------------------------------------------ Imprimir o guardar PDF ----
     Imprime SOLO el documento, a tamaño carta y sin márgenes del navegador:
     el resto de la página se oculta mientras dura la impresión. En el
     diálogo del navegador, «Guardar como PDF» produce el archivo.        */
  function imprimir(html, titulo) {
    var z = document.getElementById("zonaImpresion");
    if (z) z.remove();
    z = document.createElement("div");
    z.id = "zonaImpresion";
    z.innerHTML = html;
    document.body.appendChild(z);
    paginar(z);
    var t0 = document.title;
    if (titulo) document.title = titulo;
    document.body.classList.add("imprimiendo");
    function fin() {
      document.body.classList.remove("imprimiendo");
      document.title = t0;
      z.remove();
      window.removeEventListener("afterprint", fin);
    }
    window.addEventListener("afterprint", fin);
    window.print();
  }

  /* ------------------------------------------------ Chrome institucional -- */
  var MENU = [
    { g: "Operación" },
    { id: "inicio",      txt: "Inicio",                 href: "index.html",          ico: "inicio" },
    { id: "registro",    txt: "Registro de Persona",    href: "registro.html",       ico: "registro" },
    { id: "expedientes", txt: "Expedientes",            href: "expedientes.html",    ico: "expedientes" },
    { id: "familiar",    txt: "Expediente Familiar",    href: "familiar.html",       ico: "familia", pill: "1" },
    { id: "salud",       txt: "Salud y Vulnerabilidad", href: "salud.html",          ico: "salud" },
    { g: "Direcciones" },
    { id: "empleo",      txt: "Empleabilidad",          href: "empleabilidad.html",  ico: "empleo" },
    { id: "capacita",    txt: "Capacitación",           href: "capacitacion.html",   ico: "capacita" },
    { id: "censo",       txt: "Censo Empresarial",      href: "censo.html",          ico: "censo" },
    { g: "Documentos y control" },
    { id: "canaliza",    txt: "Canalizaciones",         href: "canalizaciones.html", ico: "oficios" },
    { id: "revalida",    txt: "Revalidación de Estudios", href: "revalidacion.html", ico: "estudios" },
    { id: "documenta",   txt: "Documentación e Identidad", href: "documentacion.html", ico: "identidad" },
    { id: "constancia",  txt: "Constancias",            href: "constancias.html",    ico: "constancia" },
    { id: "admin",       txt: "Administración",         href: "administracion.html", ico: "admin" }
  ];

  function chrome(paginaActiva) {
    var yo = sesion();
    var cont = document.createElement("div");
    cont.innerHTML =
      '<a href="#contenidoPrincipal" class="saltar-enlace">Saltar al contenido principal</a>' +
      '<header class="topbar">' +
        /* Solo aparece por debajo de 900 px, que es donde el menú lateral se
           esconde. Sin él, en un teléfono no había forma de navegar: el
           censo empresarial (RF15) se usa justamente ahí.                */
        '<button class="menu-btn" id="btnMenu" aria-label="Contraer el menú" ' +
          'aria-expanded="true" aria-controls="navLateral">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
          'stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
          '<path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
        '<a class="marca" href="index.html">' +
          '<img class="marca-logo" src="assets/img/simh-isotipo.png" alt="Logo SIAMH" width="38" height="38">' +
          '<span><span class="marca-t">SIAMH</span>' +
          '<span class="marca-s">Secretaría de la Frontera Sur</span></span>' +
        "</a>" +
        '<div class="buscador">' +
          '<span class="icono" style="color:#fff">' + icono("buscar") + "</span>" +
          '<input type="text" placeholder="Buscar por folio, CURP o nombre" aria-label="Búsqueda global">' +
        "</div>" +
        '<div class="topbar-der">' +
          (sinDatos() ? '<a class="chip-modo" href="administracion.html?tab=datos" ' +
            'title="Los datos de prueba están limpios">Sin datos de prueba</a>' : "") +
          '<button class="campana" aria-label="Notificaciones" style="color:#fff">' +
            icono("campana") + (sinDatos() ? "" : '<span class="badge">7</span>') + '</button>' +
          '<div class="menu-cuenta">' +
            '<button class="usuario" id="btnCuenta" aria-haspopup="menu" aria-expanded="false" ' +
              'aria-controls="popCuenta">' +
              '<span class="avatar">' + esc(yo.ini) + '</span>' +
              '<span class="u-txt"><span class="u-nombre">' + esc(yo.n) + '</span><br>' +
              '<span class="u-rol">' + esc(yo.rolT) + ' · ' + esc(yo.mun) + '</span></span>' +
              '<span class="u-caret">' + icono("caret") + "</span>" +
            "</button>" +
            '<div class="menu-pop" id="popCuenta" role="menu" aria-labelledby="btnCuenta" hidden>' +
              '<div class="m-cab"><strong>' + esc(yo.n) + '</strong>' +
                "<span>" + esc(yo.rolT) + " · " + esc(SEDES[yo.sede].t) + "</span></div>" +
              '<a role="menuitem" href="#">' + icono("persona") + "Mi perfil</a>" +
              '<a role="menuitem" href="#">' + icono("llave") + "Cambiar contraseña</a>" +
              '<a role="menuitem" href="#">' + icono("ayuda") + "Ayuda y soporte</a>" +
              '<div class="m-sep"></div>' +
              '<div class="m-grupo">Cambiar de cuenta · demostración</div>' +
              CUENTAS.filter(function (c) { return c.usu !== yo.usu; }).map(function (c) {
                return '<button type="button" role="menuitem" class="m-cuenta" data-cuenta="' + c.usu + '">' +
                  '<span class="avatar">' + esc(c.ini) + '</span><span>' + esc(c.n) +
                  '<small>' + esc(c.rolT) + ' · ' + esc(SEDES[c.sede].t) + '</small></span></button>';
              }).join("") +
              '<div class="m-sep"></div>' +
              '<a role="menuitem" class="m-salir" href="login.html?salir=1">' +
                icono("salir") + "Cerrar sesión</a>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</header>";

    var nav = '<div class="sidebar-velo" id="veloMenu" hidden></div>' +
      '<aside class="sidebar" id="navLateral"><nav>';
    MENU.forEach(function (m) {
      if (m.g) { nav += '<div class="nav-grupo">' + m.g + "</div>"; return; }
      /* Un módulo restringido por sede no se dibuja fuera de ella. */
      if (!accesoSede(m.id, yo)) return;
      nav += '<a class="nav-item' + (m.id === paginaActiva ? " activo" : "") + '" href="' + m.href + '">' +
        icono(m.ico) + "<span>" + m.txt + "</span>" +
        (m.pill && !sinDatos() ? '<span class="pill">' + m.pill + "</span>" : "") + "</a>";
    });
    nav += "</nav>" +
      '<div class="firma">HUMANISMO QUE TRANSFORMA<br>GOBIERNO DE CHIAPAS 2024–2030</div></aside>';
    cont.innerHTML += nav;

    var frag = document.createDocumentFragment();
    while (cont.firstChild) frag.appendChild(cont.firstChild);
    document.body.insertBefore(frag, document.body.firstChild);

    var main = document.querySelector(".contenido");
    if (main && !main.id) {
      main.id = "contenidoPrincipal";
      main.setAttribute("tabindex", "-1");
    }

    menuCuenta();
    menuLateral();
  }

  /* ------------------------------------------------------ Menú lateral ---
     Un solo botón con un solo significado —mostrar u ocultar el menú— que
     hace dos cosas según el ancho, porque en cada uno estorba algo distinto:

       · En escritorio (>900 px) el lateral no puede desaparecer: es la
         navegación. Se contrae a un RIEL de iconos que devuelve 178 px al
         contenido y conserva el sitio de cada entrada, de modo que la
         memoria muscular no se rompe. La preferencia se recuerda.
       · Por debajo de 900 px el lateral ya está fuera de pantalla y el
         botón abre el CAJÓN sobre el contenido, con velo y Escape.

     En el riel el rótulo sigue en el DOM para el lector de pantalla, y para
     quien mira se muestra como etiqueta flotante al pasar el ratón Y AL
     ENFOCAR CON EL TECLADO: si solo respondiera al hover, navegar con
     teclado por el riel sería recorrer iconos sin nombre.               */
  function menuLateral() {
    var btn  = document.getElementById("btnMenu");
    var nav  = document.getElementById("navLateral");
    var velo = document.getElementById("veloMenu");
    if (!btn || !nav || !velo) return;

    var raiz = document.documentElement;
    function anchura() { return window.matchMedia("(min-width:901px)").matches; }
    function enRiel()  { return raiz.classList.contains("menu-riel"); }
    function abierto() { return nav.classList.contains("abierto"); }

    /* Etiqueta flotante: una sola, reutilizada, suelta en <body> para que no
       la recorte el overflow del lateral. */
    var tip = document.createElement("div");
    tip.className = "nav-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);

    /* La entrada que la etiqueta está describiendo. Se guarda porque hay que
       recolocarla en cada desplazamiento: `position:fixed` no sigue al
       elemento. Al principio el scroll la ocultaba, y eso la volvía
       invisible con el teclado: enfocar una entrada hace que el navegador la
       desplace a la vista, ese desplazamiento disparaba el ocultado y la
       etiqueta desaparecía en el mismo cuadro en que aparecía.           */
    var itemTip = null;

    function coloca() {
      if (!itemTip) return;
      var r = itemTip.getBoundingClientRect();
      var lat = nav.getBoundingClientRect();
      var top = r.top + r.height / 2 - tip.offsetHeight / 2;
      top = Math.max(8, Math.min(top, window.innerHeight - tip.offsetHeight - 8));
      tip.style.top = Math.round(top) + "px";
      /* Contra el borde del riel, no contra el del icono: el icono va
         centrado dentro del relleno del <nav> y la etiqueta quedaba pegada. */
      tip.style.left = Math.round(lat.right + 10) + "px";
    }

    function muestraTip(item) {
      if (!enRiel() || !anchura()) return;
      var rot = item.querySelector("span:not(.pill)");
      if (!rot) return;
      tip.textContent = rot.textContent;
      tip.hidden = false;
      itemTip = item;
      coloca();
    }
    function ocultaTip() { itemTip = null; tip.hidden = true; }

    nav.addEventListener("mouseover", function (e) {
      var it = e.target.closest ? e.target.closest(".nav-item") : null;
      if (it) muestraTip(it);
    });
    nav.addEventListener("mouseout", ocultaTip);
    nav.addEventListener("focusin", function (e) {
      var it = e.target.closest ? e.target.closest(".nav-item") : null;
      if (it) muestraTip(it);
    });
    nav.addEventListener("focusout", ocultaTip);
    window.addEventListener("scroll", coloca, true);

    /* El rótulo del botón dice lo que va a pasar, no en qué estado está:
       "Contraer el menú" / "Abrir el menú". */
    function rotula() {
      if (anchura()) {
        btn.setAttribute("aria-expanded", String(!enRiel()));
        btn.setAttribute("aria-label", enRiel() ? "Abrir el menú" : "Contraer el menú");
      } else {
        btn.setAttribute("aria-expanded", String(abierto()));
        btn.setAttribute("aria-label", abierto() ? "Cerrar el menú" : "Abrir el menú");
      }
    }

    function cajon(v) {
      nav.classList.toggle("abierto", v);
      velo.hidden = !v;
      rotula();
      if (v) { var p = nav.querySelector(".nav-item"); if (p) p.focus(); }
      else btn.focus();
    }

    function riel(v) {
      raiz.classList.toggle("menu-riel", v);
      guardaPref(v ? "riel" : "abierto");
      ocultaTip();
      rotula();
    }

    btn.addEventListener("click", function () {
      if (anchura()) riel(!enRiel());
      else cajon(!abierto());
    });

    velo.addEventListener("click", function () { cajon(false); });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!anchura() && abierto()) cajon(false);
      else if (anchura() && enRiel()) { riel(false); btn.focus(); }
    });

    /* Al cruzar el umbral cambia lo que significa el botón; el cajón abierto
       se cierra para no quedar con velo sobre un lateral que ya es fijo. */
    window.addEventListener("resize", function () {
      if (anchura() && abierto()) { nav.classList.remove("abierto"); velo.hidden = true; }
      ocultaTip();
      rotula();
    });

    rotula();
  }

  /* Menú de cuenta: abre con clic, cierra con Escape o clic fuera. */
  function menuCuenta() {
    var btn = document.getElementById("btnCuenta");
    var pop = document.getElementById("popCuenta");
    if (!btn || !pop) return;

    function abrir(v) {
      pop.hidden = !v;
      btn.setAttribute("aria-expanded", v ? "true" : "false");
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      abrir(pop.hidden);
    });
    Array.prototype.forEach.call(pop.querySelectorAll("[data-cuenta]"), function (b) {
      b.addEventListener("click", function () {
        iniciarSesion(this.getAttribute("data-cuenta"));
        location.reload();
      });
    });
    document.addEventListener("click", function (e) {
      if (!pop.hidden && !pop.contains(e.target)) abrir(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pop.hidden) { abrir(false); btn.focus(); }
    });
  }

  /* ------------------------------------------------------- Utilidades ---- */
  function n(v) { return v.toLocaleString("es-MX"); }
  function pct(v, t) { return (Math.round((v / t) * 1000) / 10).toFixed(1) + "%"; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function techo(max) {
    var p = Math.pow(10, String(Math.round(max)).length - 1);
    return Math.ceil(max / (p / 2)) * (p / 2);
  }

  /* --------------------------------------------- Columnas (tendencia) ---- */
  function columnas(datos, opt) {
    opt = opt || {};
    var W = 640, H = 190, pl = 40, pb = 24, pt = 18, pr = 6;
    var max = Math.max.apply(null, datos.map(function (d) { return d.v; }));
    var tope = techo(max);
    var iw = W - pl - pr, ih = H - pt - pb;
    var band = iw / datos.length, bw = Math.min(24, band * 0.5), r = 4;
    var iMax = datos.reduce(function (a, d, i) { return d.v > datos[a].v ? i : a; }, 0);
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;height:auto;display:block" role="img" ' +
            'aria-label="' + esc(opt.alt || "") + '">';
    [0, 0.5, 1].forEach(function (f) {
      var y = pt + ih - ih * f;
      s += '<line x1="' + pl + '" y1="' + y + '" x2="' + (W - pr) + '" y2="' + y + '" stroke="' + REJA + '" stroke-width="1"/>' +
           '<text x="' + (pl - 8) + '" y="' + (y + 3.5) + '" text-anchor="end" font-size="10" fill="' + EJE +
           '" font-family="Poppins,sans-serif" style="font-variant-numeric:tabular-nums">' + n(tope * f) + "</text>";
    });
    datos.forEach(function (d, i) {
      var h = Math.max(2, (d.v / tope) * ih), x = pl + i * band + (band - bw) / 2, y = pt + ih - h;
      var rr = Math.min(r, h);
      s += '<path d="M' + x + " " + (y + rr) + " a" + rr + " " + rr + " 0 0 1 " + rr + " " + (-rr) +
           " h" + (bw - 2 * rr) + " a" + rr + " " + rr + " 0 0 1 " + rr + " " + rr +
           " v" + (h - rr) + " h" + (-bw) + ' Z" fill="' + (i === datos.length - 1 ? TINTA.d3 : TINTA.d2) + '">' +
           "<title>" + esc(d.k) + ": " + n(d.v) + "</title></path>";
      if (i === datos.length - 1 || i === iMax) {
        s += '<text x="' + (x + bw / 2) + '" y="' + (y - 6) + '" text-anchor="middle" font-size="10.5" font-weight="600" ' +
             'fill="#1A1A1A" font-family="Poppins,sans-serif">' + n(d.v) + "</text>";
      }
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="' + EJE +
           '" font-family="Poppins,sans-serif">' + esc(d.k) + "</text>";
    });
    return s + "</svg>";
  }

  /* ------------------------------------------------------- Sparkline ----- */
  function sparkline(datos, opt) {
    opt = opt || {};
    var W = 260, H = 44, p = 4;
    var vs = datos.map(function (d) { return d.v; });
    var max = Math.max.apply(null, vs), min = Math.min.apply(null, vs);
    var rango = max - min || 1;
    var pts = datos.map(function (d, i) {
      return [p + (i * (W - 2 * p)) / (datos.length - 1), H - p - ((d.v - min) / rango) * (H - 2 * p)];
    });
    var d = pts.map(function (pt, i) { return (i ? "L" : "M") + pt[0].toFixed(1) + " " + pt[1].toFixed(1); }).join(" ");
    var u = pts[pts.length - 1];
    return '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:260px;height:auto;display:block" ' +
      'role="img" aria-label="' + esc(opt.alt || "Tendencia") + '">' +
      '<path d="' + d + '" fill="none" stroke="' + TINTA.d1 + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="' + u[0].toFixed(1) + '" cy="' + u[1].toFixed(1) + '" r="4" fill="' + TINTA.d3 +
      '" stroke="' + SUP + '" stroke-width="2"/></svg>';
  }

  /* --------------------------------------- Barras horizontales / ranking - */
  function barrasH(datos, opt) {
    opt = opt || {};
    var max = Math.max.apply(null, datos.map(function (d) { return d.v; }));
    return datos.map(function (d) {
      return '<div class="hbar' + (d.tenue ? " tenue" : "") + '"><span class="h-lab">' + esc(d.k) + "</span>" +
        '<span class="h-pista"><span class="h-fill" style="width:' + Math.max(1.5, (d.v / max) * 100) + "%" +
        (d.c ? ";background:" + d.c : "") + '"></span></span>' +
        '<span class="h-val">' + n(d.v) + "</span></div>";
    }).join("");
  }

  /* ------------------------------------------- Barra apilada (parte/todo) */
  function apilada(datos, opt) {
    opt = opt || {};
    var total = datos.reduce(function (a, d) { return a + d.v; }, 0);
    var W = 600, H = 34, gap = 2;
    var x = 0, s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;height:auto;display:block" role="img" ' +
                   'aria-label="' + esc(opt.alt || "") + '">';
    datos.forEach(function (d, i) {
      var w = (d.v / total) * W - (i < datos.length - 1 ? gap : 0);
      s += '<rect x="' + x + '" y="0" width="' + Math.max(2, w) + '" height="' + H + '" rx="2" fill="' + d.c + '">' +
           "<title>" + esc(d.k) + ": " + n(d.v) + " (" + pct(d.v, total) + ")</title></rect>";
      if (w > 96) {
        s += '<text x="' + (x + 10) + '" y="' + (H / 2 + 4) + '" font-size="12" font-weight="600" fill="#FFFFFF" ' +
             'font-family="Poppins,sans-serif">' + pct(d.v, total) + "</text>";
      }
      x += w + gap;
    });
    s += "</svg>";
    s += '<div class="gr-leyenda">' + datos.map(function (d) {
      return '<span><i style="background:' + d.c + '"></i>' + esc(d.k) + " <b>" + n(d.v) + "</b></span>";
    }).join("") + "</div>";
    return s;
  }

  /* -------------------------------- Mapa esquemático de burbujas --------- */
  function mapaBurbujas(datos) {
    var max = Math.max.apply(null, datos.map(function (d) { return d.v; }));
    var s = '<svg viewBox="0 0 400 285" style="width:100%;height:auto;display:block" role="img" ' +
      'aria-label="Mapa esquemático de atención por municipio">' +
      '<path d="M55 105 L120 45 L215 35 L300 55 L372 140 L330 215 L250 268 L150 235 L88 168 Z" ' +
      'fill="#F7F6F3" stroke="' + REJA + '" stroke-width="1.5"/>';
    datos.forEach(function (d) {
      var r = 9 + Math.sqrt(d.v / max) * 22;
      s += '<circle cx="' + d.x + '" cy="' + d.y + '" r="' + r.toFixed(1) + '" fill="rgba(0,138,123,.22)" stroke="' +
        TINTA.d3 + '" stroke-width="1.5"><title>' + esc(d.k) + ": " + n(d.v) + "</title></circle>" +
        '<text x="' + d.x + '" y="' + (d.y - r - 5) + '" text-anchor="middle" font-size="10" fill="#5F5F5F" ' +
        'font-family="Poppins,sans-serif">' + esc(d.k) + "</text>";
    });
    return s + "</svg>";
  }

  /* ------------------------------------------------ Tabla gemela --------- */
  function tablaDatos(datos, cols) {
    cols = cols || ["Categoría", "Personas"];
    var total = datos.reduce(function (a, d) { return a + d.v; }, 0);
    return '<table class="tabla-datos"><thead><tr><th>' + cols[0] + '</th><th class="num">' + cols[1] +
      '</th><th class="num">%</th></tr></thead><tbody>' +
      datos.map(function (d) {
        return "<tr><td>" + esc(d.k) + '</td><td class="num">' + n(d.v) + '</td><td class="num">' + pct(d.v, total) + "</td></tr>";
      }).join("") + "</tbody></table>";
  }

  /* --------------------------------------------------- Tarjeta gráfica --- */
  /* Construye encabezado + gráfica + tabla gemela con su alternador.        */
  var _gid = 0;
  function grafica(caja, o) {
    var id = "gr" + (++_gid);
    var render = { columnas: columnas, barras: barrasH, apilada: apilada, mapa: mapaBurbujas }[o.tipo];
    var vista = o.tipo === "barras" ? render(o.datos, o) : render(o.datos, o);
    caja.innerHTML =
      '<div class="grafica-enc"><h3>' + esc(o.titulo) + "</h3>" +
      (o.sinTabla ? "" : '<button class="ver-tabla" type="button" data-obj="' + id + '">Ver tabla</button>') + "</div>" +
      (o.sub ? '<div class="grafica-sub">' + o.sub + "</div>" : "") +
      '<div class="gr-vista" id="' + id + '-v">' + vista + "</div>" +
      '<div class="gr-tabla oculto" id="' + id + '-t">' + tablaDatos(o.datos, o.cols) + "</div>" +
      (o.pie ? '<div class="tarjeta-pie">' + o.pie + "</div>" : "");
    var btn = caja.querySelector(".ver-tabla");
    if (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById(id + "-v"), t = document.getElementById(id + "-t");
        var verTabla = t.classList.contains("oculto");   /* estaba oculta: mostrarla */
        t.classList.toggle("oculto", !verTabla);
        v.classList.toggle("oculto", verTabla);
        btn.textContent = verTabla ? "Ver gráfica" : "Ver tabla";
      });
    }
  }

  /* ------------------------------------------------------- Pestañas ------ */
  function pestanas(cont) {
    cont.addEventListener("click", function (e) {
      var b = e.target.closest(".pestana");
      if (!b) return;
      cont.querySelectorAll(".pestana").forEach(function (p) { p.classList.remove("activa"); });
      b.classList.add("activa");
      var destino = b.getAttribute("data-panel");
      if (!destino) return;
      document.querySelectorAll("[data-panel-id]").forEach(function (p) {
        p.classList.toggle("oculto", p.getAttribute("data-panel-id") !== destino);
      });
    });
  }

  /* ---------------------------------- Notificaciones Toast ------------------ */
  function toast(mensaje, tipo, duracion) {
    tipo = tipo || "ok";
    duracion = duracion || 3200;
    var cont = document.getElementById("toastContenedor");
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "toastContenedor";
      cont.className = "toast-contenedor";
      document.body.appendChild(cont);
    }
    var t = document.createElement("div");
    t.className = "toast toast-" + tipo;
    t.setAttribute("role", "status");
    t.innerHTML = (tipo === "ok" ? icono("check") : tipo === "alerta" ? icono("alerta") : icono("info")) +
      "<span>" + esc(mensaje) + "</span>";
    cont.appendChild(t);
    setTimeout(function () {
      t.style.opacity = "0";
      t.style.transform = "translateY(8px)";
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 200);
    }, duracion);
  }

  /* ------------------------------- Gestor de Caso y Cajón Selector ---------- */
  function gestorCaso(config) {
    config = config || {};
    var items = config.items || [];
    var indiceActual = config.indiceInicial || 0;
    var tituloDrawer = config.titulo || "Seleccionar Persona";
    var placeholder = config.placeholder || "Buscar por nombre, folio o CURP...";

    // Inyectar Drawer en DOM si no existe
    var drawerId = config.drawerId || "drawerSelectorGlobal";
    var backdrop = document.getElementById(drawerId);
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = drawerId;
      backdrop.className = "drawer-backdrop";
      backdrop.innerHTML =
        '<div class="drawer-panel" role="dialog" aria-modal="true" aria-label="' + esc(tituloDrawer) + '">' +
          '<div class="drawer-cab">' +
            '<h3 class="drawer-cab-tit">' + esc(tituloDrawer) + '</h3>' +
            '<button class="drawer-cerrar" type="button" aria-label="Cerrar selector">' +
              '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="drawer-busqueda">' +
            '<input type="text" class="drawer-input" placeholder="' + esc(placeholder) + '" aria-label="Buscar en la lista">' +
            '<div class="drawer-chips" role="group" aria-label="Filtros"></div>' +
          '</div>' +
          '<div class="drawer-lista" role="listbox"></div>' +
          '<div class="drawer-pie">' +
            '<span class="drawer-conteo">0 registros</span>' +
            '<span class="txt-min"><kbd>Esc</kbd> cerrar</span>' +
          '</div>' +
        '</div>';
      document.body.appendChild(backdrop);
    }

    var inputBusca = backdrop.querySelector(".drawer-input");
    var listaEl = backdrop.querySelector(".drawer-lista");
    var conteoEl = backdrop.querySelector(".drawer-conteo");
    var btnCerrar = backdrop.querySelector(".drawer-cerrar");
    var chipsEl = backdrop.querySelector(".drawer-chips");

    var filtroTexto = "";
    var filtroChip = "todos";

    function abrirDrawer() {
      backdrop.classList.add("drawer-abierto");
      if (inputBusca) {
        inputBusca.value = "";
        filtroTexto = "";
        pintarListaDrawer();
        setTimeout(function () { inputBusca.focus(); }, 50);
      }
    }

    function cerrarDrawer() {
      backdrop.classList.remove("drawer-abierto");
    }

    function seleccionar(idx) {
      if (idx < 0 || idx >= items.length) return;
      indiceActual = idx;
      cerrarDrawer();
      if (config.onSelect) config.onSelect(items[idx], idx);
    }

    function siguiente() {
      if (indiceActual < items.length - 1) seleccionar(indiceActual + 1);
    }

    function anterior() {
      if (indiceActual > 0) seleccionar(indiceActual - 1);
    }

    function pintarListaDrawer() {
      var vis = items.filter(function (it, i) {
        if (config.filtraItem) return config.filtraItem(it, filtroTexto, filtroChip);
        var t = JSON.stringify(it).toLowerCase();
        return !filtroTexto || t.indexOf(filtroTexto.toLowerCase()) >= 0;
      });

      if (conteoEl) conteoEl.textContent = vis.length + " disponibles";

      if (!vis.length) {
        listaEl.innerHTML = '<div style="padding:24px 14px;text-align:center;color:var(--gris);font-size:13px">' +
          'No se encontraron registros coincidentes.' +
          /* Cada módulo puede ofrecer qué hacer cuando nadie coincide
             (Empleabilidad: registrar a la persona y atenderla). */
          (config.sinResultados ? config.sinResultados(filtroTexto) : "") + '</div>';
        return;
      }

      listaEl.innerHTML = vis.map(function (it) {
        var idxReal = items.indexOf(it);
        var esActivo = idxReal === indiceActual;
        if (config.renderItem) return config.renderItem(it, esActivo, idxReal);
        return '<button type="button" class="drawer-item' + (esActivo ? ' activo' : '') + '" data-idx="' + idxReal + '">' +
          '<div class="drawer-item-avatar">' + (it.ini || (it.n ? it.n.charAt(0) : 'P')) + '</div>' +
          '<div class="drawer-item-txt">' +
            '<span class="drawer-item-nom">' + esc(it.n || it.curso || it.id || 'Caso') + '</span>' +
            '<span class="drawer-item-sub">' + esc(it.f || it.id || '') + ' · ' + esc(it.pais || it.sede || '') + '</span>' +
          '</div>' +
          (it.urg && it.urg !== 'fin' ? '<span class="chip chip-rosa">!</span>' : '') +
        '</button>';
      }).join("");
    }

    // Eventos del Drawer
    if (btnCerrar) btnCerrar.onclick = cerrarDrawer;
    if (backdrop) {
      backdrop.onclick = function (e) {
        if (e.target === backdrop) cerrarDrawer();
      };
    }

    if (inputBusca) {
      inputBusca.oninput = function () {
        filtroTexto = this.value;
        pintarListaDrawer();
      };
    }

    if (listaEl) {
      listaEl.onclick = function (e) {
        var btn = e.target.closest("[data-idx]");
        if (btn) {
          var idx = parseInt(btn.getAttribute("data-idx"), 10);
          seleccionar(idx);
        }
      };
    }

    // Atajos de teclado: Ctrl+K / Alt+P abre drawer, Esc cierra
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.altKey && e.key.toLowerCase() === "p")) {
        e.preventDefault();
        abrirDrawer();
      } else if (e.key === "Escape" && backdrop.classList.contains("drawer-abierto")) {
        cerrarDrawer();
      }
    });

    return {
      abrir: abrirDrawer,
      cerrar: cerrarDrawer,
      seleccionar: seleccionar,
      siguiente: siguiente,
      anterior: anterior,
      getIndice: function () { return indiceActual; },
      setItems: function (nuevos) { items = nuevos; pintarListaDrawer(); }
    };
  }

  /* ------------------------------- Colapso de panel maestro (retrocompatible) */
  function panelMaestro(config) {
    return { isColapsado: function () { return true; }, setColapsado: function () {} };
  }

  /* ----------------------------------------- Atajos globales de teclado --- */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    var isInput = tag === "input" || tag === "select" || tag === "textarea" || e.target.isContentEditable;
    if (e.key === "/" && !isInput && !e.ctrlKey && !e.altKey && !e.metaKey) {
      var b = document.querySelector('.buscador input[type="text"]');
      if (b) { e.preventDefault(); b.focus(); b.select(); }
    }
    if (e.altKey && (e.key === "n" || e.key === "N")) {
      e.preventDefault(); location.href = "registro.html";
    }
    if (e.altKey && (e.key === "e" || e.key === "E")) {
      e.preventDefault(); location.href = "expedientes.html";
    }
    if (e.altKey && (e.key === "i" || e.key === "I")) {
      e.preventDefault(); location.href = "index.html";
    }
  });

  /* ------------------------------------------- Campos de catálogo -------
     Regla técnica estándar de la opción 'Otro' (Especificación de Mejoras
     §3), escrita una sola vez.

     La regla toca hoy siete campos repartidos en tres archivos —etnia,
     lengua, motivo de migración, estatus, sector, motivo de conclusión y
     motivo de no contratación— y va a tocar más. Escrita siete veces a mano
     son siete comportamientos que empiezan iguales y se separan en cuanto
     alguien corrige uno solo: el que enfoca el campo y el que no, el que lo
     exige y el que deja guardar "Otro" sin decir cuál.

     El contrato es el que pide la especificación:
       · la opción se emite con value="OTRO" —clave estable, independiente
         de cómo esté redactada la etiqueta en pantalla—;
       · al elegirla aparece un campo de texto adyacente y OBLIGATORIO;
       · al dejar de elegirla el texto se limpia, para que no quede una
         especificación huérfana contradiciendo al campo principal;
       · `valorOtro()` devuelve {clave, otro}, que es exactamente la forma
         en que la especificación pide persistirlo.

     El marcado es declarativo: <select data-otro="idDelInput"> y el input
     con data-campo-otro="<etiqueta del campo padre>". Así una pantalla que
     se repinta por innerHTML —empleabilidad lo hace en cada clic— solo
     vuelve a llamar a activarOtro() y no tiene que recordar qué campos
     tenía cableados.                                                     */

  /* Dibuja las opciones de un catálogo. Acepta las tres formas en que los
     catálogos de simh-datos.js están escritos: lista de textos, lista de
     objetos {t:…} y lista de grupos {g:…, p:[…]} para <optgroup>. Un solo
     renderizador evita que cada pantalla invente el suyo.                */
  function opciones(cat, sel, conOtro) {
    function opt(t) {
      return '<option value="' + esc(t) + '"' + (t === sel ? " selected" : "") +
             ">" + esc(t) + "</option>";
    }
    var html = (cat || []).map(function (x) {
      if (x && x.g) {
        return '<optgroup label="' + esc(x.g) + '">' + x.p.map(opt).join("") + "</optgroup>";
      }
      return opt(typeof x === "string" ? x : x.t);
    }).join("");

    if (conOtro) {
      html += '<option value="OTRO"' + (sel === "OTRO" ? " selected" : "") + ">" +
              esc(typeof conOtro === "string" ? conOtro : "Otro (especificar)") + "</option>";
    }
    return html;
  }

  /* Cablea todos los <select data-otro> que haya bajo `raiz`. Idempotente:
     volver a llamarla sobre lo ya cableado no duplica escuchas.          */
  function activarOtro(raiz) {
    var ambito = raiz || document;
    if (!ambito.querySelectorAll) return;

    Array.prototype.forEach.call(ambito.querySelectorAll("select[data-otro]"), function (sel) {
      var libre = document.getElementById(sel.getAttribute("data-otro"));
      if (!libre) return;

      /* `enfoca` distingue el cambio hecho por la persona —donde llevar el
         cursor al campo nuevo ahorra un clic— del primer pintado, donde
         robar el foco movería la pantalla sin que nadie lo pidiera.      */
      function sincroniza(enfoca) {
        var activo = sel.value === "OTRO";
        libre.classList.toggle("oculto", !activo);
        libre.toggleAttribute("data-req", activo);
        if (!activo) {
          libre.value = "";
          var campo = libre.closest ? libre.closest(".campo") : null;
          if (campo) campo.classList.remove("error");
          return;
        }
        if (enfoca) libre.focus();
      }

      if (!sel.getAttribute("data-otro-listo")) {
        sel.addEventListener("change", function () { sincroniza(true); });
        sel.setAttribute("data-otro-listo", "1");
      }
      sincroniza(false);
    });
  }

  /* Lo que se persiste. La especificación lo pide así: clave 'OTRO' en el
     campo principal y el texto en el complementario (etnia_otro, …).     */
  function valorOtro(sel) {
    sel = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (!sel) return null;
    if (sel.value !== "OTRO") return { clave: sel.value, otro: "" };
    var libre = document.getElementById(sel.getAttribute("data-otro") || "");
    return { clave: "OTRO", otro: libre ? libre.value.trim() : "" };
  }

  /* Lo que se muestra: "Otra · Mopán" en un resumen o en un expediente. Un
     renglón que solo dijera "Otra" obliga a volver al formulario para saber
     qué se capturó.

     El prefijo se toma de la etiqueta real de la opción y no de un "Otro"
     fijo, porque el catálogo la redacta concordando con su campo —"Otra
     (especificar)" en etnia y lengua, "Otro país (especificar)" en
     nacionalidad— y un prefijo fijo desharía esa concordancia justo en el
     renglón que se lee.                                                   */
  function textoOtro(sel) {
    sel = typeof sel === "string" ? document.querySelector(sel) : sel;
    var v = valorOtro(sel);
    if (!v) return "";
    if (v.clave !== "OTRO") return v.clave;
    var op = sel.options[sel.selectedIndex];
    var etiqueta = op ? op.text.replace(/\s*\(especificar\)\s*$/i, "") : "Otro";
    return v.otro ? etiqueta + " · " + v.otro : etiqueta + " (sin especificar)";
  }

  /* ------------------------------------------- Teléfono con LADA -------
     Requerimiento 1.7: selector de clave internacional y validación del
     número. El marcado es declarativo, igual que la regla de 'Otro':

       <select id="telResLada"></select>
       <input type="tel" data-lada="telResLada" data-pais="México">

     `data-pais` solo fija la clave inicial; a partir de ahí manda lo que
     elija la ventanilla.

     Por qué esto no es cosmético: el teléfono es la única vía para avisar
     de una cita y es como Empleabilidad verifica a los 15 y 30 días. Un
     número con un dígito de menos no falla hoy, falla dentro de un mes y
     sin dejar rastro de por qué. Por eso la validación no dice "número
     inválido" sino CUÁNTOS dígitos faltan o sobran para el país elegido: un
     mensaje que no dice qué corregir manda a la ventanilla a adivinar.

     Lo que se guarda es E.164 (+50496123456), sin espacios. Lo que se
     muestra va agrupado, que es como la gente lee y dicta un teléfono.   */

  var TEL_GRUPOS = { 7:[3, 4], 8:[4, 4], 9:[3, 3, 3], 10:[3, 3, 4], 11:[2, 5, 4] };

  function telAgrupa(digitos) {
    var patron = TEL_GRUPOS[digitos.length], partes = [], i = 0;
    if (!patron) {
      /* Longitud inesperada: se agrupa de tres en tres para que al menos
         se pueda leer, en vez de devolver una tira de dígitos. */
      for (i = 0; i < digitos.length; i += 3) partes.push(digitos.slice(i, i + 3));
      return partes.join(" ");
    }
    patron.forEach(function (n) { partes.push(digitos.substr(i, n)); i += n; });
    return partes.join(" ");
  }

  function telLada(input) {
    input = typeof input === "string" ? document.querySelector(input) : input;
    if (!input) return null;
    var sel = document.getElementById(input.getAttribute("data-lada") || "");
    if (!sel) return null;
    var datos = global.DATOS ? global.DATOS.LADA : [];
    var x = datos.filter(function (l) { return l.c === sel.value; })[0];
    return x || null;
  }

  /* Lo que se persiste y lo que hace falta para decidir si está bien. */
  function valorTelefono(input) {
    input = typeof input === "string" ? document.querySelector(input) : input;
    if (!input) return null;
    var lada = telLada(input);
    var digitos = String(input.value || "").replace(/\D/g, "");
    var esperados = lada ? lada.d : 0;
    return {
      lada: lada ? lada.c : "",
      pais: lada ? lada.p : "",
      digitos: digitos,
      esperados: esperados,
      nacional: telAgrupa(digitos),
      e164: digitos ? (lada ? lada.c : "") + digitos : "",
      vacio: !digitos,
      valido: !!digitos && digitos.length === esperados
    };
  }

  /* Para un resumen o un expediente: "+504 9612 3456". */
  function textoTelefono(input) {
    var v = valorTelefono(input);
    if (!v || v.vacio) return "";
    return v.lada + " " + v.nacional;
  }

  function telMensaje(v) {
    if (v.vacio) return "";
    if (v.valido) return "Se guarda como <b>" + v.e164 + "</b>.";
    var faltan = v.esperados - v.digitos.length;
    var cuantos = Math.abs(faltan) === 1 ? "1 dígito" : Math.abs(faltan) + " dígitos";
    return "<b>" + (faltan > 0 ? "Faltan " : "Sobran ") + cuantos + "</b> para un número de " +
           v.pais + ", que son " + v.esperados + " dígitos.";
  }

  /* Cablea los <input data-lada> que haya bajo `raiz`. Idempotente, como
     activarOtro(), para pantallas que se repintan por innerHTML.        */
  function activarTelefono(raiz) {
    var ambito = raiz || document;
    if (!ambito.querySelectorAll) return;
    var datos = global.DATOS ? global.DATOS.LADA : [];

    Array.prototype.forEach.call(ambito.querySelectorAll("input[data-lada]"), function (input) {
      var sel = document.getElementById(input.getAttribute("data-lada"));
      if (!sel) return;

      if (!sel.getAttribute("data-lada-listo")) {
        sel.innerHTML = datos.map(function (l) {
          return '<option value="' + esc(l.c) + '">' + esc(l.c + " " + l.p) + "</option>";
        }).join("");
        sel.value = global.DATOS
          ? global.DATOS.ladaDe(input.getAttribute("data-pais") || "México")
          : "+52";
        sel.setAttribute("data-lada-listo", "1");
      }

      var ayuda = document.getElementById(input.id + "Ayuda");

      function revisa(formatear) {
        var v = valorTelefono(input);
        if (formatear && !v.vacio) input.value = v.nacional;
        input.setAttribute("maxlength", String(v.esperados + 4));  /* + los espacios */
        if (ayuda) ayuda.innerHTML = telMensaje(v);
        var campo = input.closest ? input.closest(".campo") : null;
        /* Un número a medio escribir no es un error todavía: solo se marca
           cuando la persona ya salió del campo. */
        if (campo && formatear) campo.classList.toggle("error", !v.vacio && !v.valido);
      }

      if (!input.getAttribute("data-lada-input-listo")) {
        input.addEventListener("input", function () { revisa(false); });
        input.addEventListener("blur",  function () { revisa(true); });
        sel.addEventListener("change", function () { revisa(true); input.focus(); });
        input.setAttribute("data-lada-input-listo", "1");
      }
      revisa(true);
    });
  }

  global.SIMH = global.SIAMH = {
    icono: icono, isotipo: isotipo, chrome: chrome,
    n: n, pct: pct, esc: esc,
    columnas: columnas, sparkline: sparkline, barrasH: barrasH, apilada: apilada,
    mapaBurbujas: mapaBurbujas, tablaDatos: tablaDatos, grafica: grafica, pestanas: pestanas,
    toast: toast, panelMaestro: panelMaestro, gestorCaso: gestorCaso,
    sesion: sesion, iniciarSesion: iniciarSesion, accesoSede: accesoSede, sedesDe: sedesDe,
    sinDatos: sinDatos, datosPrueba: datosPrueba, vacioModulo: vacioModulo,
    zip: zip, descargar: descargar, imprimir: imprimir,
    hojaSFS: hojaSFS, hojaReporte: hojaReporte, paginar: paginar, verDocumento: verDocumento, barraDoc: barraDoc,
    fotoPersona: fotoPersona, retrato: retrato, tieneFoto: tieneFoto, fechaLarga: fechaLarga, plantillaSFS: plantillaSFS,
    FIRMA_SFS: FIRMA_SFS,
    SEDES: SEDES, CUENTAS: CUENTAS, folioOficio: folioOficio, refBorrador: refBorrador,
    opciones: opciones, activarOtro: activarOtro, valorOtro: valorOtro, textoOtro: textoOtro,
    activarTelefono: activarTelefono, valorTelefono: valorTelefono, textoTelefono: textoTelefono,
    TINTA: TINTA, CAT: CAT
  };
})(window);

