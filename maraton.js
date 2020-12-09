db = db.getSiblingDB('maraton')

// JavaScript plano

nombres = ['Laura','Juan','Fernando','María','Carlos','Lucía','David'];

apellidos = ['Fernández','Etxevarría','Nadal','Novo','Sánchez','López','García'];

letrasDNI = ['A','B','C','D','P','X'];

participantesIn = [];

for (i = 1000000; i < 2000000; i++ ) {
    participantesIn.push({
        _id: i,
        nombre: nombres[Math.floor(Math.random() * nombres.length)],
        apellido1: apellidos[Math.floor(Math.random() * apellidos.length)],
        apellido2: apellidos[Math.floor(Math.random() * apellidos.length)],
        edad: Math.floor(Math.random() * 100),
        dni: Math.floor(Math.random() * 1e8) + letrasDNI[Math.floor(Math.random() * letrasDNI.length)]
    })
}

// Fin de JavaScript

db.participantes.insert(participantesIn)