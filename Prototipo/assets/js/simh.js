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
          '<button class="campana" aria-label="Notificaciones" style="color:#fff">' +
            icono("campana") + '<span class="badge">7</span></button>' +
          '<div class="menu-cuenta">' +
            '<button class="usuario" id="btnCuenta" aria-haspopup="menu" aria-expanded="false" ' +
              'aria-controls="popCuenta">' +
              '<span class="avatar">MG</span>' +
              '<span class="u-txt"><span class="u-nombre">María Gómez Pérez</span><br>' +
              '<span class="u-rol">Capturista Municipal · Tapachula</span></span>' +
              '<span class="u-caret">' + icono("caret") + "</span>" +
            "</button>" +
            '<div class="menu-pop" id="popCuenta" role="menu" aria-labelledby="btnCuenta" hidden>' +
              '<div class="m-cab"><strong>María Gómez Pérez</strong>' +
                "<span>Capturista Municipal · Tapachula</span></div>" +
              '<a role="menuitem" href="#">' + icono("persona") + "Mi perfil</a>" +
              '<a role="menuitem" href="#">' + icono("llave") + "Cambiar contraseña</a>" +
              '<a role="menuitem" href="#">' + icono("ayuda") + "Ayuda y soporte</a>" +
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
      nav += '<a class="nav-item' + (m.id === paginaActiva ? " activo" : "") + '" href="' + m.href + '">' +
        icono(m.ico) + "<span>" + m.txt + "</span>" +
        (m.pill ? '<span class="pill">' + m.pill + "</span>" : "") + "</a>";
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
          'No se encontraron registros coincidentes.</div>';
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

  global.SIMH = global.SIAMH = {
    icono: icono, isotipo: isotipo, chrome: chrome,
    n: n, pct: pct, esc: esc,
    columnas: columnas, sparkline: sparkline, barrasH: barrasH, apilada: apilada,
    mapaBurbujas: mapaBurbujas, tablaDatos: tablaDatos, grafica: grafica, pestanas: pestanas,
    toast: toast, panelMaestro: panelMaestro, gestorCaso: gestorCaso,
    TINTA: TINTA, CAT: CAT
  };
})(window);

