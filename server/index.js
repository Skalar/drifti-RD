const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

// const client = require('./postg')
const decode = require("./invoice_files/recognize");


// const cors = require('cors');

//PORT
const PORT = process.env.PORT || 8080;

const app = express();

//
// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200, // For legacy browser support,
//     credentials:true
// }

// app.use(cors(corsOptions))
//

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const publicPath = path.join(__dirname, '..', 'public');
// const port = process.env.PORT || 3000;
// app.use(express.static(publicPath));
// app.get('*', (req, res) => {
//    res.sendFile(path.join(publicPath, 'index.html'));
// });

//image
//

app.use("/image/",express.static("image_files"));

app.get("/image/api/csv",(req,res)=>{
    res.send("image_files/model.csv")
})
app.get("/image/api/random",(req,res)=>{
    fs.readFile("image_files/saveto.csv", "utf-8", function(err, data){
        if(err) {
            console.log(err);
        }
        var lines = data.split('\n');
        // choose one of the lines...
        var line = lines[Math.floor(Math.random()*lines.length)+1]

        // invoke the callback with our line
        res.send(line);
    })

})

app.get("/image/api/labels",(req,res)=>{
    try{
        client.get(res)
    }catch(err){
        console.log("ERROR Get")
        console.log(err)
        res.send(501)
    }
    // fs.readFile("image_files/model.csv", "utf8",function(err,data){
    //     if(err) throw err;
    //     data = data.split("\r\n")
    //     newdata = []
    //     for (let i in data) { 
    //         if (i==0) continue;
    //         classifications = data[i].split(",")[1].split(" "); 
    //         for (let j of classifications){
    //             newdata.push(j)
    //         }
    //     }
    
    //     unique = [...new Set(newdata)];
    //     res.send(unique.filter(function(ele){ 
    //         return ele != ''; 
    //     }))
    // })
    
})

app.get("/image/api/remove",(req,res)=>{
    try{
        let ret = client.delete(req.query.label.toUpperCase(),res)
    }catch(err){
        console.log("ERROR remove")
        console.log(err)
    }
    // console.log(req.query.label)
    // fs.readFile("image_files/model.csv", "utf8",function(err,data){
    //     if(err) throw err;
    //     data = data.replaceAll(req.query.label," ")
    //     fs.writeFile("image_files/model.csv", data, err => {
    //         if (err) {
    //           console.error(err);
    //         }
    //         res.send("removed")
    //     })
    // })
})

app.post("/image/api/add",(req,res)=>{
    for (let url in req.body){
        try{
            let ret = client.add(url,req.body[url],res)
            res.end()
        }catch(err){
            console.log(err)
            res.end()
        }
        // line = '\r\n'+url+','+req.body[url].join(' ')
        // fs.writeFile("image_files/model.csv", line, { flag: 'a' }, err => {
        //     console.log(err)
        // });
    }
    res.end()
})


//quote
//


app.use('/quote/',express.static("quote_files"));
app.put('/quote/api/recommend',(req,res)=>{
    let rawdata = fs.readFileSync('quote_files/expense_data.txt');
    let articlesIndex = fs.readFileSync('quote_files/un_expense.txt')
    let rows = JSON.parse(rawdata);
    let artIndex = JSON.parse(articlesIndex)
    var list = []
    var inc_list=req.body.items
    for (let jobID in rows){
        let items = Object.keys(rows[jobID]["job"])
        for (var i of inc_list) {
            if (items.indexOf(i)>=0) {
                list.push(...items)
                break;
            }
        }
        
    }
    var count={}
    for (const element of list) {
        if (count[element]) {
          count[element] += 1;
        } else {
          count[element] = 1;
        }
    }
    for (let el of inc_list){
        delete count[el]
    }
    var keys = Object.keys(count)
    keys.sort((b,a)=>{return count[a]-count[b]})
    if (keys.length>5){
        keys=keys.slice(0,5)
    }
    ret = {}
    for(let k in keys){
        if (keys[k] in artIndex){
            ret[keys[k]]=artIndex[keys[k]]
        }
        else{
            ret[keys[k]]="NA"
        }
    }
    res.send(ret)
})
app.get("/quote/labels",(req,res)=>{
    let rawdata = fs.readFileSync('quote_files/expense_data.txt');
    let rows = JSON.parse(rawdata);
    var list = []
    for (let jobID in rows){
        list.push(...Object.keys(rows[jobID]["job"]))
    }
    list = [...new Set(list)]
    list.sort()
    list.push("totalItems","sumItems")
    res.send(list)
})
app.get("/quote/api/data",(req,res)=>{
    console.log(req.query)
    p = req.query.p
    fs.readFile("quote_files/results.csv", "utf8",function(err,data){
        if(err) throw err;
        data = data.split("\r\n")
        newdata = []
        for (let i in data) { 
            if (i==0) continue;
            row = data[i].split(",")
            newdata.push({'real':row[1],'guess':row[2],'%miss':row[3]})
        }
        res.send(newdata)
    })
})

//
//invoice

app.use(fileUpload());
app.post("/invoice/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }
    // data = decode(req.files.pdfFile)
    // res.send(data)
    decode(req.files.pdfFile).then(data=>res.send(data))
    
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);