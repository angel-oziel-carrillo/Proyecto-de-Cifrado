//1
function obtenerAlfabeto() {
    const texto = document.getElementById("alfabeto").value.normalize("NFC");
    const segmentador = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(
        segmentador.segment(texto), segmento => segmento.segment
    );
}

//2
function validarAlfabeto(alfabeto) {
    if (alfabeto.length === 0) {
        mostrarEstado(
            "El conjunto de caracteres no puede estar vacío.",
            false
        );
        return false;
    }

    const conjunto = new Set();
    
    for (const caracter of alfabeto) {
        if (conjunto.has(caracter)) {
            console.log("REPETIDO:", {
                caracter,
                codigo: [...caracter].map(
                    c => c.codePointAt(0).toString(16)
                )
            });

            mostrarEstado(
                "El conjunto de caracteres no puede contener caracteres repetidos.",
                false
            );
            return false;
        }

        conjunto.add(caracter);
    }

    return true;
}

//3
function normalizarModulo(modulo, longitud) {
    return ((modulo % longitud) + longitud) % longitud;
}

//4
/*
function conservarMayusculas(caracter, nuevoCaracter, alfabeto) {
    if (alfabeto.includes(nuevoCaracter)) {
        return nuevoCaracter;
    }

    const mayuscula = caracter.toUpperCase();
    const minuscula = caracter.toLowerCase();

    if (
        mayuscula.length === 1 &&
        caracter === mayuscula
    ) {
        return nuevoCaracter.toUpperCase();
    }

    if (
        minuscula.length === 1 &&
        caracter === minuscula
    ) {
        return nuevoCaracter.toLowerCase();
    }

    return nuevoCaracter;
}*/

function buscarCaracter(caracter, alfabeto) {
    const posicion = alfabeto.indexOf(caracter);
    if (posicion !== -1) {
        return posicion;
    }

    const posicionMayuscula = alfabeto.indexOf(caracter.toUpperCase());
    if (posicionMayuscula !== -1) {
        return posicionMayuscula;
    }

    const posicionMinuscula = alfabeto.indexOf(caracter.toLowerCase());
    if (posicionMinuscula !== -1) {
        return posicionMinuscula;
    }

    return -1;
}

//5
function cifrarCesar(texto, alfabeto, modulo) {
    let resultado = "";
    const segmentador = new Intl.Segmenter(undefined, {granularity: "grapheme"});
    let cadenaTexto = Array.from(
        segmentador.segment(texto),
        segmento => segmento.segment
    );

    modulo = normalizarModulo(
        modulo,
        alfabeto.length
    );

    for (const caracter of cadenaTexto) {
        const posicion = buscarCaracter(caracter, alfabeto);

        if (posicion === -1) {
            resultado += caracter;
            continue;
        }

        const nuevaPosicion = (posicion + modulo) % alfabeto.length;

        resultado += alfabeto[nuevaPosicion];
    }
    return resultado;
}

//6
function descifrarCesar(texto, alfabeto, modulo) {
    return cifrarCesar(
        texto,
        alfabeto,
        -modulo
    );
}

//7
function atbash(texto, alfabeto) {
    let resultado = "";
    const segmentador = new Intl.Segmenter(undefined, {granularity: "grapheme"});
    let cadenaTexto = Array.from(
        segmentador.segment(texto),
        segmento => segmento.segment
    );

    for (const caracter of cadenaTexto) {
        const posicion = buscarCaracter(caracter, alfabeto);

        if (posicion === -1) {
            resultado += caracter;
            continue;
        }

        const nuevaPosicion = alfabeto.length - 1 - posicion;

        resultado += alfabeto[nuevaPosicion];
    }
    return resultado;
}

//8
const frecuenciasEspanol = {
    'E': 13.68,
    'A': 12.53,
    'O': 8.68,
    'S': 7.98,
    'R': 6.87,
    'N': 6.71,
    'I': 6.25,
    'D': 5.86,
    'L': 4.97,
    'C': 4.68,
    'T': 4.63,
    'U': 3.93,
    'M': 3.15,
    'P': 2.51,
    'B': 1.42,
    'G': 1.01,
    'V': 0.90,
    'Y': 0.90,
    'Q': 0.88,
    'H': 0.70,
    'F': 0.69,
    'Z': 0.52,
    'J': 0.44,
    'Ñ': 0.31,
    'X': 0.22,
    'K': 0.02,
    'W': 0.01
};

