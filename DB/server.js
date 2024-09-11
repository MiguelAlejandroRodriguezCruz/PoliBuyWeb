const express = require('express');
const odbc = require('odbc');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Asegúrate de importar el módulo fs
const app = express();
const port = 3001;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());

// Construir la ruta absoluta al archivo de base de datos
const dbPath = path.join(__dirname, 'PoliBuy.accdb');

// Cadena de conexión DSN-less
const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${dbPath};`;

// Middleware para habilitar CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Permitir solicitudes desde http://localhost:3000
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Endpoint para registrar un usuario
app.post('/registerUser', async (req, res) => {
    try {
        const { Nombre, Correo, Contraseña, Tipo, Telefono } = req.body;
        const connection = await odbc.connect(connectionString);
        const query = " INSERT INTO Usuarios (Nombre, Correo, Contraseña, Tipo, Telefono) VALUES ('" + Nombre + "', '" + Correo + "', '" + Contraseña + "', 'Cliente', '" + Telefono + "')";

        await connection.query(query);
        await connection.close();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para autenticar un usuario
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await odbc.connect(connectionString);
        const query = "SELECT Tipo, Nombre FROM Usuarios WHERE Correo = '" + email + "' AND Contraseña = '" + password + "'";
        const result = await connection.query(query);

        if (result.length > 0) {
            const userRole = result[0].Tipo;
            res.json({ tipo: userRole });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        await connection.close();
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para devolver los ultimos 5 productos agregados
app.get('/productsDashboard', async (req, res) => {
    try {
        const connection = await odbc.connect(connectionString);

        // Consulta para obtener los últimos 5 productos
        const query = 'SELECT TOP 5 * FROM Productos ORDER BY ID DESC';
        console.log(query);
        const result = await connection.query(query);

        res.json(result);
        await connection.close();
    } catch (err) {
        console.error('Error en la consulta:', err.message);
        res.status(500).send(err.message);
    }
});

// Endpoint para devolver los productos con ofertas
app.get('/productsOffers', async (req, res) => {
    try {
        const connection = await odbc.connect(connectionString);

        // Consulta para obtener los últimos 5 productos
        const result = await connection.query('SELECT * FROM Productos WHERE Oferta != 0');

        res.json(result);
        await connection.close();
    } catch (err) {
        console.error('Error en la consulta:', err.message);
        res.status(500).send(err.message);
    }
});

// Endpoint para agregar un producto
app.post('/createProduct', async (req, res) => {
    try {
        const { Nombre, Precio, Descripcion, Cantidad, Categoria, Fecha } = req.body;
        const connection = await odbc.connect(connectionString);
        const query = " INSERT INTO Productos (Nombre, Precio, Descripcion, Cantidad, Categoria, Fecha) VALUES ('" + Nombre + "', '" + Precio + "', '" + Descripcion + "', '" + Cantidad + "', '" + Categoria + "', '" + Fecha + "')";

        await connection.query(query);
        await connection.close();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para editar un producto
app.put('/editProduct/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Precio, Descripcion, Cantidad, Oferta, Categoria, Ventas, Color, Tamaño } = req.body;

    try {
        const connection = await odbc.connect(connectionString);

        // Consulta para actualizar el producto con el ID especificado
        const query = `UPDATE Productos SET Nombre = '${Nombre}', Precio = '${Precio}', Descripcion = '${Descripcion}', Cantidad = '${Cantidad}', Oferta = '${Oferta}', Categoria = '${Categoria}', Ventas = '${Ventas}', Color = '${Color}', Tamaño = '${Tamaño}' WHERE id_producto = ${id}`;

        await connection.query(query);
        res.json({ message: 'Producto actualizado correctamente' });
        await connection.close();
    } catch (err) {
        console.error('Error al actualizar el producto:', err.message);
        res.status(500).send(err.message);
    }
});

/*
app.get('/data', async (req, res) => {
    try {
        //console.log('Intentando conectar a la base de datos...');
        const connection = await odbc.connect(connectionString);
        //console.log('Conexión establecida.');

        const result = await connection.query('SELECT * FROM Usuarios');
        //console.log('Consulta realizada:', result);

        res.json(result);
        await connection.close();
        //console.log('Conexión cerrada.');
    } catch (err) {
        console.error('Error en la consulta:', err.message);
        res.status(500).send(err.message);
    }
});

// Endpoint para registrar un usuario
app.post('/register', async (req, res) => {
    try {
        const { boleta, firstName, lastName, email, registerPassword, role } = req.body;
        const connection = await odbc.connect(connectionString);
        const query = " INSERT INTO Usuarios (Boleta, Nombre, Apellido, Correo, Contraseña, Tipo) VALUES ('" + boleta + "', '" + firstName + "', '" + lastName + "', '" + email + "', '" + registerPassword + "', '" + role + "')";

        await connection.query(query);
        await connection.close();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para autenticar un usuario
app.post('/login', async (req, res) => {
    const { boleta, password } = req.body;

    try {
        const connection = await odbc.connect(connectionString);
        const query = "SELECT Tipo FROM Usuarios WHERE Boleta = " + parseInt(boleta) + " AND Contraseña = '" + password + "'";
        const result = await connection.query(query);

        if (result.length > 0) {
            const userRole = result[0].Tipo;
            res.json({ tipo: userRole });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        await connection.close();
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/create-project', async (req, res) => {
    try {
        const { nombre, materia, director, asesores, alumnos } = req.body;
        const connection = await odbc.connect(connectionString);

        // Insertar en tabla Proyectos
        const projectQuery = `INSERT INTO Proyectos (nombre, materia, director) VALUES ('${nombre}', '${materia}', '${director}')`;
        await connection.query(projectQuery);

        // Obtener el ID del proyecto recién insertado
        const projectIdQuery = `SELECT TOP 1 id_proyecto FROM Proyectos ORDER BY id_proyecto DESC`;
        const projectIdResult = await connection.query(projectIdQuery);
        const projectId = projectIdResult[0].id_proyecto;

        const documentQuery = `INSERT INTO Documentos (id_proyecto) VALUES ('${projectId}')`;
        await connection.query(documentQuery);

        console.log(`Proyecto creado con ID: ${projectId}`);

        // Insertar asesores en la tabla Proyectos_Asesores
        for (const asesor of asesores) {
            const advisorQuery = `INSERT INTO Proyectos_Asesores (id_proyecto, id_asesor) VALUES (${projectId}, ${asesor})`;
            await connection.query(advisorQuery);
        }

        // Insertar alumnos en la tabla Proyectos_Alumnos
        for (const alumno of alumnos) {
            const studentQuery = `INSERT INTO Proyectos_Alumnos (id_proyecto, id_alumno) VALUES (${projectId}, ${alumno})`;
            await connection.query(studentQuery);
        }

        await connection.close();
        res.status(201).json({ message: 'Proyecto creado correctamente' });
    } catch (err) {
        console.error('Error al crear el proyecto:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

//Delete Proyecto
app.delete('/delete-proyect/:id_proyecto', async (req, res) => {
    const { id_proyecto } = req.params;

    try {
        const connection = await odbc.connect(connectionString);

        const query1 = `DELETE FROM Proyectos WHERE id_proyecto = ${id_proyecto}`;
        await connection.query(query1);
        const query2 = `DELETE FROM Proyectos_Alumnos WHERE id_proyecto = ${id_proyecto}`;
        await connection.query(query2);
        const query3 = `DELETE FROM Proyectos_Asesores WHERE id_proyecto = ${id_proyecto}`;
        await connection.query(query3);
        const query4 = `DELETE FROM Documentos WHERE id_proyecto = ${id_proyecto}`;
        await connection.query(query4);

        await connection.close();

        res.status(200).json({ message: 'Proyecto eliminado' });
    } catch (err) {
        console.error('Error al eliminar el Proyecto:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Nueva ruta para obtener proyectos de un usuario
app.get('/user-projects/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log("Obtener los proyectos")
    try {
        const connection = await odbc.connect(connectionString);

        // Consulta para obtener proyectos donde el usuario es director
        const directorProjectsQuery = `SELECT id_proyecto, nombre FROM Proyectos WHERE director = ${userId}`;
        console.log("Consulta en directores " + directorProjectsQuery);
        const directorProjects = await connection.query(directorProjectsQuery);

        // Consulta para obtener proyectos donde el usuario es asesor
        const advisorProjectsQuery = `SELECT p.id_proyecto, p.nombre 
                                      FROM Proyectos as p 
                                      INNER JOIN Proyectos_Asesores as pa ON p.id_proyecto = pa.id_proyecto 
                                      WHERE pa.id_asesor = ${userId}`;
        console.log("Consulta en Proyectos_Asesores " + advisorProjectsQuery);
        const advisorProjects = await connection.query(advisorProjectsQuery);

        // Unir ambas listas de proyectos
        const projects = [...directorProjects, ...advisorProjects];

        await connection.close();
        res.json(projects);
    } catch (err) {
        console.error('Error al obtener los proyectos del usuario:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/student-project/:boleta', async (req, res) => {
    const { boleta } = req.params;

    try {
        const connection = await odbc.connect(connectionString);

        const query = `
            SELECT TOP 1 p.id_proyecto, p.nombre, p.materia, d.Nombre AS director
            FROM (Proyectos_Alumnos AS pa
            INNER JOIN Proyectos AS p ON pa.id_proyecto = p.id_proyecto)
            INNER JOIN Usuarios AS d ON p.director = d.Boleta
            WHERE pa.id_alumno = ${boleta}
            ORDER BY p.id_proyecto DESC;`;
        console.log("Querry 1" + query)
        const result = await connection.query(query);

        if (result.length > 0) {
            const projectId = result[0].id_proyecto;
            // Obtener asesores del proyecto
            const asesoresQuery = `
                SELECT a.Nombre
                FROM Proyectos_Asesores pa
                INNER JOIN Usuarios a ON pa.id_asesor = a.Boleta
                WHERE pa.id_proyecto = ${projectId}`;
            console.log("Querry 2 "+ asesoresQuery);
            const asesoresResult = await connection.query(asesoresQuery);

            const alumnosQuery = `
                SELECT a.Nombre
                FROM Proyectos_Alumnos pa
                INNER JOIN Usuarios a ON pa.id_alumno = a.Boleta
                WHERE pa.id_proyecto = ${projectId}`;
            console.log("Querry 3 "+ alumnosQuery);
            const alumnosResult = await connection.query(alumnosQuery);

            res.json({ ...result[0], asesores: asesoresResult, alumnos: alumnosResult });
        } else {
            res.json(null);
        }

        await connection.close();
    } catch (err) {
        console.error('Error al obtener el proyecto del estudiante:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/upload-document/:id_proyecto/:tipoDocumento', upload.single('file'), async (req, res) => {
    const { id_proyecto } = req.params;
    const { tipoDocumento } = req.params;
    const { projectId } = req.body;
    const { path: tempPath } = req.file;
    console.log("tempPath: " + tempPath);

    try {
        const connection = await odbc.connect(connectionString);

        // Escapar barras invertidas en la ruta del archivo
        const escapedTempPath = tempPath.replace(/\\/g, '\\\\');
        
        // Construir la consulta SQL con plantillas literales
        const query = `UPDATE Documentos SET ${tipoDocumento} = '${escapedTempPath}' WHERE id_proyecto = ${id_proyecto}`;

        console.log("Query: " + query);

        // Usa placeholders para parámetros
        await connection.query(query);
        await connection.close();

        res.status(200).json({ message: 'Documento actualizado correctamente' });
    } catch (err) {
        console.error('Error al subir el documento:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Conseguir proyecto especifico
app.get('/find-project/:id_proyecto', async (req, res) => {
    const { id_proyecto } = req.params;
    console.log("Obtener un proyecto")
    try {
        const connection = await odbc.connect(connectionString);

        // Consulta para obtener detalles del proyecto
        const query = `
            SELECT p.id_proyecto, p.nombre, p.materia, d.Nombre AS director
            FROM Proyectos p
            INNER JOIN Usuarios AS d ON p.director = d.Boleta
            WHERE p.id_proyecto = ${id_proyecto};`;
        console.log("Querry 1" + query);
        const result = await connection.query(query);

        if (result.length > 0) {
            const projectId = result[0].id_proyecto;

            // Obtener asesores del proyecto
            const asesoresQuery = `
                SELECT a.Nombre
                FROM Proyectos_Asesores pa
                INNER JOIN Usuarios a ON pa.id_asesor = a.Boleta
                WHERE pa.id_proyecto = ${projectId}`;
            console.log("Querry 2 " + asesoresQuery);
            const asesoresResult = await connection.query(asesoresQuery);

            // Obtener alumnos del proyecto
            const alumnosQuery = `
                SELECT a.Nombre
                FROM Proyectos_Alumnos pa
                INNER JOIN Usuarios a ON pa.id_alumno = a.Boleta
                WHERE pa.id_proyecto = ${projectId}`;
            console.log("Querry 3 " + alumnosQuery);
            const alumnosResult = await connection.query(alumnosQuery);

            // Construir la respuesta con los datos obtenidos
            const project = {
                id_proyecto: result[0].id_proyecto,
                nombre: result[0].nombre,
                materia: result[0].materia,
                director: result[0].director,
                asesores: asesoresResult.map(asesor => asesor.Nombre),
                alumnos: alumnosResult.map(alumno => alumno.Nombre)
            };

            await connection.close();
            res.json(project);
        } else {
            await connection.close();
            res.status(404).send('Proyecto no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener el proyecto:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.post('/upload-status/:id_proyecto/:tipoDocumento', async (req, res) => {
    const { id_proyecto } = req.params;
    const { tipoDocumento } = req.params;

    try {
        const connection = await odbc.connect(connectionString);

        // Construir el nombre de la columna concatenando "Estado_" y tipoDocumento
        const columnName = `Estado_${tipoDocumento}`;

        // Construir la consulta SQL con plantillas literales
        const query = `UPDATE Documentos SET ${columnName} = 'Entregado' WHERE id_proyecto = ${id_proyecto}`;

        console.log("Query: " + query);

        // Ejecutar la consulta
        await connection.query(query);
        await connection.close();

        res.status(200).json({ message: 'Estado del documento actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el estado del documento2:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.post('/aceptar-rechazar/:id_proyecto/:tipoDocumento/:evaluar', async (req, res) => {
    const { id_proyecto } = req.params;
    const { tipoDocumento } = req.params;
    const { evaluar } = req.params;
    console.log("aceptar o rechazar")
    try {
        const connection = await odbc.connect(connectionString);

        // Construir el nombre de la columna concatenando "Estado_" y tipoDocumento
        const columnName = `Estado_${tipoDocumento}`;

        // Construir la consulta SQL con plantillas literales
        const query = `UPDATE Documentos SET ${columnName} = '${evaluar}' WHERE id_proyecto = ${id_proyecto}`;

        console.log("Query: " + query);

        // Ejecutar la consulta
        await connection.query(query);
        await connection.close();

        res.status(200).json({ message: 'Estado del documento actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el estado del documento2:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.post('/delete-document/:id_proyecto/:tipoDocumento', async (req, res) => {
    const { id_proyecto, tipoDocumento } = req.params;

    try {
        const connection = await odbc.connect(connectionString);

        // Construir el nombre de la columna concatenando "Estado_" y tipoDocumento
        const columnName = `${tipoDocumento}`;

        // Obtener la URL del documento para eliminar el archivo físico
        const queryGetUrl = `SELECT ${columnName} AS url FROM Documentos WHERE id_proyecto = ${id_proyecto}`;
        const result = await connection.query(queryGetUrl);

        if (result.length > 0 && result[0].url) {
            const filePath = result[0].url.replace('http://localhost:3001', ''); // Obtener la ruta local del archivo

            // Eliminar el archivo físico
            fs.unlinkSync(filePath);
        }

        // Construir la consulta SQL para actualizar la base de datos
        const queryUpdate = `UPDATE Documentos SET ${columnName} = NULL WHERE id_proyecto = ${id_proyecto}`;
        await connection.query(queryUpdate);

        await connection.close();

        res.status(200).json({ message: 'Documento eliminado' });
    } catch (err) {
        console.error('Error al eliminar el documento:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/download-document/:id_proyecto/:tipoDocumento', async (req, res) => {
    const { id_proyecto, tipoDocumento } = req.params;

    try {
        const connection = await odbc.connect(connectionString);
        const query = `SELECT ${tipoDocumento} AS url FROM Documentos WHERE id_proyecto = ${id_proyecto}`;
        const result = await connection.query(query);

        if (result.length > 0 && result[0].url) {
            const fileUrl = result[0].url.replace(/\\/g, '/');
            res.json({ url: `/uploads/${path.basename(fileUrl)}` });
        } else {
            res.status(404).send('Documento no encontrado');
        }

        await connection.close();
    } catch (err) {
        console.error('Error al obtener la URL del documento:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});


// Ruta para obtener el estado de un documento
app.get('/document-status/:id_proyecto', async (req, res) => {
    const { id_proyecto } = req.params;
  
    try {
        const connection = await odbc.connect(connectionString);
        const query = `SELECT * FROM Documentos WHERE id_proyecto = ${id_proyecto}`;
        console.log("Query: " + query);
        const data = await connection.query(query);
  
        console.log('Resultado de la consulta:', data); // Verificar el resultado de la consulta
  
        if (data.length > 0) {
            const result = data[0];
            console.log('Datos a enviar al cliente:', result); // Verificar los datos antes de enviarlos al cliente

            // Construir la respuesta con los datos obtenidos
            const respuesta = {
                id_proyecto: result.id_proyecto,
                Estado_Dictamendenoduplicidad: result.Estado_Dictamendenoduplicidad,
                Estado_Minutas: result.Estado_Minutas,
                Estado_Anteproyecto: result.Estado_Anteproyecto,
                Estado_Controldeversiones: result.Estado_Controldeversiones,
                Estado_Manualtecnico: result.Estado_Manualtecnico,
                Estado_Manualdemantenimiento: result.Estado_Manualdemantenimiento,
                Estado_Actadeaceptacion: result.Estado_Actadeaceptacion,
                Estado_Reportefinal: result.Estado_Reportefinal,
                Estado_Motivosdeseleccion: result.Estado_Motivosdeseleccion,
                Estado_Plandetallado: result.Estado_Plandetallado,
                Estado_SRSometodologiaagil: result.Estado_SRSometodologiaagil,
                Estado_Planderiesgo: result.Estado_Planderiesgo,
                Estado_Matrizdetrazabilidad: result.Estado_Matrizdetrazabilidad,
                Estado_Plandepruebas: result.Estado_Plandepruebas
            };

            console.log('Respuesta a enviar:', respuesta); // Verificar la respuesta final
            res.json(respuesta); // Devuelve la respuesta construida como JSON
        } else {
            res.status(404).json({ error: 'Proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener los estados de los documentos:', error);
        res.status(500).json({ error: 'Error al obtener los estados de los documentos' });
    }
});


//endPoint de actualizar calificaciones
app.post('/update-qualification/:id_proyecto/:tipoCalificacion/:Calificacion', async (req, res) => {
    const { id_proyecto } = req.params;
    const { tipoCalificacion } = req.params;
    const { Calificacion } = req.params;
    
    console.log("Calificar")
    try {
        const connection = await odbc.connect(connectionString);

        // Construir la consulta SQL con plantillas literales
        const query = `UPDATE Proyectos SET ${tipoCalificacion} = '${Calificacion}' WHERE id_proyecto = ${id_proyecto}`;

        console.log("Query: " + query);

        // Ejecutar la consulta
        await connection.query(query);
        await connection.close();

        res.status(200).json({ message: 'Calificacion guardada' });
    } catch (err) {
        console.error('Error al guardar la calificacion:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Define la ruta para obtener los datos del proyecto
app.get('/proyectos/:id_proyecto', async (req, res) => {
    const { id_proyecto } = req.params;

    try{
        const connection = await odbc.connect(connectionString);
        const query = `
        SELECT
            Asistencia,
            Calificaciondereportefinal,
            Calificaciondedefensaoral
        FROM
            Proyectos
        WHERE
            id_proyecto = ${id_proyecto}`;

        console.log("Query: " + query);
        const data = await connection.query(query);

        console.log('Resultado de la consulta:', data); // Agrega esto para ver el resultado de la consulta

        if (data.length > 0) {
            const result = data[0];
            console.log('Datos a enviar al cliente:', result); // Agrega esto para ver los datos antes de enviarlos al cliente

            // Construir la respuesta con los datos obtenidos
            const respuesta = {
                Asistencia: result.Asistencia,
                Calificaciondereportefinal: result.Calificaciondereportefinal,
                Calificaciondedefensaoral: result.Calificaciondedefensaoral
            };

            res.json(respuesta); // Devuelve la respuesta construida como JSON
        } else {
            res.status(404).json({ error: 'Proyecto no encontrado' });
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', err);
        res.status(500).send('Error al realizar la consulta');
    }
  });

  app.post('/create-delivery-date', async (req, res) => {
    const { documento, fechafinal } = req.body;

    try {
        const connection = await odbc.connect(connectionString);

        // Construir la consulta SQL con plantillas literales
        const query = `INSERT INTO Fecha_Entrega (Documento, Fechafinal) VALUES ('${documento}', '${fechafinal}')`;

        console.log("Query: " + query);

        // Ejecutar la consulta
        await connection.query(query);
        await connection.close();

        res.status(200).json({ message: 'fecha guardada' });
    } catch (err) {
        console.error('Error al guardar la fecha:', err.message);
        res.status(500).send('Error interno del servidor');
    }

});

app.post('/create-date-project', async (req, res) => {
    const {id_proyecto } = req.body;

    try {
        const connection = await odbc.connect(connectionString);

        const projectIdQuery = `SELECT TOP 1 id_fecha FROM Fecha_Entrega ORDER BY id_fecha DESC`;
        const projectIdResult = await connection.query(projectIdQuery);

        const projectId = projectIdResult[0].id_fecha;

        for (const id of id_proyecto) {
            const advisorQuery = `INSERT INTO Fecha_Proyectos (id_fecha, id_proyecto) VALUES (${projectId}, ${id})`;
            console.log("Query: " + advisorQuery);
            await connection.query(advisorQuery);
        }

        await connection.close();

        res.status(200).json({ message: 'fecha guardada' });
    } catch (err) {
        console.error('Error al guardar la fecha:', err.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/notifications/:id_proyecto', async (req, res) => {
    console.log("notificacion");
    try {
      const connection = await odbc.connect(connectionString);
      const id_proyecto = req.params.id_proyecto;
  
      // Consulta SQL para obtener las notificaciones
      const query = `
        SELECT TOP 3 fe.Fechafinal AS fecha, fe.Documento AS nombreDocumento
        FROM Fecha_Entrega fe
        INNER JOIN Fecha_Proyectos fp ON fe.id_fecha = fp.id_fecha
        WHERE fp.id_proyecto = ${id_proyecto}
        ORDER BY fe.Fechafinal DESC;
      `;
  
      console.log("Query: " + query);
  
      const result = await connection.query(query);
  
      const notifications = [...result];
      await connection.close();
  
      // Devolver respuesta con las notificaciones
      res.json(notifications);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
  });
  
  


app.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});
*/