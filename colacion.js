// Índices y colación

db.participantes.dropIndexes()

// La colación se puede establecer a nivel de índice

db.participantes.createIndex({nombre: 1}, {collation: {locale: "es", strength: 1}})

// Si pasamos la consulta sin especificar la colación no usará el índice

db.participantes.find({nombre: "maria"}) 

// Para que use la colación deberemos especificarla en la consulta (tiene que ser el mismo lenguaje de colacion)

db.participantes.find({nombre: "maria"}).collation({locale: "es", strength: 1}) // Si utilizará el índice
                                                // y además tendremos las funcionalidades especificadad
                                                // en este caso mayus/minus y diacriticos


db.participantes.find({nombre: "maria"}).collation({locale: "en", strength: 1}) // Si el lenguaje de la colación
                                                // es diferente tampoco utilizará el índice

// Cuando la colación se establece a nivel de colección se utilizarán los índices siempre
// que la consulta sea de la misma colación

db.createCollection("jueces", {collation: {locale: "es", strength: 1}})

db.jueces.insert({nombre: "Juan", apellidos: "López"})

db.jueces.createIndex({nombre: 1})

db.jueces.find({nombre: "juan"}) // Utilizaría el índice aunque no se especifique la colación

db.jueces.find({nombre: "juan"}).collation({locale: "en", strength: 1}) //  No utilizaría el índice porque la colación es diferente
