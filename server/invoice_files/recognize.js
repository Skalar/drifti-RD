const pdfParse = require("pdf-parse");
const Tesseract =require('tesseract.js')
// import Tesseract from 'tesseract.js';
// import pdfParse from "pdf-parse";

const ISO_STANDARD_DATE= 'YYYY-MM-DD' 

const MONTH_NAMES = {
    "NOR":['januar', 'februar', 'mars', 'april', 'mai', 'juni','juli','august','september','oktober','november','desember']
}

const DATE_FORMATS = {
    "NOR":['DD.MM.YYYY','D.M.YYYY','DD.MM.YY' ]
}
    

function convToRegex(str){
    str = str.replace(".","\.")
    str = str.replace("Month",'\w+')
    str = str.replace("Y",'\d').replace("DD",'\d{2}').replace("MM",'\d{2}')
    str = str.replace("M",'\d{1,2}').replace("D",'\d{1,2}')
    return '/'+str+'/g'
}
async function readIMG(file){
    
    let data = await Tesseract.recognize(
        file,
        'eng'
        // ,{ logger: m => console.log(m) }
    )
    return regex(data.data.text)
}
// const isValidDate = (dateString) => new Date(dateString).toString() !== 'Invalid Date'

function regex(text){
    let regex = /\d{1,3}( \d{3})*[,|.]\d{2}/g
    var matches = [...text.matchAll(regex)]
    var values = []
    for (let m in matches){
        values.push(matches[m][0])
    }
    values.sort(function(a,b){
        let _a = a.replace(",",'.').replace(" ","")
        let _b = b.replace(",",'.').replace(" ","")
        return parseFloat(_b)-parseFloat(_a)
    })
    var dateregex = /(\d{2}[\.\-/]){2}\d{4}/g
    var datematches = [...text.matchAll(dateregex)]
    var datearray = []
    for (let d in datematches){
        let date = datematches[d][0]
        let datesplit = date.split('.')
        //add better date matching
        //dd.mm.yy vs mm.dd.yy??
        if (datesplit[2]<"1980" || datesplit[2]> "2050" || datesplit[0]>31 ||datesplit[1]>31){
            continue
        }
        //Would love to use Date.js but the format doesn't match standard format on reciepts
        // if (!isValidDate(date)){
        //     continue
        // }
        datearray.push(date)
    }
    return {sum:values[0],dates:datearray}
}


module.exports = async function(file) {
    type = file.mimetype
    if (type == 'application/pdf'){
        result = await pdfParse(file)
        data= regex(result.text);
        return data
        
    }
    else if (type.includes("image")){
        // readIMG(file.data).then(data=>{return data})
        data = await readIMG(file.data)
        return data
    }
    else{
        return("Unknown Data Type")
    }
}