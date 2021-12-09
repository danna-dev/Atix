const app = require('./config/app');
const server = require('./config/server');
const crypto = require('crypto');
const fs = require('fs');
const createCvsWritter = require('csv-writer').createArrayCsvWriter;
const csvParser = require('csv-parser');
const express = require('express');
const router = express.Router();
server.initServer();

const createHash = (prev_hash, message, nonce) =>{
    return crypto
    .createHash('sha256')
    .update(`${prev_hash},${message},${nonce}`, 'utf8')
    .digest('hex')
    .toString();
}

router.post('/file', (req, res) =>{
    const foo = createHash('0000000000000000000000000000000000000000000000000000000000000000','Hola Mundo',5);

    /*const cvsWritter = createCvsWritter({
        path:'public/file.csv',
        header:['Hash']
    })

    const records = [
        ['sdsdgsdg'],
        ['yiuiyui']
    ]

    cvsWritter.writeRecords(records).then(()=>console.log('done'))*/

    const results =[];
    fs.createReadStream('public/file.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () =>{
        console.log('results',results);
    })

    res.send('esto es un post');
});


app.use(router);