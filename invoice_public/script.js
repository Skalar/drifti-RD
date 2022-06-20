// import Tesseract from 'tesseract.js';

class TesseractOCR{
    constructor(){
      this.worker = Tesseract.createWorker();
    }
    async load(){
      await this.worker.load();
      await this.worker.loadLanguage('nor');
      await this.worker.initialize('nor');
    }
    async readIMG(exampleImage) {

        let result = await this.worker.detect(exampleImage);
        // console.log(result.data);

        result = await this.worker.recognize(exampleImage);
        //   console.log(result.data);

        var text = result.data.text
        // var words = []
        // for (let i in result.data.words){
        //     words.append(result.data.words[i].text)
        // }
        // return this.regex(words.join("  "))
        // use result.data.words[0].boundingbox to find tables
        return this.regex(text)
    }
    async end(){
      await this.worker.terminate();
    }
    regex(text){
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
            datearray.push(date)
        }
        return {sum:values[0],dates:datearray}
    }
}