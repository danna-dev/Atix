const  express = require('express');

class App{
    constructor(){
        this.app = express();
        this.config();
    }

    config(){
        this.app.use(express.json())
    }
}
module.exports = new App().app;