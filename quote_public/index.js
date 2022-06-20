
// import * as tf from '@tensorflow/tfjs';


class CustomModel{
    constructor(){
        fetch(`${window.location.href}labels`, {
            method: "GET",
            credentials: "include",
            cache: "no-cache",
            headers: new Headers({
            "content-type": "application/json"
            })
        })
        .then(function(response) {
            response.json().then(function(text){
                self.labels = text
            })})
    }
    async load(){
        this.model = await tf.loadLayersModel(`${window.location.href}/quotemodel/model.json`);
        return true
    }
    dict_to_row(dict){
        let n = self.labels.length
        let row = new Array(n); 
        for (let i=0; i<n; ++i) row[i] = 0;
        for (let i in dict){
            if (self.labels.indexOf(i)>=0 ){
                let ind = self.labels.indexOf(i)
                row[ind]+=dict[i]
                row[n-2]+=1
                row[n-1]+=dict[i]
            }
        }
        return row
    }
    find_active(dict){
        let row = []
        for (let i in dict){
            if (self.labels.indexOf(i)>=0 ){
                row.push(i)
            }
        }
        return row
    }
    getlables(){
        return self.labels
    }
    async classify(dict){
        let l
        dict = this.dict_to_row(dict)
       
        l,dict = tf.reshape(dict,[-1,self.labels.length])
        let pred = this.model.predict(dict)
        
        let predvalues = await pred.array()
        predvalues = predvalues[0]
        return predvalues
    }
    async reccomend(list){
        var formData= {'items':list}
        let response = await fetch(`${window.location.href}api/recommend`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
        return response
    }  
}

var customTFModel = new CustomModel();
customTFModel.load()
