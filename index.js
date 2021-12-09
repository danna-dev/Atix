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
            .on('data', (data) => results.push([data.Hash]))
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
    console.log("records",records);
    cvsWritter.writeRecords(records).then(()=>console.log('done'))
}

router.post('/file', async (req, res) =>{
    const data = await reader();
    console.log('data', data);
    const message = req.body.message;
    const nonce = 5;
    const prev_hash = data.length? createHash(data[data.length-1][0]):'0000000000000000000000000000000000000000000000000000000000000000';
    console.log("prev_hash",prev_hash);

    const strline = `${prev_hash},${message},${nonce}`;

    data.push([strline])

    writter(data)

    res.send('done')

});


app.use(router);