document.addEventListener('DOMContentLoaded', cargarDatos);
document.getElementById('formulario-grupo').addEventListener('submit', agregarGrupo);
document.getElementById('formulario-tarea').addEventListener('submit', agregarTarea);

let grupoActual = null;

function cargarDatos() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    grupos.forEach(grupo => crearElementoGrupo(grupo.nombre));
    if (grupos.length > 0) {
        seleccionarGrupo(grupos[0].nombre);
    }
}

function agregarGrupo(event) {
    event.preventDefault();
    const entradaGrupo = document.getElementById('entrada-grupo');
    const grupo = entradaGrupo.value.trim();
    if (grupo) {
        crearElementoGrupo(grupo);
        guardarGrupo(grupo);
        entradaGrupo.value = '';
    }
}

function crearElementoGrupo(nombre) {
    const listaGrupos = document.getElementById('lista-grupos');
    const li = document.createElement('li');
    li.textContent = nombre;
    li.addEventListener('click', () => seleccionarGrupo(nombre));
    listaGrupos.appendChild(li);
}

function guardarGrupo(nombre) {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    grupos.push({ nombre, tareas: [] });
    localStorage.setItem('grupos', JSON.stringify(grupos));
}

function seleccionarGrupo(nombre) {
    grupoActual = nombre;
    document.querySelectorAll('#lista-grupos li').forEach(li => {
        li.style.fontWeight = li.textContent === nombre ? 'bold' : 'normal';
    });
    cargarTareas();
}

function cargarTareas() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupo = grupos.find(g => g.nombre === grupoActual);
    const listaTareas = document.getElementById('lista-tareas');
    listaTareas.innerHTML = '';
    if (grupo) {
        grupo.tareas.forEach(tarea => crearElementoTarea(tarea.texto, tarea.completada));
    }
}

function agregarTarea(event) {
    event.preventDefault();
    const entradaTarea = document.getElementById('entrada-tarea');
    const tarea = entradaTarea.value.trim();
    if (tarea && grupoActual) {
        crearElementoTarea(tarea, false);
        guardarTarea(tarea, false);
        entradaTarea.value = '';
    }
}

function crearElementoTarea(texto, completada) {
    const listaTareas = document.getElementById('lista-tareas');
    const li = document.createElement('li');
    li.className = 'tarea';
    li.innerHTML = `
        <span>${texto}</span>
        <div class="botones-tarea">
            <button class="boton-completar">Completar</button>
            <button class="boton-eliminar">Eliminar</button>
        </div>
    `;
    if (completada) {
        li.querySelector('span').style.textDecoration = 'line-through';
    }
    listaTareas.appendChild(li);

    li.querySelector('.boton-completar').addEventListener('click', () => completarTarea(li, texto));
    li.querySelector('.boton-eliminar').addEventListener('click', () => eliminarTarea(li, texto));
}

function guardarTarea(texto, completada) {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupo = grupos.find(g => g.nombre === grupoActual);
    if (grupo) {
        grupo.tareas.push({ texto, completada });
        localStorage.setItem('grupos', JSON.stringify(grupos));
    }
}

function completarTarea(li, texto) {
    const span = li.querySelector('span');
    span.style.textDecoration = 'line-through';
    actualizarEstadoTarea(texto, true);
}

function eliminarTarea(li, texto) {
    li.remove();
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupo = grupos.find(g => g.nombre === grupoActual);
    if (grupo) {
        grupo.tareas = grupo.tareas.filter(t => t.texto !== texto);
        localStorage.setItem('grupos', JSON.stringify(grupos));
    }
}

function actualizarEstadoTarea(texto, completada) {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const grupo = grupos.find(g => g.nombre === grupoActual);
    if (grupo) {
        const tarea = grupo.tareas.find(t => t.texto === texto);
        if (tarea) {
            tarea.completada = completada;
            localStorage.setItem('grupos', JSON.stringify(grupos));
        }
    }
}