//9
function analizarFrecuencias(texto) {
    const caracteres = Array.from(texto.toUpperCase()).filter(c => frecuenciasEspanol[c] !== undefined);

    if (caracteres.length === 0) {
        return 0;
    }

    const conteo = {};

    for (const caracter of caracteres) {
        conteo[caracter] = (conteo[caracter] || 0) + 1;
    }
    const total = caracteres.length;
    let errorTotal = 0;

    for (const letra in frecuenciasEspanol) {
        const esperada = frecuenciasEspanol[letra] / 100;
        const encontrada = (conteo[letra] || 0) / total;

        errorTotal += Math.pow(encontrada - esperada, 2);
    }

    const puntuacion = 1 / (1 + errorTotal * 100);
    return puntuacion * 100;
}

//10
const palabrasComunes = [
    //11

    " EL ",
    " LA ",
    " LOS ",
    " LAS ",
    " UN ",
    " UNA ",
    " UNOS ",
    " UNAS ",

    //12

    " YO ",
    " TÚ ",
    " TU ",
    " ÉL ",
    " ELLA ",
    " ELLOS ",
    " ELLAS ",
    " ME ",
    " TE ",
    " SE ",
    " NOS ",
    " LO ",
    " LE ",
    " LES ",

    //13

    " MI ",
    " MIS ",
    " SU ",
    " SUS ",
    " NUESTRO ",
    " NUESTRA ",
    " NUESTROS ",
    " NUESTRAS ",

    //14

    " ESTE ",
    " ESTA ",
    " ESTOS ",
    " ESTAS ",
    " ESE ",
    " ESA ",
    " ESOS ",
    " ESAS ",
    " ESO ",
    " ESTO ",
    " AQUEL ",
    " AQUELLA ",

    //15

    " QUE ",
    " QUIEN ",
    " QUIENES ",
    " CUAL ",
    " CUALES ",
    " COMO ",
    " CUANDO ",
    " DONDE ",
    " CUANTO ",
    " CUANTA ",
    " CUANTOS ",
    " CUANTAS ",

    //16

    " A ",
    " ANTE ",
    " BAJO ",
    " CON ",
    " CONTRA ",
    " DE ",
    " DESDE ",
    " EN ",
    " ENTRE ",
    " HACIA ",
    " HASTA ",
    " PARA ",
    " POR ",
    " SEGÚN ",
    " SIN ",
    " SOBRE ",
    " TRAS ",

    //17

    " Y ",
    " E ",
    " O ",
    " U ",
    " NI ",
    " PERO ",
    " MAS ",
    " MÁS ",
    " SINO ",
    " AUNQUE ",
    " PORQUE ",
    " PUES ",
    " SI ",
    " MIENTRAS ",

    //18

    " NO ",
    " SÍ ",
    " SI ",
    " MUY ",
    " MÁS ",
    " MENOS ",
    " YA ",
    " AÚN ",
    " TAMBIÉN ",
    " TAMPOCO ",
    " BIEN ",
    " MAL ",
    " AQUÍ ",
    " AHÍ ",
    " ALLÍ ",
    " HOY ",
    " AYER ",
    " MAÑANA ",
    " ANTES ",
    " DESPUÉS ",
    " SIEMPRE ",
    " NUNCA ",
    " NADA ",
    " ALGO ",
    " TODO ",
    " TODAVÍA ",
    " CASI ",
    " ASÍ ",
    " MUCHO ",
    " POCO ",
    " BASTANTE ",

    //19

    " SER ",
    " ES ",
    " SOY ",
    " ERES ",
    " SOMOS ",
    " SON ",
    " ERA ",
    " ERAN ",
    " FUE ",

    " ESTAR ",
    " ESTÁ ",
    " ESTÁN ",
    " ESTOY ",
    " ESTÁS ",
    " ESTAMOS ",
    " ESTABA ",

    " HABER ",
    " HAY ",
    " HA ",
    " HAN ",
    " HE ",
    " HAS ",
    " HABÍA ",

    " TENER ",
    " TENGO ",
    " TIENE ",
    " TIENEN ",
    " TIENES ",
    " TENEMOS ",
    " TENÍA ",

    " HACER ",
    " HAGO ",
    " HACE ",
    " HACEN ",
    " HACES ",
    " HACEMOS ",
    " HECHO ",

    " PODER ",
    " PUEDO ",
    " PUEDE ",
    " PUEDEN ",
    " PUEDES ",
    " PODEMOS ",
    " PODÍA ",

    " DECIR ",
    " DIGO ",
    " DICE ",
    " DICEN ",
    " DICES ",
    " DIJO ",

    " IR ",
    " VOY ",
    " VA ",
    " VAN ",
    " VAS ",
    " VAMOS ",
    " IBA ",

    " VER ",
    " VEO ",
    " VE ",
    " VEN ",
    " VES ",
    " VEMOS ",

    " DAR ",
    " DOY ",
    " DA ",
    " DAN ",
    " DAS ",
    " DAMOS ",

    " SABER ",
    " SÉ ",
    " SABE ",
    " SABEN ",
    " SABES ",
    " SABEMOS ",

    " QUERER ",
    " QUIERO ",
    " QUIERES ",
    " QUIERE ",
    " QUEREMOS ",
    " QUIEREN ",

    " VENIR ",
    " VIENE ",
    " VIENEN ",
    " VIENES ",

    " DEBER ",
    " DEBE ",
    " DEBEN ",
    " DEBES ",
    " DEBEMOS ",

    //20

    " COSA ",
    " COSAS ",
    " VEZ ",
    " VECES ",
    " TIEMPO ",
    " AÑO ",
    " AÑOS ",
    " DÍA ",
    " DÍAS ",
    " NOCHE ",
    " HORA ",
    " HORAS ",
    " PARTE ",
    " PARTES ",
    " LUGAR ",
    " LUGARES ",
    " FORMA ",
    " MANERA ",
    " PERSONA ",
    " PERSONAS ",
    " HOMBRE ",
    " HOMBRES ",
    " MUJER ",
    " MUJERES ",
    " NIÑO ",
    " NIÑA ",
    " NIÑOS ",
    " NIÑAS ",
    " GENTE ",
    " FAMILIA ",
    " AMIGO ",
    " AMIGA ",
    " AMIGOS ",
    " AMIGAS ",
    " MUNDO ",
    " VIDA ",
    " CASA ",
    " CASAS ",
    " TRABAJO ",
    " ESCUELA ",
    " COMIDA ",
    " AGUA ",
    " PADRE ",
    " MADRE ",
    " HIJO ",
    " HIJA ",
    " NOMBRE ",
    " AMOR ",

    //21

    " BUENO ",
    " BUENA ",
    " BUENOS ",
    " BUENAS ",
    " MALO ",
    " MALA ",
    " GRANDES ",
    " GRANDE ",
    " PEQUEÑO ",
    " PEQUEÑA ",
    " NUEVO ",
    " NUEVA ",
    " NUEVOS ",
    " NUEVAS ",
    " MISMO ",
    " MISMA ",
    " OTRO ",
    " OTRA ",
    " OTROS ",
    " OTRAS ",

    //22

    " ES QUE ",
    " LO QUE ",
    " EL QUE ",
    " LA QUE ",
    " LOS QUE ",
    " LAS QUE ",
    " HAY QUE ",
    " YA QUE ",
    " PORQUE ",
    " PARA QUE ",
    " EN EL ",
    " EN LA ",
    " DE EL ",
    " DE LA ",
    " DE LOS ",
    " DE LAS ",
    " CON EL ",
    " CON LA ",
    " POR EL ",
    " POR LA ",
    " PARA EL ",
    " PARA LA ",

    //23

    " HOLA ",
    " MUNDO ",
    " MAMA ",
    " MAMÁ ",
    " PAPA ",
    " PAPÁ ",
    " GRACIAS ",
    " FAVOR ",
    " QUIERO ",
    " QUIERES ",
    " QUIERE ",
    " MUCHO ",
    " AMOR "
];

