// Introducción a los índices en MongoDB

// Índices son a nivel de colección

// Crear índices createIndex()
// db.<coleccion>.createIndex({campo: 1 | -1, ....}, opciones)

db.clientes.createIndex({apellidos: 1}) // Índice simple

db.clientes.createIndex({apellidos: 1},{name: "Consultas por apellido"})

// Ver índices de una colección getIndexes()

db.clientes.getIndexes()

// Eliminar índice de una colección dropIndex(<nombre>,{campo: 1 | -1, ....})

db.clientes.dropIndex('apellidos_1')

// Eliminar todos los índices

db.clientes.dropIndexes() // Elimina todos excepto el de _id que no se puede eliminar