console.log("JS eliminatorias cargando");

// ================= DATOS =================
let clasificados = JSON.parse(localStorage.getItem("clasificados")) || [];
let terceros = JSON.parse(localStorage.getItem("terceros")) || [];

let faseActual = "";
let equipos = [];
let perdedoresSemifinal = [];
let finalistas = [];
let tercerPuestoGanador = "";
let Subcampeon = "";

// ================= BANDERAS =================
let banderas = {
    "Argentina":"https://flagcdn.com/w40/ar.png",
    "Brasil":"https://flagcdn.com/w40/br.png",
    "Francia":"https://flagcdn.com/w40/fr.png",
    "Inglaterra":"https://flagcdn.com/w40/gb-eng.png",
    "España":"https://flagcdn.com/w40/es.png",
    "Alemania":"https://flagcdn.com/w40/de.png",
    "Portugal":"https://flagcdn.com/w40/pt.png",
    "Países Bajos":"https://flagcdn.com/w40/nl.png",
    "Uruguay":"https://flagcdn.com/w40/uy.png",
    "Croacia":"https://flagcdn.com/w40/hr.png",
    "México":"https://flagcdn.com/w40/mx.png",
    "Estados Unidos":"https://flagcdn.com/w40/us.png",
    "Japón":"https://flagcdn.com/w40/jp.png",
    "Senegal":"https://flagcdn.com/w40/sn.png",
    "Marruecos":"https://flagcdn.com/w40/ma.png",
    "Colombia":"https://flagcdn.com/w40/co.png",
    "Ecuador":"https://flagcdn.com/w40/ec.png",
    "Australia":"https://flagcdn.com/w40/au.png",
    "Cabo Verde":"https://flagcdn.com/w40/cv.png",
    "Panamá":"https://flagcdn.com/w40/pa.png",
    "Haití":"https://flagcdn.com/w40/ht.png",
    "Sudáfrica":"https://flagcdn.com/w40/za.png",
    "Corea del Sur":"https://flagcdn.com/w40/kr.png",
    "Canadá":"https://flagcdn.com/w40/ca.png",
    "Chequia":"https://flagcdn.com/w40/cz.png",
    "Bonosia":"https://flagcdn.com/w40/ba.png",
    "Catar":"https://flagcdn.com/w40/qa.png",
    "Suiza":"https://flagcdn.com/w40/ch.png",
    "Escocia":"https://flagcdn.com/w40/gb-sct.png",
    "Paraguay":"https://flagcdn.com/w40/py.png",
    "Turquia":"https://flagcdn.com/w40/tr.png",
    "Curazao":"https://flagcdn.com/w40/cw.png",
    "Costa de Marfil":"https://flagcdn.com/w40/ci.png",
    "Suecia":"https://flagcdn.com/w40/se.png",
    "Tunez":"https://flagcdn.com/w40/tn.png",
    "Bélgica":"https://flagcdn.com/w40/be.png",
    "Egipto":"https://flagcdn.com/w40/eg.png",
    "Nueva Zelanda":"https://flagcdn.com/w40/nz.png",
    "Iran":"https://flagcdn.com/w40/ir.png",
    "Arabia Saudita":"https://flagcdn.com/w40/sa.png",
    "Irak":"https://flagcdn.com/w40/iq.png",
    "Noruega":"https://flagcdn.com/w40/no.png",
    "Argelia":"https://flagcdn.com/w40/dz.png",
    "Jordania":"https://flagcdn.com/w40/jo.png",
    "RD Congo":"https://flagcdn.com/w40/cd.png",
    "Uzbekistán":"https://flagcdn.com/w40/uz.png",
    "Ghana":"https://flagcdn.com/w40/gh.png"
};

// ================= NIVELES =================
let niveles = {
    "Brasil":5,"Argentina":5,"Francia":5,"Inglaterra":5,
    "Alemania":5,"España":5,
    "Portugal":4.5,"Países Bajos":4.5,
    "Uruguay":4.5,"Croacia":4.5,
    "México":3.5,"Estados Unidos":3.5,
    "Japón":3,"Senegal":3.5,"Marruecos":3.5,
    "Cabo Verde":1,"Panamá":2,"Haití":1,
    "Sudafrica":2.5,"Corea del sur":2,"Canada":3,
    "Catar":2.5,"Suiza":2.5,"Escocia":2.5,
    "Paraguay":3.9,"Australia":3,
    "Curazao":1,"Costa de Marfil":1,
    "Ecuador":3.5,"Tunez":2,
    "Bélgica":2,"Egipto":2,"Iran":2,
    "Arabia Saudita":2.5,
    "Noruega":3,"Argelia":2,"Jordania":2,
    "Colombia":4,"Uzbekistán":2,"Ghana":2
};

