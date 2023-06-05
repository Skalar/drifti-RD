const { Client } = require('pg')
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
client.connect()
async function add(url,classes,response){
    // callback
    var edit = 'INSERT INTO IMG_MODEL(IMG_URL, LABELS) VALUES'
    for (let a=0;a< classes.length;a++){
        if(a>0) edit+=','
        edit+= '($1,$'+(a+2).toString()+')'
    }
    try{
        const res = await client.query(edit,[url,...classes])
        return res
    }catch(err){
        console.log("ADD ERR",err)
        return err
    }
}

async function get(response){
    const text = "SELECT DISTINCT LABELS FROM IMG_MODEL;"
    var res
    try{
        res = await client.query(text)
        var labels = []
        for( r in res.rows){
            labels.push(res.rows[r].labels)
        }
        response.send(labels)
    }catch (err){
        res =err
        console.log("error",err)
    }
    return res
}
async function delete_row(label,response){

    const text = "DELETE FROM IMG_MODEL WHERE LABELS = $1;"
    try{
        const res = await client.query(text,[label])
        response.send("Deleted"+label)
    }catch (err){
        response.send("FAILED")
    }
}
function close(){
    client.end()
}

module.exports.add=add
module.exports.delete=delete_row
module.exports.get=get