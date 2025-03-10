const express = require("express");
const mysql = require("mysql2");
var bodyParser = require('body-parser');
const e = require("express");
var app = express();

// Conexión a la base de datos MySQL
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'HalleysComet_13',
    database: 'billie_db'
});
con.connect();

// Middleware para procesar formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Función para sanitizar los datos (eliminar etiquetas HTML/JS)
function sanitizeInput(input) {
    return input.replace(/<[^>]*>/g, '');  // Remueve cualquier etiqueta HTML
}

// Ruta para agregar un usuario
app.post('/agregarUsuario', (req, res) => {
    let { nombre, edad, album, cancion, video, perfume, lyric, documental } = req.body;

    // Limitar la longitud del texto
    if (nombre.length > 100 || edad.length > 100 || cancion.length > 100 || video.length > 100 || lyric.length > 100 || documental.length > 100) {
        return res.status(400).send("Los inputs no pueden contener más de 100 caracteres.");
    }

    // Verificar que los valores no estén vacíos y no sean solo espacios
    if (!nombre.trim() || !edad.trim() || !cancion.trim() || !video.trim() || !lyric.trim() || !documental.trim()) {
        return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Sanitizar las entradas para evitar HTML/JS
    nombre = sanitizeInput(nombre);
    cancion = sanitizeInput(cancion);
    video = sanitizeInput(video);
    perfume = sanitizeInput(perfume);
    lyric = sanitizeInput(lyric);
    documental = sanitizeInput(documental);

    // Validar que los valores de las opciones seleccionadas sean válidos
    const validAlbums = ['when we all fall asleep, where do we go?', 'Happier Than Ever', 'HIT ME HARD AND SOFT'];
    const validPerfumes = ['eilish 1', 'eilish 2', 'eilish 3', 'your turn'];

    if (!validAlbums.includes(album)) {
        return res.status(400).send("Álbum no válido.");
    }

    if (!validPerfumes.includes(perfume)) {
        return res.status(400).send("Perfume no válido.");
    }

    // Insertar datos en la base de datos
    con.query('INSERT INTO gustos (nombre, edad, album, cancion, video, perfume, lyric, documental) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [nombre, edad, album, cancion, video, perfume, lyric, documental], 
        (err, respuesta) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send("Error al conectar");
            }
            return res.send("<h1>Registro exitoso</h1><a href='/obtenerUsuario'>Ver usuarios registrados</a>");
        }
    );
});

