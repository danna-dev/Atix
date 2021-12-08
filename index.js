const app = require('./config/app');
const server = require('./config/server');

server.initServer();

app.use('/', (req, res) =>{
    res.send('hola');
})