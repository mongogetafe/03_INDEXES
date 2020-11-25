// Indices multikey con un campo que almacena tipo de dato array

// db.<coleccion>.createIndex({<campo-array>: 1 | -1})

Ejemplos

use shop

db.productos.insert({
    nombre: "Sudadera FTR34",
    marca: "Nike",
    stock: [
        {color: "azul", talla: "xs", cantidad: 2},
        {color: "azul", talla: "l", cantidad: 12}
    ],
    categorias: ["mujer","ropa"]
})

// Los índices multikey cuando son simples (es decir un solo campo) se pueden hacer varios índices sobre
// varios campos

db.productos.createIndex({stock: 1})

db.productos.createIndex({categorias: 1})

// Los índices multikey cuando son múltiples (es decir varios campos) solo uno de ellos puede ser sobre campos de tipo array

db.productos.createIndex({stock: 1, marca: -1})

db.productos.createIndex({stock: 1, categorias: -1}) // No estaría permitido
// {
//     "ok" : 0,
//     "errmsg" : "Index build failed: 2deb35ca-72d5-4a02-a08f-ec4b27fa7076: Collection shop.productos ( 869e6f3c-7b89-46b8-b720-f12f0921d9c5 ) :: caused by :: cannot index parallel arrays [categorias] [stock]",
//     "code" : 171,
//     "codeName" : "CannotIndexParallelArrays"
// }

// La limitación de un solo campo de tipo array en un índice multikey multiple hace que las operaciones de escritura
// se limiten para ese índice

db.productos.insert({
    nombre: "Gorra Sport",
    marca: ["Nike","Adidas"],
    stock: [
        {color: "negro", talla: "unica", cantidad: 5},
        {color: "azul", talla: "unica", cantidad: 12}
    ],
    categorias: ["hombre","ropa"]
})

WriteResult({
    "nInserted" : 0,
    "writeError" : {
            "code" : 171,
            "errmsg" : "cannot index parallel arrays [marca] [stock]"
    }
})