// ================= GOLES =================
function generarGoles(eq1, eq2){
    let n1 = niveles[eq1] || 3;
    let n2 = niveles[eq2] || 3;

    let g1 = Math.floor(Math.random()*3);
    let g2 = Math.floor(Math.random()*3);

    if(n1>n2){ if(Math.random()<0.7) g1++; }
    if(n2>n1){ if(Math.random()<0.7) g2++; }

    return [g1,g2];
}

// ================= GENERAR 16avos =================
function generar16avos(){

    equipos = [];

    clasificados.forEach(c=>equipos.push(c.equipo));

    let orden = [...terceros];
    orden.sort((a,b)=>{
        if(b.puntos!==a.puntos) return b.puntos-a.puntos;
        if(b.diferencia!==a.diferencia) return b.diferencia-a.diferencia;
        return b.goles-a.goles;
    });

    orden.slice(0,8).forEach(t=>equipos.push(t.equipo));

    equipos.sort(()=>Math.random()-0.5);

    faseActual="16avos de final";
    mostrarFase();
}

// ================= MOSTRAR =================
function mostrarFase(){

    let html = "<h2>"+faseActual+"</h2><div class='fase'>";

    for(let i=0;i<equipos.length;i+=2){
        html += "<div class='partido'>";

        html += "<div class='equipo'><img src='"+(banderas[equipos[i]]||"")+"' width='20'> "+equipos[i]+"</div>";
        html += "<div class='equipo'><img src='"+(banderas[equipos[i+1]]||"")+"' width='20'> "+equipos[i+1]+"</div>";

        html += "</div>";
    }

    html += "</div>";
    html += "<button class='boton-simular' onclick='simularFase()'>Simular</button>";

    document.getElementById("bracket").innerHTML = html;
}

 function simularFase(){

    let ganadores = [];
    let html = "<h2>Resultados - " + faseActual + "</h2><div class='fase'>";

    if(faseActual==="Semifinal"){
        perdedoresSemifinal = [];
    }

    for(let i=0;i<equipos.length;i+=2){

        let eq1 = equipos[i];
        let eq2 = equipos[i+1];

        let res = generarGoles(eq1,eq2);

        let g1 = res[0];
        let g2 = res[1];

        let ganador;
        let perdedor;

        // EMPATE -> PENALES
        if(g1===g2){

            let p1=Math.floor(Math.random()*5)+1;
            let p2=Math.floor(Math.random()*5)+1;

            while(p1===p2){
                p2=Math.floor(Math.random()*5)+1;
            }

            if(p1>p2){
                ganador=eq1;
                perdedor=eq2;
            }else{
                ganador=eq2;
                perdedor=eq1;
            }

            html += "<div class='tarjeta ganador'>";
            html += eq1+" "+g1+" - "+g2+" "+eq2;
            html += "<br>⚽ Penales: "+p1+" - "+p2;
            html += "<br><strong>🏆 "+ganador+"</strong>";
            html += "</div>";
        }

        // SIN EMPATE
        else{

            if(g1>g2){
                ganador=eq1;
                perdedor=eq2;
            }else{
                ganador=eq2;
                perdedor=eq1;
            }

            html += "<div class='tarjeta ganador'>";
            html += eq1+" "+g1+" - "+g2+" "+eq2;
            html += "<br><strong>🏆 "+ganador+"</strong>";
            html += "</div>";
        }

        ganadores.push(ganador);

        // guardar perdedores de semifinal
        if(faseActual==="Semifinal"){
            perdedoresSemifinal.push(perdedor);
        }

        // guardar perdedor de la FINAL = subcampeón
        if(faseActual==="Final"){
            subcampeon = perdedor;
        }
    }

    equipos = ganadores;

    html += "</div>";

    // avanzar fases
    if(equipos.length>1 || faseActual==="Tercer puesto"){

        if(faseActual==="16avos de final"){
            faseActual="Octavos de final";
        }

        else if(faseActual==="Octavos de final"){
            faseActual="Cuartos de final";
        }

        else if(faseActual==="Cuartos de final"){
            faseActual="Semifinal";
        }

        else if(faseActual==="Semifinal"){

            finalistas=[...equipos];

            equipos=perdedoresSemifinal;

            faseActual="Tercer puesto";
        }

        else if(faseActual==="Tercer puesto"){

            tercerPuestoGanador=ganadores[0];

            equipos=finalistas;

            faseActual="Final";
        }

        html += "<button class='boton-simular' onclick='mostrarFase()'>Siguiente fase</button>";
    }

    // PODIO FINAL
    else{

        html += "<h2>🏆 FINAL DE MUNDIAL</h2>";

        html += "<div class='tarjeta ganador'>🥇 Campeón: "+equipos[0]+"</div>";

        html += "<div class='tarjeta ganador'>🥈 Subcampeón: "+subcampeon+"</div>";

        html += "<div class='tarjeta ganador'>🥉 Tercer puesto: "+tercerPuestoGanador+"</div>";
    }

    document.getElementById("bracket").innerHTML=html;
}