//24
function puntuarTexto(texto) {
    let puntuacion =analizarFrecuencias(texto);
    const textoMayusculas = " " + texto.toUpperCase() + " ";

    for (const palabra of palabrasComunes) {
        let posicion = 0;
        while ((posicion = textoMayusculas.indexOf(palabra, posicion)) !== -1) {
            puntuacion += palabra.trim().length * 3;
            posicion += palabra.length;
        }
    }
    return puntuacion;
}

//25
function descifrarAutomaticamente() {
    const texto = document.getElementById("texto").value.normalize("NFC");
    const alfabeto = obtenerAlfabeto();

    if (!validarAlfabeto(alfabeto)) {
        return;
    }

    if (texto.trim() === "") {
        mostrarEstado("Introduce un texto para descifrar", false);
        return;
    }

    const candidatos = [];

    //26
    for (let modulo = 0; modulo < alfabeto.length; modulo++){
        const resultado = descifrarCesar(texto, alfabeto, modulo);
        const puntuacion =puntuarTexto(resultado);

        candidatos.push({
            metodo: "César",
            modulo: modulo,
            texto: resultado,
            puntuacion: puntuacion
        });
    }

    //27
    const resultadoAtbash = atbash(texto, alfabeto);

    candidatos.push({
        metodo: "Atbash",
        modulo: null,
        texto: resultadoAtbash,
        puntuacion:
            puntuarTexto(resultadoAtbash)
    });

    //25.2
    candidatos.sort((a, b) => b.puntuacion - a.puntuacion);
    const mejores = candidatos.slice(0, 2);

    mostrarCandidatos(mejores);
    mostrarEstado("Análisis terminado. Se muestran los dos resultados más probables.", true);
}

