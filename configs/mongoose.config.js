const mongoose = require('mongoose')

mongoose
    //.connect(`mongodb://localhost/${process.env.DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
<<<<<<< HEAD
    .connect(process.env.DB_REMOTE, { useNewUrlParser: true, useUnifiedTopology: true })
=======
    .connect(process.env.DBREMOTE, { useNewUrlParser: true, useUnifiedTopology: true })
>>>>>>> 5806e762cd89ab87792d2131aa46c52ac6a0c139
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err))

module.exports = mongoose