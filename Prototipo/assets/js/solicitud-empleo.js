/* ============================================================================
   SIAMH · Solicitud de Empleo (formato del Servicio Nacional de Empleo)
   ----------------------------------------------------------------------------
   22/09/2026. Réplica de «SNE_SOLICITUD_DE_EMPLEO_PLANTILLA_PDF.pdf» de
   Recursos y plantillas: las mismas dos hojas, los mismos bloques y el mismo
   orden de campos. Empleabilidad abre este módulo con lo que el sistema ya
   sabe de la persona (SNE.abrir); lo que falta se pregunta en el formulario
   de la izquierda y la hoja de la derecha se actualiza al escribir. Al final
   se imprime o se guarda como PDF con el diálogo del navegador.

   Los campos que llegaron del expediente se marcan «del expediente» en el
   formulario, para que la ventanilla sepa qué confirmar y qué preguntar.
   ========================================================================= */
(function (global) {
  "use strict";
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  };

  var SN = ["", "No", "Sí"];
  var NIVELES = [
    { id:"prim", t:"Primaria" }, { id:"sec", t:"Secundaria" },
    { id:"prep", t:"Preparatoria o Vocacional" }, { id:"prof", t:"Profesional" },
    { id:"com", t:"Comercial u otras" }
  ];
  var FAMILIA = [ { id:"padre", t:"Padre" }, { id:"madre", t:"Madre" }, { id:"cony", t:"Esposa(o)" } ];
  var EMPLEOS = [ { id:"e1", t:"Empleo actual o último" }, { id:"e2", t:"Empleo anterior" }, { id:"e3", t:"Empleo anterior" } ];

  /* ---------------------------------------------------------------- Esquema
     Un solo esquema alimenta el formulario; la hoja lee los mismos ids.   */
  function f(id, t, tipo, ops) { return { id:id, t:t, tipo:tipo || "text", ops:ops }; }
  var SECCIONES = [
    { t:"Solicitud", c:[
      f("fecha", "Fecha", "date"), f("puesto", "Puesto que está solicitando"),
      f("sueldoDes", "Sueldo mensual deseado"), f("sueldoAut", "Sueldo mensual autorizado"),
      f("fechaCont", "Fecha de contratación", "date") ] },
    { t:"Datos personales", c:[
      f("ap1", "Primer apellido"), f("ap2", "Segundo apellido"), f("nombres", "Nombres"),
      f("edad", "Edad (años)", "number"),
      f("calle", "Domicilio (calle y número)"), f("colonia", "Colonia"), f("cp", "Código postal"),
      f("tel", "Teléfono o celular"), f("sexo", "Sexo", "select", ["", "Femenino", "Masculino"]),
      f("ciudad", "Ciudad o alcaldía, entidad federativa del domicilio"),
      f("entNac", "Entidad federativa (lugar) de nacimiento"),
      f("fnac", "Fecha de nacimiento", "date"), f("nacionalidad", "Nacionalidad"),
      f("viveCon", "Vive con (padres, familia, parientes)"),
      f("dependen", "Personas que dependen de usted (hijos, cónyuge, padres)"),
      f("civil", "Estado civil", "select", ["", "Soltera(o)", "Casada(o)", "Unión libre", "Divorciada(o)", "Viuda(o)"]) ] },
    { t:"Documentación", c:[
      f("curp", "CURP"), f("afore", "No. de AFORE"), f("rfc", "RFC"),
      f("licencia", "¿Tiene licencia de manejo?", "select", SN),
      f("cartilla", "Cartilla de Servicio Militar No."), f("pasaporte", "Pasaporte No."),
      f("nss", "Número de Seguridad Social"), f("licClase", "Clase y número de licencia"),
      f("docExt", "Siendo extranjero, ¿qué documentos le permiten trabajar en el país?") ] },
    { t:"Estado de salud y hábitos personales", c:[
      f("salud", "¿Cómo considera su estado de salud actual?", "select", ["", "Bueno", "Regular", "Malo"]),
      f("cronica", "¿Padece alguna enfermedad crónica? (Sí y explique, o No)"),
      f("deporte", "¿Practica usted algún deporte?"), f("club", "¿Pertenece a algún club social o deportivo?"),
      f("libre", "¿En qué ocupa su tiempo libre?"), f("meta", "¿Cuál es su meta en la vida?") ] },
    { t:"Datos familiares", c: FAMILIA.reduce(function (a, x) {
        return a.concat([ f(x.id + "Nom", x.t + " · nombre (sin apellidos)"),
          f(x.id + "Vive", x.t + " · vive o finado", "select", ["", "Vive", "Finado"]),
          f(x.id + "Dom", x.t + " · domicilio (entidad y colonia)"), f(x.id + "Ocu", x.t + " · ocupación") ]);
      }, []).concat([ f("hijos", "Nombres y edades de los hijos") ]) },
    { t:"Escolaridad", c: NIVELES.reduce(function (a, x) {
        return a.concat([ f(x.id + "Esc", x.t + " · nombre de la escuela"), f(x.id + "Dom", x.t + " · domicilio"),
          f(x.id + "De", x.t + " · de (año)"), f(x.id + "A", x.t + " · a (año)"),
          f(x.id + "Anios", x.t + " · años"), f(x.id + "Tit", x.t + " · título recibido") ]);
      }, []).concat([ f("actEsc", "Estudios actuales · escuela"), f("actHor", "Estudios actuales · horario"),
        f("actCur", "Estudios actuales · curso o carrera"), f("actGrado", "Estudios actuales · grado") ]) },
    { t:"Conocimientos generales", c:[
      f("idiomas", "Idiomas que domina"), f("oficina", "Funciones de oficina que domina"),
      f("maquinas", "Máquinas de oficina o equipo de trabajo que sepa manejar"),
      f("otros", "Otros trabajos o funciones que domina") ] },
    { t:"Empleo actual o anteriores", c: EMPLEOS.reduce(function (a, x, i) {
        var n = x.t + (i === 2 ? " (2)" : "");
        return a.concat([ f(x.id + "Tiempo", n + " · tiempo que prestó sus servicios"), f(x.id + "Emp", n + " · nombre de la empresa"),
          f(x.id + "Dom", n + " · domicilio"), f(x.id + "Tel", n + " · teléfono"),
          f(x.id + "PueI", n + " · puesto inicial"), f(x.id + "PueF", n + " · puesto final"),
          f(x.id + "SueI", n + " · sueldo inicial"), f(x.id + "SueF", n + " · sueldo final"),
          f(x.id + "Mot", n + " · motivo de su separación"), f(x.id + "Jefe", n + " · nombre de su jefe inmediato"),
          f(x.id + "Act", n + " · actividades desempeñadas", "textarea") ]);
      }, []).concat([ f("informes", "¿Podemos solicitar informes de usted?", "select", ["", "Sí", "No"]),
        f("informesRaz", "Si no, razones") ]) },
    { t:"Referencias personales", c: [1, 2, 3].reduce(function (a, n) {
        return a.concat([ f("r" + n + "Nom", "Referencia " + n + " · nombre"), f("r" + n + "Dom", "Referencia " + n + " · domicilio"),
          f("r" + n + "Tel", "Referencia " + n + " · teléfono"), f("r" + n + "Ocu", "Referencia " + n + " · ocupación"),
          f("r" + n + "Tiempo", "Referencia " + n + " · tiempo de conocerse") ]);
      }, []) },
    { t:"Datos generales", c:[
      f("entero", "¿Cómo se enteró de este empleo?", "select", ["", "Anuncio", "Otro medio"]), f("enteroOtro", "Otro medio (anótelo)"),
      f("famEmp", "¿Tiene familiares o amigos que laboren en esta empresa?", "select", SN), f("famEmpNom", "Si sí, nómbrelos"),
      f("afianzado", "¿Ha estado afianzado?", "select", SN), f("afianzadoCia", "Si sí, nombre de la compañía"),
      f("sindicato", "¿Pertenece a algún sindicato?", "select", SN), f("sindicatoCual", "Si sí, ¿a cuál?"),
      f("seguro", "¿Tiene seguro de vida?", "select", SN), f("seguroCia", "Si sí, ¿de qué compañía?"), f("seguroImp", "Importe mensual $"),
      f("viajar", "¿Puede viajar?", "select", ["", "Sí", "No"]), f("viajarRaz", "Si no, razones"),
      f("residencia", "¿Está dispuesto a cambiar de lugar de residencia?", "select", ["", "Sí", "No"]), f("residenciaRaz", "Si no, razones"),
      f("presentarse", "¿Fecha en que podría presentarse a trabajar?", "date") ] },
    { t:"Datos económicos", c:[
      f("otrosIng", "¿Tiene usted otros ingresos?", "select", SN), f("otrosIngCual", "Si sí, ¿cuáles?"), f("otrosIngImp", "Importe mensual $"),
      f("conyTrab", "¿Su cónyuge trabaja?", "select", SN), f("conyDonde", "Si sí, ¿dónde?"), f("conyImp", "Percepción mensual $"),
      f("casa", "¿Vive en casa propia?", "select", SN), f("casaImp", "Importe mensual $"),
      f("renta", "¿Paga renta?", "select", SN), f("rentaImp", "Renta mensual $"),
      f("auto", "¿Tiene automóvil propio?", "select", SN), f("autoPlacas", "Placas"), f("autoMarca", "Marca"), f("autoModelo", "Modelo"),
      f("deudas", "¿Tiene deudas?", "select", SN), f("deudasClase", "Si sí, ¿de qué clase?"), f("deudasImp", "Importe $"),
      f("ingresos", "Ingresos $"), f("ahorros", "Ahorros $"), f("abona", "¿Cuánto abona mensualmente? $"),
      f("egresos", "Egresos $"), f("total", "Total (gastos mensuales) $") ] },
    { t:"Observaciones", c:[ f("obs", "Observaciones", "textarea") ] }
  ];

  /* ------------------------------------------------------------ Hoja SNE */
  var D = {};                               /* valores vigentes */
  function v(id) { return esc(D[id] || ""); }
  function fec(id) {
    var x = D[id];
    if (!x || !/^\d{4}-\d{2}-\d{2}$/.test(x)) return ["", "", ""];
    var p = x.split("-"); return [p[2], p[1], p[0]];
  }
  function cel(lab, id, extra) {
    return '<td' + (extra || "") + '><span class="sl">' + lab + '</span><span class="sv">' + v(id) + "</span></td>";
  }
  function cajas(id, n) {
    var s = (D[id] || "").toUpperCase().replace(/\s/g, ""), h = "";
    for (var i = 0; i < n; i++) h += "<i>" + esc(s.charAt(i)) + "</i>";
    return '<span class="scajas">' + h + "</span>";
  }
  function marca(id, val) { return D[id] === val ? "◉" : "○"; }
  function sec(t, cols) { return '<tr><th class="sh" colspan="' + cols + '">' + t + "</th></tr>"; }

  function pagina1() {
    var fe = fec("fecha"), fc = fec("fechaCont"), fn = fec("fnac");
    var h = '<div class="sne-pag">';
    h += '<table class="st"><colgroup><col style="width:54%"><col style="width:20%"><col style="width:26%"></colgroup>' +
      '<tr><td class="stit" rowspan="1">SOLICITUD DE EMPLEO</td>' +
        '<td><span class="sl">Fecha</span><span class="sfecha"><i>' + fe[0] + "</i><i>" + fe[1] + "</i><i>" + fe[2] + '</i></span></td>' +
        '<td class="sfoto" rowspan="4">' + (estado && estado.datos.foto
          ? '<img src="' + estado.datos.foto + '" alt="Fotografía">' : "Fotografía") + "</td></tr>" +
      '<tr><td rowspan="3"><span class="sl">Puesto que está solicitando:</span><span class="sv sgrande">' + v("puesto") + "</span></td>" +
        cel("Sueldo mensual deseado", "sueldoDes") + "</tr>" +
      "<tr>" + cel("Sueldo mensual autorizado", "sueldoAut") + "</tr>" +
      '<tr><td><span class="sl">Fecha de contratación</span><span class="sfecha"><i>' + fc[0] + "</i><i>" + fc[1] + "</i><i>" + fc[2] + "</i></span></td></tr>" +
      "</table>";

    h += '<table class="st"><colgroup><col style="width:18%"><col style="width:18%"><col style="width:14%"><col style="width:17%"><col style="width:15%"><col style="width:18%"></colgroup>' +
      sec("DATOS PERSONALES", 6) +
      "<tr>" + cel("Primer Apellido", "ap1") + cel("Segundo Apellido", "ap2") + cel("Nombres", "nombres", ' colspan="3"') + cel("Edad <small>(años)</small>", "edad") + "</tr>" +
      "<tr>" + cel("Domicilio <small>(Escribe calle y número)</small>", "calle", ' colspan="2"') + cel("Colonia", "colonia") + cel("Código Postal", "cp") +
        cel("Teléfono o Celular", "tel") + cel("Sexo <small>(Masculino o Femenino)</small>", "sexo") + "</tr>" +
      "<tr>" + cel("Ciudad o Alcaldía, Entidad Federativa del Domicilio", "ciudad", ' colspan="2"') +
        cel("Entidad Federativa (lugar) de nacimiento", "entNac", ' colspan="2"') +
        '<td><span class="sl">Fecha de Nacimiento</span><span class="sv">' + (fn[0] ? fn.join("/") : "") + "</span></td>" +
        cel("Nacionalidad", "nacionalidad") + "</tr>" +
      "<tr>" + cel("Vive con <small>(Escriba: Padres, Familia, Parientes)</small>", "viveCon", ' colspan="3"') +
        cel("Personas que dependen de usted <small>(Hijos, Cónyuge, Padres)</small>", "dependen", ' colspan="2"') +
        cel("Estado Civil", "civil") + "</tr></table>";

    h += '<table class="st"><colgroup><col style="width:52%"><col style="width:16%"><col style="width:16%"><col style="width:16%"></colgroup>' +
      sec("DOCUMENTACIÓN", 4) +
      '<tr><td><span class="sl">Clave Única de Registro de Población (CURP)</span>' + cajas("curp", 18) + "</td>" +
        cel("No de AFORE:", "afore", ' colspan="3"') + "</tr>" +
      '<tr><td><span class="sl">Registro Federal de Contribuyentes (RFC)</span>' + cajas("rfc", 13) + "</td>" +
        cel("¿Tiene Licencia de Manejo? <small>(Sí o No)</small>", "licencia") + cel("Cartilla de Servicio Militar No.", "cartilla") +
        cel("Pasaporte No.", "pasaporte") + "</tr>" +
      "<tr>" + cel("Número de Seguridad Social", "nss") + cel("Clase y número de licencia", "licClase") +
        cel("Siendo extranjero qué documentos le permite trabajar en el país", "docExt", ' colspan="2"') + "</tr></table>";

    h += '<table class="st"><colgroup><col style="width:33%"><col style="width:31%"><col style="width:36%"></colgroup>' +
      sec("ESTADO DE SALUD Y HÁBITOS PERSONALES", 3) +
      "<tr>" + cel("¿Cómo considera su estado de salud actual? <small>(Bueno, Regular o Malo)</small>", "salud") +
        cel("¿Padece alguna enfermedad crónica? <small>(Sí y explique, o No)</small>", "cronica", ' colspan="2"') + "</tr>" +
      "<tr>" + cel("¿Practica usted algún deporte?", "deporte") + cel("¿Pertenece a algún Club Social o Deportivo?", "club") +
        cel("¿En qué ocupa su tiempo libre?", "libre") + "</tr>" +
      "<tr>" + cel("¿Cuál es su meta en la vida?", "meta", ' colspan="3"') + "</tr></table>";

    h += '<table class="st sfilas"><colgroup><col style="width:9%"><col style="width:24%"><col style="width:4%"><col style="width:4%"><col style="width:31%"><col style="width:28%"></colgroup>' +
      sec("DATOS FAMILIARES", 6) +
      '<tr class="scab"><td></td><td>Nombre <small>(sólo nombres sin apellidos)</small></td><td>Vive</td><td>Finado</td>' +
        "<td>Domicilio <small>(Sólo Entidad Federativa y Colonia)</small></td><td>Ocupación</td></tr>" +
      FAMILIA.map(function (x) {
        return '<tr><td class="slc">' + x.t + "</td><td>" + v(x.id + "Nom") + '</td><td class="sc">' +
          (D[x.id + "Vive"] === "Vive" ? "✕" : "") + '</td><td class="sc">' + (D[x.id + "Vive"] === "Finado" ? "✕" : "") +
          "</td><td>" + v(x.id + "Dom") + "</td><td>" + v(x.id + "Ocu") + "</td></tr>";
      }).join("") +
      '<tr><td class="slc" colspan="2">Nombres y edades de los hijos:</td><td colspan="4">' + v("hijos") + "</td></tr></table>";

    h += '<table class="st sfilas"><colgroup><col style="width:19%"><col style="width:21%"><col style="width:22%"><col style="width:8%"><col style="width:8%"><col style="width:6%"><col style="width:16%"></colgroup>' +
      sec("ESCOLARIDAD", 7) +
      '<tr class="scab"><td></td><td>Nombre de la escuela</td><td>Domicilio <small>(Entidad y Municipio o Colonia)</small></td>' +
        '<td colspan="2">Fechas (De · A)</td><td>Años</td><td>Título Recibido</td></tr>' +
      NIVELES.map(function (x) {
        return '<tr class="salto"><td class="slc">' + x.t + "</td><td>" + v(x.id + "Esc") + "</td><td>" + v(x.id + "Dom") +
          '</td><td><small class="sgr">De</small> ' + v(x.id + "De") + '</td><td><small class="sgr">A</small> ' + v(x.id + "A") +
          '</td><td class="sc">' + v(x.id + "Anios") + "</td><td>" + v(x.id + "Tit") + "</td></tr>";
      }).join("") +
      '<tr><td class="slc" colspan="7">Estudios que está efectuando en la actualidad</td></tr>' +
      '<tr><td class="slc">Escuela</td><td colspan="2">' + v("actEsc") + '</td><td class="slc">Horario:</td><td>' + v("actHor") +
        '</td><td class="slc">Grado</td><td>' + v("actGrado") + "</td></tr>" +
      '<tr><td class="slc">Curso o carrera</td><td colspan="6">' + v("actCur") + "</td></tr></table>";

    h += '<div class="snota">LA CONFIDENCIALIDAD DE SUS DATOS ESTA RESGUARDADA POR LA LEY FEDERAL DE PROTECCIÓN DE DATOS PERSONALES EN POSESIÓN DE LOS PARTICULARES</div>' +
      '<div class="spie"><span>Servicio Nacional de Empleo</span><span>2022</span><span>SNE</span></div></div>';
    return h;
  }

  function pagina2() {
    var h = '<div class="sne-pag">';
    h += '<table class="st"><colgroup><col style="width:50%"><col style="width:50%"></colgroup>' + sec("CONOCIMIENTOS GENERALES", 2) +
      "<tr>" + cel("Idiomas que domina", "idiomas") + cel("Funciones de oficina que domina", "oficina") + "</tr>" +
      "<tr>" + cel("Máquinas de oficina y/o equipo de trabajo que sepa manejar", "maquinas", ' colspan="2"') + "</tr>" +
      "<tr>" + cel("Otros trabajos o funciones que domina", "otros", ' colspan="2"') + "</tr></table>";

    var filas = [["Tiempo que prestó sus servicios", "Tiempo"], ["Nombre de la Empresa", "Emp"], ["Domicilio", "Dom"], ["Teléfono", "Tel"],
      ["Puesto · Inicial", "PueI"], ["Puesto · Final", "PueF"], ["Sueldos · Inicial", "SueI"], ["Sueldos · Final", "SueF"],
      ["Motivos de su separación", "Mot"], ["Nombre de su jefe inmediato", "Jefe"], ["Actividades Desempeñadas", "Act"]];
    h += '<table class="st sfilas"><colgroup><col style="width:19%"><col style="width:27%"><col style="width:27%"><col style="width:27%"></colgroup>' +
      sec("EMPLEO ACTUAL O ANTERIORES", 4) +
      '<tr class="scab"><td>Concepto</td>' + EMPLEOS.map(function (e) { return "<td>" + e.t + "</td>"; }).join("") + "</tr>" +
      filas.map(function (r) {
        return '<tr' + (r[1] === "Act" ? ' class="salto2"' : "") + '><td class="slc">' + r[0] + "</td>" +
          EMPLEOS.map(function (e) { return "<td>" + v(e.id + r[1]) + "</td>"; }).join("") + "</tr>";
      }).join("") +
      '<tr><td class="slc" colspan="4">Podemos solicitar informes de usted &nbsp; ' + marca("informes", "Sí") + " Sí &nbsp; " +
        marca("informes", "No") + " No (Razones) " + v("informesRaz") + "</td></tr></table>";

    h += '<table class="st sfilas"><colgroup><col style="width:24%"><col style="width:24%"><col style="width:17%"><col style="width:17%"><col style="width:18%"></colgroup>' +
      sec("REFERENCIAS PERSONALES", 5) +
      '<tr class="scab"><td>Nombre</td><td>Domicilio</td><td>Teléfono</td><td>Ocupación</td><td>Tiempo de conocerse</td></tr>' +
      [1, 2, 3].map(function (n) {
        return '<tr class="salto">' + ["Nom", "Dom", "Tel", "Ocu", "Tiempo"].map(function (k) { return "<td>" + v("r" + n + k) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</table>";

    function sino(id, si, no, extraId) {
      return marca(id, no) + " " + no + " &nbsp; " + marca(id, si) + " " + si + (extraId ? " " + v(extraId) : "");
    }
    h += '<table class="st"><colgroup><col style="width:36%"><col style="width:14%"><col style="width:50%"></colgroup>' + sec("DATOS GENERALES", 3) +
      '<tr><td colspan="2"><span class="sl">¿Cómo se enteró de este empleo?</span><span class="sv">' + marca("entero", "Anuncio") + " Anuncio &nbsp; " +
        marca("entero", "Otro medio") + " Otro medio (Anótelo) " + v("enteroOtro") + "</span></td>" +
        '<td><span class="sl">¿Tienes familiares y/o amigos que laboren en esta empresa?</span><span class="sv">' + sino("famEmp", "Sí (Nómbrelos)", "No", "famEmpNom") + "</span></td></tr>" +
      '<tr><td colspan="2"><span class="sl">¿Ha estado Afianzado?</span><span class="sv">' + sino("afianzado", "Sí (Nombre de la Compañía)", "No", "afianzadoCia") + "</span></td>" +
        '<td><span class="sl">¿Pertenece a algún sindicato?</span><span class="sv">' + sino("sindicato", "Sí (¿A cuál?)", "No", "sindicatoCual") + "</span></td></tr>" +
      '<tr><td><span class="sl">¿Tiene seguro de vida?</span><span class="sv">' + sino("seguro", "Sí (De qué CIA)", "No", "seguroCia") + "</span></td>" +
        cel("Importe mensual $", "seguroImp") +
        '<td><span class="sl">¿Puede viajar?</span><span class="sv">' + marca("viajar", "Sí") + " Sí &nbsp; " + marca("viajar", "No") + " No (Razones) " + v("viajarRaz") + "</span></td></tr>" +
      '<tr><td colspan="2"><span class="sl">¿Está dispuesto a cambiar de lugar de residencia?</span><span class="sv">' + marca("residencia", "Sí") + " Sí &nbsp; " +
        marca("residencia", "No") + " No (Razones) " + v("residenciaRaz") + "</span></td>" +
        '<td><span class="sl">¿Fecha en que podría presentarse a trabajar?</span><span class="sv">' + (fec("presentarse")[0] ? fec("presentarse").join("/") : "") + "</span></td></tr></table>";

    h += '<table class="st"><colgroup><col style="width:30%"><col style="width:20%"><col style="width:30%"><col style="width:20%"></colgroup>' + sec("DATOS ECONÓMICOS", 4) +
      '<tr><td><span class="sl">¿Tiene usted otros ingresos?</span><span class="sv">' + sino("otrosIng", "Sí (¿Cuáles?)", "No", "otrosIngCual") + "</span></td>" + cel("Importe mensual $", "otrosIngImp") +
        '<td><span class="sl">¿Su cónyuge trabaja?</span><span class="sv">' + sino("conyTrab", "Sí (¿Dónde?)", "No", "conyDonde") + "</span></td>" + cel("Percepción mensual $", "conyImp") + "</tr>" +
      '<tr><td><span class="sl">¿Vive en casa propia?</span><span class="sv">' + sino("casa", "Sí", "No") + "</span></td>" + cel("Importe mensual $", "casaImp") +
        '<td><span class="sl">¿Paga Renta?</span><span class="sv">' + sino("renta", "Sí", "No") + "</span></td>" + cel("Renta mensual $", "rentaImp") + "</tr>" +
      '<tr><td><span class="sl">¿Tiene automóvil propio? · Placas · Marca · Modelo</span><span class="sv">' + sino("auto", "Sí", "No") + " " +
        [v("autoPlacas"), v("autoMarca"), v("autoModelo")].filter(Boolean).join(" · ") + "</span></td><td></td>" +
        '<td><span class="sl">¿Tienes Deudas?</span><span class="sv">' + sino("deudas", "Sí (¿De qué clase?)", "No", "deudasClase") + "</span></td>" + cel("Importe $", "deudasImp") + "</tr>" +
      "<tr>" + cel("Ingresos $", "ingresos") + cel("Ahorros $", "ahorros") + cel("¿Cuánto abona mensualmente? $", "abona", ' colspan="2"') + "</tr>" +
      "<tr>" + cel("Egresos $", "egresos") + cel("Total <small>(gastos mensuales)</small> $", "total") + '<td colspan="2"></td></tr></table>';

    h += '<table class="st"><colgroup><col style="width:50%"><col style="width:50%"></colgroup>' +
      '<tr><th class="sh" colspan="2"></th></tr>' +
      '<tr class="sfirma"><td><span class="sl">Observaciones</span><span class="sv">' + v("obs") + "</span></td>" +
        '<td><span class="sl">Certifico que los datos proporcionados son correctos y autorizo a la empresa para que certifique a su entera satisfacción</span>' +
        '<span class="sraya">Firma del Solicitante</span></td></tr></table>';
    h += '<div class="spie"><span>Servicio Nacional de Empleo</span><span>2022</span><span>SNE</span></div></div>';
    return h;
  }

  function hoja(datos) {
    D = datos || {};
    return '<div class="sne-hoja">' + pagina1() + pagina2() + "</div>";
  }

  /* ------------------------------------------------------ Formulario ----- */
  var estado = null;          /* { datos, origen:{id:true}, alGuardar, titulo } */

  function control(c) {
    var val = estado.datos[c.id] || "";
    var at = ' id="sne_' + c.id + '" data-sne="' + c.id + '"';
    if (c.tipo === "select") {
      return "<select" + at + ">" + c.ops.map(function (o) {
        return '<option value="' + esc(o) + '"' + (o === val ? " selected" : "") + ">" + (o ? esc(o) : "—") + "</option>";
      }).join("") + "</select>";
    }
    if (c.tipo === "textarea") return "<textarea rows=\"2\"" + at + ">" + esc(val) + "</textarea>";
    return '<input type="' + c.tipo + '"' + at + ' value="' + esc(val) + '">';
  }

  /* Fotografía opcional (23/09/2026): se puede usar la del expediente,
     subir otra o dejar la casilla en blanco, como en el formato impreso.
     Va en `datos.foto`, así que se guarda con el resto de la solicitud. */
  function bloqueFoto() {
    var f = estado.datos.foto;
    return '<div class="sne-sec sne-foto"><div class="sne-foto-in">' +
      (f ? '<img src="' + f + '" alt="Fotografía de la solicitud">'
         : '<span class="sne-foto-vacia">Sin fotografía</span>') +
      '<div><div class="sne-foto-t">Fotografía <span class="sne-cta">(opcional)</span></div>' +
      '<div class="sne-foto-acc">' +
        (estado.fotoExp && f !== estado.fotoExp
          ? '<button type="button" class="btn btn-secundario btn-s" data-foto="exp">Usar la del expediente</button>' : "") +
        '<label class="btn btn-secundario btn-s" style="cursor:pointer">' + (f ? "Cambiar" : "Agregar") +
          ' fotografía<input type="file" accept="image/*" data-foto="subir" hidden></label>' +
        (f ? '<button type="button" class="btn btn-texto btn-s" data-foto="quitar">Quitar fotografía</button>' : "") +
      "</div></div></div></div>";
  }
  function pintaFoto() {
    var c = document.getElementById("sneFoto");
    if (c) c.innerHTML = bloqueFoto();
    repinta();
  }

  function formulario() {
    return '<div id="sneFoto">' + bloqueFoto() + "</div>" + SECCIONES.map(function (s, i) {
      var llenos = s.c.filter(function (c) { return estado.datos[c.id]; }).length;
      var sis = s.c.filter(function (c) { return estado.origen[c.id]; }).length;
      return '<details class="sne-sec"' + (i < 3 ? " open" : "") + "><summary>" + esc(s.t) +
        '<span class="sne-cta">' + llenos + " de " + s.c.length + (sis ? " · " + sis + " del expediente" : "") + "</span></summary>" +
        '<div class="sne-campos">' + s.c.map(function (c) {
          return '<div class="campo' + (c.tipo === "textarea" ? " sne-ancho" : "") + '"><label for="sne_' + c.id + '">' + esc(c.t) +
            (estado.origen[c.id] ? ' <span class="sne-exp">del expediente</span>' : "") + "</label>" + control(c) + "</div>";
        }).join("") + "</div></details>";
    }).join("");
  }

  function repinta() {
    var prev = document.getElementById("snePrev");
    if (prev) prev.innerHTML = hoja(estado.datos);
  }

  function abrir(opts) {
    estado = { datos: JSON.parse(JSON.stringify(opts.datos || {})), origen: opts.origen || {},
               alGuardar: opts.alGuardar, titulo: opts.titulo || "", fotoExp: opts.foto || "" };
    /* Si la solicitud ya se guardó, respeta lo que se eligió (con o sin
       foto); si es nueva, arranca con la del expediente. */
    if (estado.datos.foto === undefined) estado.datos.foto = estado.fotoExp;
    var velo = document.createElement("div");
    velo.className = "sne-velo";
    velo.id = "sneVelo";
    velo.setAttribute("role", "dialog");
    velo.setAttribute("aria-modal", "true");
    velo.setAttribute("aria-labelledby", "sneTit");
    velo.innerHTML =
      '<div class="sne-caja">' +
        '<div class="sne-barra">' +
          '<div><h2 id="sneTit">Solicitud de empleo · ' + esc(estado.titulo) + '</h2>' +
            '<span class="txt-min">Formato del Servicio Nacional de Empleo. Lo marcado «del expediente» ya lo tenía el sistema; ' +
            "confírmalo con la persona y pregunta lo demás.</span></div>" +
          '<div class="sne-acc">' +
            '<button class="btn btn-secundario btn-s" type="button" id="sneCerrar">Cerrar</button>' +
            '<button class="btn btn-secundario btn-s" type="button" id="sneGuardar">Guardar en el expediente</button>' +
            '<button class="btn btn-primario btn-s" type="button" id="sneImprimir">Imprimir o guardar PDF</button>' +
          "</div></div>" +
        '<div class="sne-cuerpo">' +
          '<form class="sne-form" onsubmit="return false">' + formulario() + "</form>" +
          '<div class="sne-visor"><div class="doc-barra"><span class="doc-lbl">Vista previa · 2 hojas carta</span>' +
            '<span class="doc-acc"><button class="btn btn-secundario btn-s" type="button" id="sneVer">' +
            SIMH.icono("ojo") + "Ver vista previa</button></span></div>" +
            '<div id="snePrev"></div></div>' +
        "</div></div>";
    document.body.appendChild(velo);
    document.body.style.overflow = "hidden";
    repinta();

    velo.addEventListener("input", function (e) {
      var id = e.target.getAttribute && e.target.getAttribute("data-sne");
      if (!id) return;
      estado.datos[id] = e.target.value;
      repinta();
    });
    velo.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-foto]");
      if (!b || b.tagName === "INPUT") return;
      estado.datos.foto = b.getAttribute("data-foto") === "exp" ? estado.fotoExp : "";
      pintaFoto();
    });
    velo.addEventListener("change", function (e) {
      if (e.target.getAttribute && e.target.getAttribute("data-foto") === "subir") {
        var arch = e.target.files && e.target.files[0];
        if (!arch) return;
        var lec = new FileReader();
        lec.onload = function () { estado.datos.foto = lec.result; pintaFoto(); };
        lec.readAsDataURL(arch);
        return;
      }
      var id = e.target.getAttribute && e.target.getAttribute("data-sne");
      if (!id) return;
      estado.datos[id] = e.target.value;
      repinta();
    });
    function cerrar() {
      velo.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", tecla);
      if (opts.alCerrar) opts.alCerrar();
    }
    /* Con la vista a pantalla completa abierta, Escape cierra solo esa. */
    function tecla(e) { if (e.key === "Escape" && !document.querySelector(".hs-velo")) cerrar(); }
    document.addEventListener("keydown", tecla);
    document.getElementById("sneCerrar").onclick = cerrar;
    document.getElementById("sneGuardar").onclick = function () {
      if (estado.alGuardar) estado.alGuardar(estado.datos);
      if (global.SIMH && SIMH.toast) SIMH.toast("Solicitud de empleo guardada en el expediente", "ok");
    };
    function imprime() {
      if (estado.alGuardar) estado.alGuardar(estado.datos);
      SIMH.imprimir(hoja(estado.datos), "Solicitud de empleo · " + estado.titulo);
    }
    document.getElementById("sneImprimir").onclick = imprime;
    /* La misma vista a pantalla completa que el resto de los documentos. */
    document.getElementById("sneVer").onclick = function () {
      SIMH.verDocumento(hoja(estado.datos), "Solicitud de empleo · " + estado.titulo,
        { imprimir: function () { imprime(); } });
    };
    document.getElementById("sneCerrar").focus();
  }

  global.SNE = { abrir: abrir, hoja: hoja, SECCIONES: SECCIONES };
})(window);
