const API = 'http://localhost:3000';


/* fetches player data and fills the table rows */
async function cargar_jugadores() {

    const datos = await fetch(`${API}/admin/jugadores`)
        .then(r => r.json());

    const cuerpo_tabla =
        document.querySelector('#tabla_jugadores tbody');

    cuerpo_tabla.innerHTML = '';

    /*
        Ordena por partidas
        y toma solo los primeros 10
    */

    datos
        .sort((a, b) => b.partidas - a.partidas)
        .slice(0, 10)
        .forEach((j, indice) => {

            cuerpo_tabla.innerHTML += `
            
                <tr>

                    <td>${indice + 1}</td>

                    <td>${j.username ?? '--'}</td>

                    <td>${j.partidas ?? '--'}</td>

                    <td>${j.ultimaConexion
                        ? new Date(j.ultimaConexion).toLocaleDateString()
                        : '--'
                    }</td>

                    <td>

                        ${j.estado === 'activo'

                            ? '<span style="color:#00eaff">● ACTIVO</span>'

                            : '<span style="color:#555">○ INACTIVO</span>'
                        }

                    </td>

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