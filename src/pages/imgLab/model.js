
import * as tf from '@tensorflow/tfjs';

import rootLocation from '../../assets/serverloc';

class CustomModel{
    constructor(){
        this.articles = {0: 'ARBEIDSPLASS', 1: 'UTEKRAN', 2: 'DRENERING', 3: 'RØROPPLEGG', 4: 'AV', 5: 'BUNNLEDNING', 6: 'RADIATOR', 7: 'UTE', 8: 'KJØKKEN', 9: 'VASKEROM', 10: 'VA', 11: 'TOALETT', 12: 'KONTOR', 13: 'BADEROM', 14: 'KVITTERING', 15: 'SLUK', 16: 'AVLØP', 17: 'VARMTVANNSBEREDER', 18: 'RØRARBEID', 19: 'DUSJ', 20: 'SERVANT', 21: 'LAGER', 22: 'VARMEKABLER', 23: 'FORDELERSKAP', 24: 'VARMEPUMPE', 25: 'ARBEIDSTEGNINGER'}
    }
    async load(){
        this.model = await tf.loadLayersModel(rootLocation+'/image/imagemodel/model.json');
        return true
    }
    dom_to_pixels(img_element){
        return tf.browser.fromPixels(img_element)
    }
    async classify(img_pixels,num=5){
        let img 
        // img = tf.browser.fromPixels(imgel)
        img = img_pixels
        if (img.shape[0]!== 224 || img.shape[1] !== 224){
            img= tf.image.resizeBilinear(img,[224,224],!0)
        }
        img = tf.reshape(img,[-1,224,224,3])
        let pred = this.model.predict(img)
        pred = tf.sigmoid(pred)
        let predvalues = await pred.array()
        predvalues = predvalues[0]
        let preddict = []
        for(let i=0;i<predvalues.length;i++)preddict.push({index:this.articles[i],value:predvalues[i]})
        if (num) preddict.sort(function(a,e){return e.value-a.value})
        let ret = {}
        for (let i=0;i<preddict.length;i++){
            ret[preddict[i].index] = preddict[i].value
            if(num && ret.length>=num) break
        }

        return ret
    }
    async update(X,y){
        //I'm not sure if this is my place to do it
        //optimally I would retrain from the database itself, not a separate csv file
        //so I shouldn't have to write a new update function
        return true
    }   
}

var customTFModel = new CustomModel();
customTFModel.load()
export default customTFModel;