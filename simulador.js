// ================= GRUPOS =================
let tercerosGlobal = [];
let gruposSimulados = new Set();
let clasificados = [];

let niveles = {
    "Brasil": 5,
    "Argentina": 5,
    "Francia": 5,
    "Inglaterra": 5,
    "Alemania": 5,
    "España": 5,
    "Portugal": 4.5,
    "Países Bajos": 4.5,
    "Uruguay": 4.5,
    "Croacia": 4.5,
    "México": 3.5,
    "Estados Unidos": 3.5,
    "Japón": 3,
    "Senegal": 3.5,
    "Marruecos": 3.5,
    "Cabo Verde": 1,
    "Panamá": 2,
    "Haití": 1,
    "Sudafrica": 2.5,
    "Corea del sur": 2,
    "Canada": 3,
    "Catar": 2.5,
    "Suiza": 2.5,
    "Escocia": 2.5,
    "Paraguay": 3.9,
    "Australia": 3,
    "Turquia": 2,
    "Curazao": 1,
    "Costa de Marfil": 1,
    "Ecuador": 3.5,
    "Suecia": 1.5,
    "Tunez": 2,
    "Bélgica": 2,
    "Egipto": 2,
    "Nueva Zelanda": 2,
    "Iran": 2,
    "Arabia Saudita": 2.5,
    "Irak": 2,
    "Noruega": 3,
    "Argelia": 2,
    "Jordania": 2,
    "RD Congo": 1,
    "Colombia": 4,
    "Uzbekistán": 2,
    "Ghana": 2
};

let grupos = {
    A: ["México", "Sudáfrica", "Corea del Sur", "Chequia"],
    B: ["Canadá", "Bonosia", "Catar", "Suiza"],
    C: ["Brasil", "Marruecos", "Haití", "Escocia"],
    D: ["Estados Unidos", "Paraguay", "Australia", "Turquia"],
    E: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"],
    F: ["Países Bajos", "Japón", "Suecia", "Tunez"],
    G: ["Bélgica", "Egipto", "Iran", "Nueva Zelanda"],
    H: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"],
    I: ["Francia", "Senegal", "Irak", "Noruega"],
    J: ["Argentina", "Argelia", "Australia", "Jordania"],
    K: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"],
    L: ["Inglaterra", "Croacia", "Ghana", "Panamá"]
};

function mostrarEquipos() {
    let grupoSeleccionado = document.getElementById("grupo").value;
    let selectEquipo = document.getElementById("equipo");
    selectEquipo.innerHTML = "";

    if (!grupos[grupoSeleccionado]) {
        selectEquipo.innerHTML = "<option>Primero elegí un grupo</option>";
        return;
    }

    grupos[grupoSeleccionado].forEach(function(equipo) {
        let opcion = document.createElement("option");
        opcion.value = equipo;
        opcion.text = equipo;
        selectEquipo.appendChild(opcion);
    });
}

function generarGoles(eq1, eq2) {
    let nivel1 = niveles[eq1] || 3;
    let nivel2 = niveles[eq2] || 3;
    let goles1 = Math.floor(Math.random() * (nivel1 + 1));
    let goles2 = Math.floor(Math.random() * (nivel2 + 1));
    return [goles1, goles2];
}

