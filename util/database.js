const mongoose = require('mongoose');


function initDataBase() {
    mongoose.connect('mongodb://0.0.0.0:27017/' + process.env.DATABASE_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("\x1b[33m%s\x1b[0m",`server connected to the ${process.env.DATABASE_URL} database`)
    });
}


module.exports = {
    initDataBase
}