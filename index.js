const app = require('./config/app');
const server = require('./config/server');
const crypto = require('crypto');
const fs = require('fs');
const createCvsWritter = require('csv-writer').createArrayCsvWriter;
const csvParser = require('csv-parser');
const express = require('express');
const router = express.Router();
server.initServer();

const createHash = (str) =>{
    return crypto
    .createHash('sha256')
    .update(str, 'utf8')
    .digest('hex')
    .toString();
}

const reader = () =>{
    const path = 'public/file.csv';
    return new Promise((resolve) =>{
        const results =[];
        if(fs.existsSync(path)){
            fs.createReadStream(path)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () =>resolve(results))
        }else{
            resolve(results)
        }

    });
}

const writter  =  (records) =>{
    const cvsWritter = createCvsWritter({
        path:'public/file.csv',
        header:['Hash']
    })

    cvsWritter.writeRecords([records]).then(()=>console.log('done'))
}

router.post('/file', async (req, res) =>{
    const data = await reader();
    const prev_hash = data.length?data[data.length-1]:'0000000000000000000000000000000000000000000000000000000000000000';
    const message = req.body.message;
    const nonce = 5;
    const strline = `${prev_hash},${message},${nonce}`;

    console.log('data',data);

    const newHash = createHash(strline);
    data.push(strline)

    writter(data)

    res.send('done')

});


app.use(router);