function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Función para escapar caracteres especiales de HTML
function escapeHTML(text) {
    return text
        .replace(/&/g, '')
        .replace(/</g, '')
        .replace(/>/g, '')
        .replace(/"/g, ';')
        .replace(/'/g, '');
}

// Ruta para obtener los usuarios y mostrarlos

app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM gustos', (err, respuesta) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send("Error al consultar usuarios");
        }
        if (respuesta.length === 0) {
            return res.status(404).send("No hay ningún usuario registrado :c");
        }

        let resultadoHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Registros</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #f5f5dc; /* Crema suave */
                        color: #4a403a; /* Café claro */
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }

                    h1 {
                        color: #d4a373; /* Amarillo dorado suave */
                    }

                    .container {
                        max-width: 1100px;
                        margin-top: 50px;
                        padding: 20px;
                        background-color: #fffaf0; /* Blanco marfil */
                        border: 2px solid #d4a373; /* Borde marcado */
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Sombra */
                        border-radius: 12px;
                    }

                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    th {
                        background-color: #d4a373; /* Amarillo suave */
                        color: #fffaf0; /* Blanco marfil */
                        padding: 12px 15px;
                        text-align: center;
                    }

                    td {
                        border: 1px solid #d4a373;
                        padding: 10px;
                        text-align: center;
                    }

                    tr:hover {
                        background-color: #f0e1c7; /* Color de hover para las filas */
                    }

                    .btn-primary, .btn-danger {
                        padding: 8px 16px;
                        font-size: 14px;
                    }

                    .btn-primary {
                        background-color: #d4a373;
                        border-color: #d4a373;
                    }

                    .btn-primary:hover {
                        background-color: #c2996c;
                        border-color: #c2996c;
                    }

                    .btn-danger {
                        background-color: #b85750;
                        border-color: #b85750;
                    }

                    .btn-danger:hover {
                        background-color: #a44e47;
                        border-color: #a44e47;
                    }

                    .text-center {
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="mb-4 text-center">Registros de Gustos ♥</h1>
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Edad</th>
                                <th>Álbum</th>
                                <th>Canción</th>
                                <th>Video</th>
                                <th>Perfume</th>
                                <th>Frase</th>
                                <th>Documental</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>`;

        // Llenar la tabla con los datos de la base de datos
        respuesta.forEach(gustos => {
            resultadoHTML += `
                <tr>
                    <td>${gustos.id}</td>
                    <td>${escapeHTML(gustos.nombre)}</td>
                    <td>${gustos.edad}</td>
                    <td>${escapeHTML(gustos.album)}</td>
                    <td>${escapeHTML(gustos.cancion)}</td>
                    <td>${escapeHTML(gustos.video)}</td>
                    <td>${escapeHTML(gustos.perfume)}</td>
                    <td>${escapeHTML(gustos.lyric)}</td>
                    <td>${escapeHTML(gustos.documental)}</td>
                    <td>
                        <a href="/editarUsuario?id=${gustos.id}" class="btn btn-primary btn-sm">Editar</a>
                        <a href="#" onclick="confirmarEliminacion(${gustos.id})" class="btn btn-danger btn-sm">Eliminar</a>
                    </td>
                </tr>`;
        });

        resultadoHTML += `</tbody>
            </table>
            <div class="text-center mt-4">
                <a href="/" class="btn btn-success">Volver al Formulario ♥</a>
            </div>
        </div>`;

        // Agregar JavaScript para la confirmación de eliminación
        resultadoHTML += `
        <script>
            function confirmarEliminacion(id) {
                if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
                    window.location.href = '/eliminarUsuario?id=' + id;
                }
            }
        </script>`;

        // Enviar el HTML con los registros al navegador
        return res.send(resultadoHTML);
    });
});



// Ruta para eliminar un usuario
app.get('/eliminarUsuario', (req, res) => {
    const id = req.query.id;
    con.query('DELETE FROM gustos WHERE id = ?', [id], (err, respuesta) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send("Error al eliminar");
        }
        return res.send("<h1>Usuario eliminado</h1><a href='/obtenerUsuario'>Ver usuarios registrados</a>");
    });
});

// Ruta para editar un usuario (GET)
app.get('/editarUsuario', (req, res) => {
    const id = req.query.id;
    con.query('SELECT * FROM gustos WHERE id = ?', [id], (err, respuesta) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send("Error al consultar el usuario");
        }
        if (respuesta.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.send(`
            <form action="/editarUsuario" method="post">
                <input type="hidden" name="id" value="${respuesta[0].id}">
                <input type="text" name="nombre" value="${respuesta[0].nombre}" placeholder="Nombre" required><br>
                <input type="number" name="edad" value="${respuesta[0].edad}" placeholder="Edad" required><br>

                <label for="album">Álbum Favorito</label><br>
                <select name="album" required>
                    <option value="when we all fall asleep, where do we go?" ${respuesta[0].album === 'when we all fall asleep, where do we go?' ? 'selected' : ''}>When We All Fall Asleep, Where Do We Go?</option>
                    <option value="Happier Than Ever" ${respuesta[0].album === 'Happier Than Ever' ? 'selected' : ''}>Happier Than Ever</option>
                    <option value="HIT ME HARD AND SOFT" ${respuesta[0].album === 'HIT ME HARD AND SOFT' ? 'selected' : ''}>HIT ME HARD AND SOFT</option>
                </select><br>

                <input type="text" name="cancion" value="${respuesta[0].cancion}" placeholder="Canción Favorita" required><br>
                <input type="text" name="video" value="${respuesta[0].video}" placeholder="Video Favorito" required><br>
                <label for="perfume">Perfume Favorito</label><br>
                <select name="perfume" required>
                    <option value="eilish 1" ${respuesta[0].perfume === 'eilish 1' ? 'selected' : ''}>Eilish 1</option>
                    <option value="eilish 2" ${respuesta[0].perfume === 'eilish 2' ? 'selected' : ''}>Eilish 2</option>
                    <option value="eilish 3" ${respuesta[0].perfume === 'eilish 3' ? 'selected' : ''}>Eilish 3</option>
                    <option value="your turn" ${respuesta[0].perfume === 'your turn' ? 'selected' : ''}>Your Turn</option>
                </select><br>
                <input type="text" name="lyric" value="${respuesta[0].lyric}" placeholder="Letra Favorita" required><br>
                <input type="text" name="documental" value="${respuesta[0].documental}" placeholder="Documental" required><br>
                <input type="submit" value="Actualizar Usuario">
            </form>
        `);
    });
});

// Ruta para actualizar un usuario (POST)
app.post('/editarUsuario', (req, res) => {
    const { id, nombre, edad, album, cancion, video, perfume, lyric, documental } = req.body;

    // Validar que los campos no estén vacíos
    if (!nombre.trim() || !edad.trim() || !album.trim() || !cancion.trim() || !video.trim() || !perfume.trim() || !lyric.trim() || !documental.trim()) {
        return res.status(400).send("Todos los campos son obligatorios y no deben estar vacíos.");
    }

    // Limitar la longitud de los campos para evitar entradas demasiado largas
    if (nombre.length > 100 || edad.length > 100 || cancion.length > 100 || video.length > 100 || lyric.length > 100 || documental.length > 100) {
        return res.status(400).send("Los campos no pueden exceder los 100 caracteres.");
    }

    // Sanitizar las entradas para evitar etiquetas HTML/JS
    const sanitizedNombre = sanitizeInput(nombre);
    const sanitizedCancion = sanitizeInput(cancion);
    const sanitizedVideo = sanitizeInput(video);
    const sanitizedLyric = sanitizeInput(lyric);
    const sanitizedDocumental = sanitizeInput(documental);

    // Validar que los valores de las opciones seleccionadas sean válidos
    const validAlbums = ['when we all fall asleep, where do we go?', 'Happier Than Ever', 'HIT ME HARD AND SOFT'];
    const validPerfumes = ['eilish 1', 'eilish 2', 'eilish 3', 'your turn'];

    if (!validAlbums.includes(album)) {
        return res.status(400).send("Álbum no válido.");
    }

    if (!validPerfumes.includes(perfume)) {
        return res.status(400).send("Perfume no válido.");
    }

    // Realizar la actualización en la base de datos
    con.query('UPDATE gustos SET nombre = ?, edad = ?, album = ?, cancion = ?, video = ?, perfume = ?, lyric = ?, documental = ? WHERE id = ?',
        [sanitizedNombre, edad, album, sanitizedCancion, sanitizedVideo, perfume, sanitizedLyric, sanitizedDocumental, id],
        (err, respuesta) => {
            if (err) {
                console.log("Error al actualizar", err);
                return res.status(500).send("Error al actualizar el usuario");
            }
            return res.send("<h1>Usuario actualizado exitosamente</h1><a href='/obtenerUsuario'>Ver usuarios registrados</a>");
        }
    );
});


// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
