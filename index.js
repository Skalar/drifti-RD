const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));

app.get('/',(req,res)=>{
    res.send("/public/index.html")
})
app.get("/api/csv",(req,res)=>{
    res.send("files/model.csv")
})
app.get("/api/random",(req,res)=>{
    fs.readFile("files/saveto.csv", "utf-8", function(err, data){
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

app.get("/api/labels",(req,res)=>{
    fs.readFile("files/model.csv", "utf8",function(err,data){
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

app.get("/api/remove",(req,res)=>{
    console.log(req.query.label)
    fs.readFile("files/model.csv", "utf8",function(err,data){
        if(err) throw err;
        data = data.replaceAll(req.query.label," ")
        fs.writeFile("files/model.csv", data, err => {
            if (err) {
              console.error(err);
            }
            res.send("removed")
        })
    })
})

app.post("/api/add",(req,res)=>{
    for (let url in req.body){
        line = '\r\n'+url+','+req.body[url].join(' ')
        fs.writeFile("files/model.csv", line, { flag: 'a' }, err => {
            console.log(err)
        });
    }
    res.end()
})
app.listen(8080, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ 8080)
    else 
        console.log("Error occurred, server can't start", error);
    }
);