function simularDesdeGrupo() {
    let grupoSeleccionado = document.getElementById("grupo").value;
    if (!grupos[grupoSeleccionado]) {
        alert("Elegí un grupo primero.");
        return;
    }

    gruposSimulados.add(grupoSeleccionado);
    let equiposGrupo = grupos[grupoSeleccionado];

    let tabla = {};
    equiposGrupo.forEach(equipo => {
        tabla[equipo] = {
            puntos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0
        };
    });

    let texto = "⚽ RESULTADOS:\n\n";

    for (let i = 0; i < equiposGrupo.length; i++) {
        for (let j = i + 1; j < equiposGrupo.length; j++) {
            let eq1 = equiposGrupo[i];
            let eq2 = equiposGrupo[j];
            let [goles1, goles2] = generarGoles(eq1, eq2);

            texto += `${eq1} ${goles1} - ${eq2} ${goles2}\n`;

            tabla[eq1].golesFavor += goles1;
            tabla[eq1].golesContra += goles2;
            tabla[eq2].golesFavor += goles2;
            tabla[eq2].golesContra += goles1;

            if (goles1 > goles2) tabla[eq1].puntos += 3;
            else if (goles2 > goles1) tabla[eq2].puntos += 3;
            else {
                tabla[eq1].puntos += 1;
                tabla[eq2].puntos += 1;
            }
        }
    }

    for (let equipo in tabla) {
        tabla[equipo].diferencia = tabla[equipo].golesFavor - tabla[equipo].golesContra;
    }

    let clasificacion = Object.entries(tabla).sort((a, b) => {
        if (b[1].puntos !== a[1].puntos) return b[1].puntos - a[1].puntos;
        if (b[1].diferencia !== a[1].diferencia) return b[1].diferencia - a[1].diferencia;
        return b[1].golesFavor - a[1].golesFavor;
    });

    clasificados = clasificados.filter(c => c.grupo !== grupoSeleccionado);
    clasificados.push({ equipo: clasificacion[0][0], grupo: grupoSeleccionado, posicion: 1 });
    clasificados.push({ equipo: clasificacion[1][0], grupo: grupoSeleccionado, posicion: 2 });

    let tercero = clasificacion[2];
    tercerosGlobal = tercerosGlobal.filter(t => t.grupo !== grupoSeleccionado);
    tercerosGlobal.push({
        equipo: tercero[0],
        puntos: tercero[1].puntos,
        diferencia: tercero[1].diferencia,
        goles: tercero[1].golesFavor,
        grupo: grupoSeleccionado
    });

    localStorage.setItem("clasificados", JSON.stringify(clasificados));
    localStorage.setItem("terceros", JSON.stringify(tercerosGlobal));

    let contenedor = document.getElementById("tabla-posiciones");
    let html = "<h2>🏆 Tabla de posiciones</h2>";
    html += "<table class='tabla'>";
    html += `
        <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>Pts</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
        </tr>`;
    clasificacion.forEach((equipo, index) => {
        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${equipo[0]}</td>
            <td>${equipo[1].puntos}</td>
            <td>${equipo[1].golesFavor}</td>
            <td>${equipo[1].golesContra}</td>
            <td>${equipo[1].diferencia}</td>
        </tr>`;
    });
    html += "</table>";
    contenedor.innerHTML = `<h2>⚽ Resultados</h2><pre>${texto}</pre>${html}`;
}

function mostrarMejoresTerceros() {
    if (tercerosGlobal.length === 0) {
        alert("Primero simulá al menos un grupo.");
        return;
    }

    let copia = [...tercerosGlobal];
    copia.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
        return b.goles - a.goles;
    });

    let html = "<h2>🥉 Mejores terceros</h2>";
    html += "<table class='tabla'>";
    html += `
        <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>Pts</th>
            <th>DG</th>
            <th>GF</th>
            <th>Grupo</th>
        </tr>`;
    copia.forEach((t, index) => {
        let clase = index < 8 ? "clasificado" : "";
        html += `
        <tr class="${clase}">
            <td>${index + 1}</td>
            <td>${t.equipo}</td>
            <td>${t.puntos}</td>
            <td>${t.diferencia}</td>
            <td>${t.goles}</td>
            <td>${t.grupo}</td>
        </tr>`;
    });
    html += "</table>";
    document.getElementById("tabla-posiciones").innerHTML = html;
}

function irAEliminatorias() {
    if (gruposSimulados.size < 12) {
        alert("Primero tenés que simular todos los grupos.");
        return;
    }

    localStorage.setItem("clasificados", JSON.stringify(clasificados));
    localStorage.setItem("terceros", JSON.stringify(tercerosGlobal));
    window.location.href = "eliminatorias.html";
}