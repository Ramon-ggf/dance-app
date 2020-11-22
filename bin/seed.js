const mongoose = require('mongoose')
const Course = require('./../models/course.model')

const dbName = 'dance-app2020'

mongoose.connect(`mongodb://localhost/${dbName}`)

const courses = [
    {
        name: 'Clases baratas',
        style: 'Salsa casino',
        description: 'Las mejores clases para distraerte y desestresarte',
        date: '10/12/2020',
        location: { type: 'Point', coodinates: [0, 0] },
        active: true
    },
    {
        name: 'Clases a domicilio',
        style: 'Afrobeats',
        description: 'Mueve tu body',
        date: '18/11/2020',
        location: { type: 'Point', coodinates: [0, 0] },
        active: true
    },
    {
        name: 'Clases de tango',
        style: 'Tango',
        description: 'Siéntete un buen argentin@ bailando tango elegantón',
        date: '25/12/2020',
        location: { type: 'Point', coodinates: [0, 0] },
        active: true
    }
]

Course
    .create(courses)
    .then(response => {
        console.log('Se han creado', response.length)
        mongoose.connection.close()
    })
    .catch(err => console.log('Hubo un error', err))