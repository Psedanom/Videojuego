const API = 'http://localhost:3000';

/* stores chart instances to destroy them before redrawing */
let grafica_frecuencia = null;
let grafica_resultados = null;
let grafica_actividad  = null;

// al inicio de admin.js
if (player.role !== 'admin') {
    window.location.href = '../index.html'; // o donde sea tu página principal
}

/* fetches the four metric cards from the API and updates the HTML */
async function cargar_metricas() {
    const [activos, partidas, duracion, abandono] = await Promise.all([
        fetch(`${API}/admin/activos`).then(r => r.json()),
        fetch(`${API}/admin/partidas-hoy`).then(r => r.json()),
        fetch(`${API}/admin/duracion`).then(r => r.json()),
        fetch(`${API}/admin/abandono`).then(r => r.json())
    ]);

    document.getElementById('stat_activos').textContent  = activos.total ?? '--';
    document.getElementById('stat_partidas').textContent = partidas.total ?? '--';
    document.getElementById('stat_duracion').textContent = (duracion.promedio ?? '--') + ' min';
    document.getElementById('stat_abandono').textContent = (abandono.porcentaje ?? '--') + '%';
}

/* fetches games per day and draws the bar chart */
async function cargar_frecuencia() {
    const datos = await fetch(`${API}/admin/frecuencia`).then(r => r.json());

    /* destroy previous chart before creating a new one */
    if (grafica_frecuencia) grafica_frecuencia.destroy();

    grafica_frecuencia = new Chart(document.getElementById('grafica_frecuencia'), {
        type: 'bar',
        data: {
            labels: datos.map(d => d.dia),
            datasets: [{
                label: 'Partidas',
                data: datos.map(d => d.total),
                backgroundColor: '#e8002d',
                borderColor: '#a83331',
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#888', font: { family: 'monospace' } } } },
            scales: {
                x: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } },
                y: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } }
            }
        }
    });
}

/* fetches victories and defeats and draws the doughnut chart */
async function cargar_resultados() {
    const datos = await fetch(`${API}/admin/resultados`).then(r => r.json());

    const victorias = datos.find(d => d.result === 'victory')?.total ?? 0;
    const derrotas  = datos.find(d => d.result === 'defeat')?.total  ?? 0;

    if (grafica_resultados) grafica_resultados.destroy();

    grafica_resultados = new Chart(document.getElementById('grafica_resultados'), {
        type: 'doughnut',
        data: {
            labels: ['Victorias', 'Derrotas'],
            datasets: [{
                data: [victorias, derrotas],
                backgroundColor: ['#277401', '#e8002d'],
                borderColor: '#111',
                borderWidth: 3
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#888', font: { family: 'monospace' } } } }
        }
    });
}

/* fetches connections per hour and draws the line chart */
async function cargar_actividad() {
    const datos = await fetch(`${API}/admin/actividad`).then(r => r.json());

    /* fills all 24 hours even if some have no data */
    const horas   = Array.from({ length: 24 }, (_, i) => i);
    const totales = horas.map(h => datos.find(d => d.hora === h)?.total ?? 0);

    if (grafica_actividad) grafica_actividad.destroy();

    grafica_actividad = new Chart(document.getElementById('grafica_actividad'), {
        type: 'line',
        data: {
            labels: horas.map(h => `${h}:00`),
            datasets: [{
                label: 'Conexiones',
                data: totales,
                borderColor: '#00eaff',
                backgroundColor: 'rgba(0,234,255,0.05)',
                pointBackgroundColor: '#00eaff',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#888', font: { family: 'monospace' } } } },
            scales: {
                x: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } },
                y: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } }
            }
        }
    });
}


/* fetches player data and fills the table rows */
async function cargar_jugadores() {
    const datos = await fetch(`${API}/admin/jugadores`).then(r => r.json());

    const cuerpo_tabla = document.querySelector('#tabla_jugadores tbody');
    cuerpo_tabla.innerHTML = '';

    datos.forEach(j => {
        const fecha = j.ultimaConexion
            ? new Date(j.ultimaConexion).toLocaleDateString()
            : '--';

        const estado = j.estado === 'activo'
            ? '<span style="color:#00eaff">● ACTIVO</span>'
            : '<span style="color:#333">○ INACTIVO</span>';

        cuerpo_tabla.innerHTML += `
            <tr>
                <td>${j.username ?? '--'}</td>
                <td>${j.partidas}</td>
                <td>${fecha}</td>
                <td>${estado}</td>
            </tr>
        `;
    });
}

/* updates the last refresh timestamp in the footer */
function actualizar_hora() {
    document.getElementById('ultima_actualizacion').textContent =
        new Date().toLocaleTimeString();
}

/* runs all fetch functions in parallel and updates the timestamp */
async function inicializar() {
    await Promise.all([
        cargar_metricas(),
        cargar_frecuencia(),
        cargar_resultados(),
        cargar_actividad(),
        cargar_jugadores()
    ]);
    actualizar_hora();
}
inicializar();
/* refreshes all data every 30 seconds */
setInterval(inicializar, 30000);