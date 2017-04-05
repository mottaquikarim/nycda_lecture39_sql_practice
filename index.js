const express = require('express');
const db = require('sqlite');

let app = express();
const port = 4001;

const DB_NAME = './database.sqlite';

// this is sqliteui stuff
const socket = require('./sqliteui/websocket');
app.use('/', express.static('./sqliteui/public', {
    'index': ['index.html']
}));
const SocketInst = socket(DB_NAME, app);
app = SocketInst.app;
// end sqliteui stuff

app.post('/user', (req, res, next) => {
    console.log('here');

    db.all('SELECT * FROM Users')
        .then(() => {
            return db.run("INSERT INTO USERS (name, email) values (?, ?)", ['Taq', "taq@gmail.com"])
        })
        .then((user) => {
            console.log(user);

            // *SUPER IMPORTANT* always broadcast to update the UI
            SocketInst.broadcast('LOAD_BUFFER');
            // END 

            res.header('Content-Type', 'aoplication/json');
            res.send({ user });
        })
        .catch((e) => {
            res.status(401);
        });
});

app.post('/employee', (req, res, next) => {
    console.log('here');

    db.all('SELECT * FROM Company')
        .then(() => {
            return db.run("INSERT INTO Company (name, age, address, salary) values (?, ?, ?, ?)", ['Taq', 26, 'adfasdf', 0.01])
        })
        .then((user) => {
            console.log(user);

            // *SUPER IMPORTANT* always broadcast to update the UI
            SocketInst.broadcast('LOAD_BUFFER');
            // END 

            res.header('Content-Type', 'aoplication/json');
            res.send({ user });
        })
        .catch((e) => {
            res.status(401);
        });
});

Promise.resolve()
    .then(() => db.open(DB_NAME, { Promise }))
    .then(() => db.migrate({ force: 'last' }))
    .then(() => app.listen(port))
    .then(() => {
        console.log(`Server started on port ${port}`)
     })
    .catch(err => console.error(err.stack))
