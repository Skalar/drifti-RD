const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const decode = require("./invoice_files/recognize");

//PORT
const PORT = 8080

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));
app.get('/',(req,res)=>{
    res.send("/public/index.html")
})


//image
//

app.use("/image/",express.static("image_public"));
app.get('/image/',(req,res)=>{
    res.send("/image_public/index.html")
})
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
    fs.readFile("image_files/model.csv", "utf8",function(err,data){
        if(err) throw err;
        data = data.split("\r\n")
        newdata = []
        for (let i in data) { 
            if (i==0) continue;
            classifications = data[i].split(",")[1].split(" "); 
            for (let j of classifications){
                newdata.push(j)
            }
        }
    
        unique = [...new Set(newdata)];
        res.send(unique.filter(function(ele){ 
            return ele != ''; 
        }))
    })
    
})

app.get("/image/api/remove",(req,res)=>{
    console.log(req.query.label)
    fs.readFile("image_files/model.csv", "utf8",function(err,data){
        if(err) throw err;
        data = data.replaceAll(req.query.label," ")
        fs.writeFile("image_files/model.csv", data, err => {
            if (err) {
              console.error(err);
            }
            res.send("removed")
        })
    })
})

app.post("/image/api/add",(req,res)=>{
    for (let url in req.body){
        line = '\r\n'+url+','+req.body[url].join(' ')
        fs.writeFile("image_files/model.csv", line, { flag: 'a' }, err => {
            console.log(err)
        });
    }
    res.end()
})


//quote
app.use('/quote/',express.static("quote_public"));
app.get('/quote/',(req,res)=>{
    res.send('/quote_public/index.html')
})
app.put('/quote/api/recommend',(req,res)=>{
    let rawdata = fs.readFileSync('quote_files/expense_data.txt');
    let rows = JSON.parse(rawdata);
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
    if (keys.length<5){
        res.send(keys)
    }
    else{
        res.send(keys.slice(0,5))
    }
})
app.get("/quote/labels",(req,res)=>{
    let rawdata = fs.readFileSync('quote_files/expense_data.txt');
    let rows = JSON.parse(rawdata);
    var list = []
    for (let jobID in rows){
        // console.log(jobID)
        // console.log(rows[jobID]['job'])
        list.push(...Object.keys(rows[jobID]["job"]))
    }
    list = [...new Set(list)]
    list.sort()
    list.push("totalItems","sumItems")
    res.send(list)
})

//invoice
app.use(fileUpload());
app.use('/invoice/',express.static("invoice_public"));
app.get('/invoice/',(req,res)=>{
    res.send('/invoice_public/index.html')
})
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