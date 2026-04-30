const API = 'http://localhost:3000';

/* fetches player data and fills the table rows */
async function cargar_jugadores() {

    /*
        Obtiene jugadores desde la API
    */
    const jugadores = await fetch(`${API}/admin/jugadores`)
        .then(r => r.json());

    /*
        Obtiene resultados de partidas
    */
    const resultados = await fetch(`${API}/admin/resultados`)
        .then(r => r.json());

    const cuerpo_tabla =
        document.querySelector('#tabla_jugadores tbody');

    cuerpo_tabla.innerHTML = '';


    jugadores
        .slice(0, 10)
        .forEach((j, indice) => {

     
            const victorias = resultados.filter(r =>
                r.username === j.username &&
                r.result === 'victory'
            ).length;

            const derrotas = resultados.filter(r =>
                r.username === j.username &&
                r.result === 'defeat'
            ).length;

     
            const partidas = victorias + derrotas;
            cuerpo_tabla.innerHTML += `
                <tr>

                    <td>${indice + 1}</td>

                    <td>${j.username ?? '--'}</td>

                    <td>${victorias}</td>

                    <td>${partidas}</td>
                </tr>
            `;
        });
}

/* updates the last refresh timestamp in the footer */
function actualizar_hora() {

    document.getElementById('ultima_actualizacion')
        .textContent = new Date().toLocaleTimeString();

}

/* initializes everything */
async function inicializar() {

    await cargar_jugadores();

    actualizar_hora();

}

/* first load */
inicializar();

/* refresh every 30 seconds */
setInterval(inicializar, 30000);