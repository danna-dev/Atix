const app = require('./app');

class Server{
    constructor(){
        this.port = 3000;
    }

    initServer(){
        app.listen(this.port, () =>{
            console.log(`Express server listening in port ${this.port}`)
        });
    }
}

module.exports= new Server();