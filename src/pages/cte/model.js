import * as tf from '@tensorflow/tfjs';

import rootLocation from '../../assets/serverloc';

class CustomModel{
    constructor(){
        this.labels=[]
        
    }
    async load(){
        this.model = await tf.loadLayersModel(rootLocation+`/quote/quotemodel/model.json`);
        let labs = await fetch(rootLocation+`/quote/labels`, {
            method: "GET",
            credentials: "include",
            cache: "no-cache",
            headers: new Headers({
            "content-type": "application/json"
            })
        })
        labs = await labs.json()
        this.labels=labs
        return true
    }
    set_labels(lab){
        this.labels=lab
    }
    dict_to_row(dict){
        let n = this.labels.length
        let row = new Array(n); 
        for (let i=0; i<n; ++i) row[i] = 0;
        for (let i in dict){
            if (this.labels.indexOf(i)>=0 ){
                let ind = this.labels.indexOf(i)
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
            if (this.labels.indexOf(i)>=0 ){
                row.push(i)
            }
        }
        return row
    }
    is_active(article){
        if (this.labels.indexOf(article)>=0)return true
        else return false
    }
    getlables(){
        return this.labels
    }
    async classify(dict){
        dict = this.dict_to_row(dict)
       
        dict = tf.reshape(dict,[-1,this.labels.length])
        let pred = this.model.predict(dict)
        
        let predvalues = await pred.array()
        predvalues = predvalues[0]
        return predvalues
    }
    async reccomend(list){
        var formData= {'items':list}
        let response = await fetch(rootLocation+`/quote/api/recommend`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
        return response
    }  
}

var customTFModel = new CustomModel();
customTFModel.load()
export default customTFModel