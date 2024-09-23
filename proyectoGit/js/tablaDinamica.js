document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://66748edb75872d0e0a96db9c.mockapi.io/api/usuarios';
    const tablaActividades = document.getElementById('tablaActividades').getElementsByTagName('tbody')[0];
    const formActividad = document.getElementById('formActividad');
    const btnAgregarMultiples = document.getElementById('agregar-varios');

    // Función para cargar los datos en la tabla
    function cargarDatos() {
        fetch(apiUrl)
            .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
            .then(data => data.forEach(agregarFila))
            .catch(() => {});
    }

    // Función para agregar una nueva actividad
    function agregarNuevaActividad(event) {
        event.preventDefault();

        const nuevaActividad = {
            nombre: document.getElementById('nombre').value,
            actividad: document.getElementById('actividad').value,
            dia: document.getElementById('dia').value,
            hora: document.getElementById('hora').value,
            coach: document.getElementById('coach').value,
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaActividad)
        })
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(data => {
            agregarFila(data);
            formActividad.reset();
        })
        .catch(() => {});
    }

    // Función para agregar una fila a la tabla
    function agregarFila(actividad) {
        const row = tablaActividades.insertRow();
        row.innerHTML = `
            <td>${actividad.nombre}</td>
            <td>${actividad.actividad}</td>
            <td>${actividad.dia}</td>
            <td>${actividad.hora}</td>
            <td>${actividad.coach}</td>
            <td>
                <button class="btnEditar">Editar</button>
                <button class="btnEliminar">Eliminar</button>
            </td>
        `;

        // Botón editar
        row.querySelector('.btnEditar').addEventListener('click', () => {
            const cells = row.cells;
            document.getElementById('nombre').value = cells[0].textContent;
            document.getElementById('actividad').value = cells[1].textContent;
            document.getElementById('dia').value = cells[2].textContent;
            document.getElementById('hora').value = cells[3].textContent;
            document.getElementById('coach').value = cells[4].textContent;

            document.querySelector('#formActividad button[type="submit"]').textContent = 'Guardar Cambios';

            formActividad.removeEventListener('submit', agregarNuevaActividad);
            formActividad.addEventListener('submit', function editarActividad(event) {
                event.preventDefault();

                const actividadEditada = {
                    nombre: document.getElementById('nombre').value,
                    actividad: document.getElementById('actividad').value,
                    dia: document.getElementById('dia').value,
                    hora: document.getElementById('hora').value,
                    coach: document.getElementById('coach').value,
                };

                fetch(`${apiUrl}/${actividad.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(actividadEditada)
                })
                .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
                .then(data => {
                    cells[0].textContent = data.nombre;
                    cells[1].textContent = data.actividad;
                    cells[2].textContent = data.dia;
                    cells[3].textContent = data.hora;
                    cells[4].textContent = data.coach;

                    formActividad.reset();
                    document.querySelector('#formActividad button[type="submit"]').textContent = 'Agregar';

                    formActividad.removeEventListener('submit', editarActividad);
                    formActividad.addEventListener('submit', agregarNuevaActividad);
                })
                .catch(() => {});
            }, { once: true });
        });

        // Botón borrar
        row.querySelector('.btnEliminar').addEventListener('click', () => {
            fetch(`${apiUrl}/${actividad.id}`, { method: 'DELETE' })
                .then(response => response.ok ? tablaActividades.removeChild(row) : Promise.reject(response.statusText))
                .catch(() => {});
        });
    }

     // Función para agregar múltiples actividades
     btnAgregarMultiples.addEventListener('click', async () => {
        const nombre = document.getElementById('nombre').value;
        const actividad = document.getElementById('actividad').value;
        const dia = document.getElementById('dia').value;
        const hora = document.getElementById('hora').value;
        const coach = document.getElementById('coach').value;

        if (!nombre || !actividad || !dia || !hora || !coach) {
            return;
        }

        const nuevaActividad = { nombre, actividad, dia, hora, coach };

        for (let i = 0; i < 3; i++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevaActividad)
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                agregarFila(data);
            } catch {
                }
        }

        formActividad.reset();
    });

    formActividad.addEventListener('submit', agregarNuevaActividad);

    cargarDatos();
});
