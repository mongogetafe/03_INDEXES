// Índices de texto

// Creación
// db.<coleccion>.createIndex({<campo>: "text"})

db.libros.createIndex({autor: "text"})

// Uso del índice $search y $text

db.libros.find({$text: {$search: "Ende"}}) // No se especifica el campo porque
                                           // no podemos tener más de un índice de texto en la misma colección 

// Límite solo podemos tener un índice de texto por colección
// pero podemos tener índices de texto múltiples

db.libros.createIndex({titulo: "text"}) // Error si intento crear otro

db.libros.dropIndexes() // Los eliminamos

// Si podemos tener un índice texto con todos los campos en los que queramos utilizar estas funcionalidades

db.libros.createIndex({autor:"text", titulo: "text"})

// Las consultas buscarán los términos en todos los campos del índice

db.libros.find({$text: {$search: "Ende"}})

db.libros.insert({titulo: "Biografía de Michael Ende", autor: "John Doe"})

// Wildcard Text index

db.libros.createIndex({"$**": "text"}) // Crea índice de texto sobre todos los campos incluso los  nuevos campos que se
                                    // creen en registros posteriores a la creación del índice

// Se pueden hacer sobre campos de subdocumentos

db.clientes.createIndex({"direccion.$**": text})

// direccion.calle direccion.cp direccion.localidad direccion.provincia   amplias el modelo direccion.diasEntrega