//28
function mostrarCandidatos(candidatos) {
    const informacion = document.getElementById("informacion");
    let html = "";
    let texto = document.getElementById("texto").value;

    const segmentador = new Intl.Segmenter(undefined, {granularity: "grapheme"});
    const cantidadCaracteres = Array.from(segmentador.segment(texto)).length;

    if (cantidadCaracteres <= 25) {
    html += `
        <div class="advertencia">
            El texto es muy corto, por lo que el descifrado puede ser poco preciso.
        </div>
    `;
}

    candidatos.forEach((candidato, indice) => {
        html += `
            <div class="candidato">
                <h3>
                    ${indice + 1}. ${candidato.metodo}
                    ${
                        candidato.modulo !== null
                        ? " — Módulo " + candidato.modulo
                        : ""
                    }
                </h3>
                <p>
                    <strong>Puntuación:</strong>
                    <span class="puntuacion">
                        ${candidato.puntuacion.toFixed(2)}
                    </span>
                </p>
                <p>
                    <strong>Texto:</strong>
                </p>
                <p class="codigo">
                    ${escaparHTML(candidato.texto)}
                </p>
            </div>
            `;
        }
    );

    informacion.innerHTML = html;

    if (candidatos.length > 0) {
        document.getElementById("resultado").value = candidatos[0].texto;
    }
}

//29
function escaparHTML(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//30
function cifrar() {
    const texto = document.getElementById("texto").value.normalize("NFC");
    const metodo = document.getElementById("metodo").value;
    const alfabeto = obtenerAlfabeto();

    if (!validarAlfabeto(alfabeto)) {
        return;
    }
    let resultado;

    if (metodo === "cesar") {
        const modulo = parseInt(document.getElementById("modulo").value);

        if (isNaN(modulo)) {
            mostrarEstado("Introduce un módulo válido.", false);
            return;
        }

        resultado = cifrarCesar(texto, alfabeto, modulo);
        mostrarEstado("Texto cifrado con César.", true);
    }
    else {
        resultado = atbash(texto, alfabeto);
        mostrarEstado("Texto cifrado con Atbash.", true);
    }

    document.getElementById("resultado").value = resultado;
    document.getElementById("informacion").innerHTML = "";
}

//31
function mostrarModulo() {
    const metodo = document.getElementById("metodo").value;
    const contenedor = document.getElementById("contenedorModulo");

    if (metodo === "cesar") {
        contenedor.style.display = "block";
    }
    else {
        contenedor.style.display = "none";
    }
}

//32
function mostrarEstado(mensaje, correcto) {
    const estado = document.getElementById("estado");

    estado.textContent = mensaje;
    estado.className = "estado " + (correcto ? "exito" : "error");
}

//33
function limpiar() {
    document.getElementById("texto").value = "";
    document.getElementById("resultado").value = "";
    document.getElementById("informacion").innerHTML = "";
    document.getElementById("estado").className = "estado";
}

//34
mostrarModulo();