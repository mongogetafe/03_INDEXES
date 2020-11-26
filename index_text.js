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

// Funcionalidades de los índices de texto

use biblioteca

db.titulos.insert([
    {titulo: "París era una Fiesta", autor: "Ernest Hemingway"},
    {titulo: "París, La Guía Completa", autor: "vv.aa."},
    {titulo: "La Ciudad y los Perros", autor: "Mario Vargas Llosa"}
])

// Índice simple de texto

db.titulos.createIndex({titulo: "text"})

// Búsqueda de una palabra

db.titulos.find({$text: {$search: "paRis"}}) // Ni distinguen mayúsculas ni minúsculas ni diacríticos

db.titulos.find({$text: {$search: "Pa"}}) // No encuentra fragmentos

db.titulos.find({$text: {$search: /Pa/}})  // Devuelve error porque solo permite el tipo string
Error: error: {
    "ok" : 0,
    "errmsg" : "\"$search\" had the wrong type. Expected string, found regex",
    "code" : 14,
    "codeName" : "TypeMismatch"
}

// Búsqueda de varias palabras

db.titulos.find({$text: {$search: "Paris era"}}) // Escanea la existencia de las palabras sueltas
// { "_id" : ObjectId("5fbfc67b8528850c4ae3005b"), "titulo" : "París era una Fiesta", "autor" : "Ernest Hemingway" }
// { "_id" : ObjectId("5fbfc8af8528850c4ae3005e"), "titulo" : "Silicon Valley, la Era de las comunicaciones", "autor" : "John Doe" }
// { "_id" : ObjectId("5fbfc67b8528850c4ae3005c"), "titulo" : "París, La Guía Completa", "autor" : "vv.aa." }

// Búsqueda de frase

db.titulos.find({$text: {$search: "\"Paris era\""}})

// { "_id" : ObjectId("5fbfc67b8528850c4ae3005b"), "titulo" : "París era una Fiesta", "autor" : "Ernest Hemingway" }

// Excluir términos en las búsquedas

db.titulos.find({$text: {$search: "Paris -guia"}}) // Elimina de las coincidencias las que contengan "guia"
// { "_id" : ObjectId("5fbfc67b8528850c4ae3005b"), "titulo" : "París era una Fiesta", "autor" : "Ernest Hemingway" }

// Varias palabras en el mismo texto

db.titulos.find({$text: {$search:"\"paris\" \"fiesta\""}}) // AND

// Stop words (para evitar buscar artículos, etc...)

db.titulos.insert({titulo: "The Second World War", autor: "John Doe"})

db.titulos.find({$text: {$search:"the"}}) // Por defecto no busca las palabras articulos, conjunciones... en inglés

db.titulos.find({$text: {$search:"la"}})

db.titulos.find({$text: {$search:"la", $language: "es"}}) // Ya devuelve vacío

// Stemmed words (busca las coincidencias de una raiz de palabra)

db.titulos.insert([
    {titulo: "Agile Consultants", autor: "John Doe"},
    {titulo: "Consulting for Global Markets", autor: "John Doe"}
])

db.titulos.find({$text: {$search: "consult"}})

db.titulos.insert([
    {titulo: "Economía de Guerra", autor: "Fulano"},
    {titulo: "Economice su Hogar", autor: "Fulano"}
])

db.titulos.find({$text: {$search: "Econom", $language: "es"}})  // "Casca" en castellano

// Sensible a mayúsculas/minúsculas

db.titulos.find({$text: {$search: "paris", $caseSensitive: true}})

// Sensible a diacríticos

db.titulos.find({$text: {$search: "Economia", $diacriticSensitive: true}})

// Text Score (utiliza el operador $meta)

db.titulos.insert([
    {titulo: "París", autor: "vv.aa."},
    {titulo: "París siempre será París", autor: "vv.aa."}
])

db.titulos.find({$text: {$search: "París"}}, {score: {$meta: "textScore"}})

db.titulos.find({$text: {$search: "París"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// Just for fun

db.titulos.insert([
    {titulo: "Madrid Madrid", autor: "vv.aa."},
    {titulo: "Mádrid", autor: "vv.aa."},
    {titulo: "Madrid Getafe", autor: "vv.aa."},
])

db.titulos.find({$text: {$search: "Madrid"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})

// Índice para colecciones con múltiples lenguajes

db.books.insert([
    { 
        title: "El Quijote", 
        language: "spanish",
        translation: [
            {language: "english", titleTr: "The Quijote"},
            {language: "portuguese", titleTr: "O Quixote"}
        ]
    }
])

db.books.createIndex({title: "text", "translation.titleTr": "text"}, {default_language: "spanish"})

db.books.find({$text: {$search: "el"}})
db.books.find({$text: {$search: "the"}})
db.books.find({$text: {$search: "o"}})

db.books.find({$text: {$search: "quixote"}})

// Control de resultados para índices compuestos de texto con pesos en diferentes campos

// Sin pesos en los campos

db.titulos.insert([
    {titulo: "El Coronel no tiene quien le escriba", categorias: ["amor","novela","ficcion",]},
    {titulo: "El amor en los tiempos del cólera", categorias: ["drama","ficcion","novela",]},
])

db.titulos.createIndex({titulo: "text", categorias: "text"})

db.titulos.find({$text:{$search: "amor"}},{score:{$meta: "textScore"}}).sort({score:{$meta: "textScore"}})

// Con pesos en los campos

db.titulos.createIndex({titulo: "text", categorias: "text"},{weights: {titulo: 10, categorias: 1}})