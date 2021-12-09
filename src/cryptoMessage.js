const crypto = require('crypto');
const fs = require('fs');
const createCvsWritter = require('csv-writer').createArrayCsvWriter;
const csvParser = require('csv-parser');

const saveMessage = async (req, res) =>{
    const data = await reader();
    const prev_hash = data.length? createHash(data[data.length-1][0]):'0000000000000000000000000000000000000000000000000000000000000000';
    const message = req.body.message;
    let nonce = 0;
    let isValid = false;
    let strline;

    while (!isValid) {
        strline = `${prev_hash},${message},${nonce}`;
        const newHash = createHash(strline);

        if(newHash.substring(0,2) == '00'){
            isValid = true;
        }
        nonce ++
    }

    data.push([strline])

    writter(data)

    res.send('done')

}

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
    cvsWritter.writeRecords(records).then(()=>console.log('done'))
}

module.exports = saveMessage