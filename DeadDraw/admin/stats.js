/*
    TOP PLAYERS - DEAD DRAW
    Obtiene los 10 mejores jugadores desde la API
*/

const API = 'http://localhost:3000';

/*
    Obtiene los jugadores desde la API
    y llena la tabla
*/

async function cargar_jugadores() {

    const datos = await fetch(`${API}/topPlayers`)
        .then(respuesta => respuesta.json());

    const cuerpo_tabla =
        document.querySelector('#tabla_jugadores tbody');

    cuerpo_tabla.innerHTML = '';

    /*
        Solo toma los primeros 10 jugadores
    */

    datos.slice(0, 10).forEach((jugador, indice) => {

        cuerpo_tabla.innerHTML += `
        
            <tr>

                <td>${indice + 1}</td>

                <td>${jugador.username ?? '--'}</td>

                <td>${jugador.victorias ?? '--'}</td>

                <td>${jugador.partidas ?? '--'}</td>

                <td>${jugador.kills ?? '--'}</td>

                <td>${jugador.kd ?? '--'}</td>

            </tr>

        `;

    });

}

/*
    Actualiza la hora del footer
*/

function actualizar_hora() {

    document.getElementById('ultima_actualizacion')
        .textContent = new Date().toLocaleTimeString();

}

/*
    Inicializa todo
*/

async function inicializar() {

    await cargar_jugadores();

    actualizar_hora();

}

/*
    Primera carga
*/

inicializar();

/*
    Refresca cada 30 segundos
*/

setInterval(inicializar, 30000);