// Planes de consulta
// La forma en la que Mongo utiliza los índices

// Query optimizer

// Plan Cache
// - Vaciar manualmente
// - reinicia cuando se cae el servidor
// - Se va actualizando cuando se borra un índice o se crea uno nuevo

// Método explain() Nos devuelve de un doumento con los datos de uso de índices

// db.<coleccion>.find(<forma-consulta>).explain(<modo verbosidad>)
// Verbosidad
//    - queryPlanner por defecto Devuelve la información del plan ganador (de las etapas de índices que se efectuarán)
//    - executionStats Lo mismo del anterior pero ejecuta el plan ganador
//    - allPlansExecution Devuelve la información de todos los planes incluyendo los no ejecutados


// Uso de índices simples

db.participantes.find({dni: "12755572C"}).explain("allPlansExecution")  // Etapa collscan porque no hay ningun
                                                        // indice para esa forma de consulta

db.participantes.createIndex({dni: 1})

// Uso de varios índices simples

db.participantes.createIndex({apellido1: 1})

db.participantes.createIndex({edad: 1})

db.participantes.find({apellido1: "Etxevarría", edad: {$gte: 18}}).explain("allPlansExecution")

// Intersección de índices

db.participantes.find({
    $or: [
        {apellido1: "Etxevarría", edad: {$gte: 18}},
        {edad: 45}
    ]
}).explain("allPlansExecution")


// Índices compuestos

db.participantes.dropIndexes()

db.participantes.createIndex({edad: 1, apellido1: 1})

// Consulta con todos los campos del índice

db.participantes.find({apellido1: "Etxevarría", edad: {$gte: 18}}).explain("allPlansExecution")

// Solamente un campo

db.participantes.find({edad: {$gte: 50}}).explain("allPlansExecution")

db.participantes.find({apellido1: "Nadal"}).explain("allPlansExecution") // No utiliza el índice por el campo
// no es prefijo del índice

// Prefijo

// {edad: <expresion>}

// {edad: <expresion>, apellido1: <expresion>}

// {apellido1: <expresion>, edad: <expresion>, } Para el uso del índice no influye el orden
