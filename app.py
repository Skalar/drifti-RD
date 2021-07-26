import numpy as np
from PIL import Image
import flask
from flask import request
import urllib.request 
import tensorflow as tf

import os

app = flask.Flask(__name__)
app.config["DEBUG"] = True

classifications=['VASKEROM', 'KVITTERING', 'VARMTVANNSBEREDER', 'VARMEPUMPE', 'RØRARBEID',
    'KJØKKEN', 'DUSJ', 'SERVANT', 'VARMEKABLER', 'ARBEIDSPLASS', 'RØROPPLEGG', 'VA', 'SLUK',
    'BUNNLEDNING', 'UTE', 'RADIATOR', 'ARBEIDSTEGNINGER', 'DRENERING', 'BADEROM', 'TOALETT',
    'FORDELERSKAP', 'KONTOR', 'AVLØP', 'UTEKRAN', 'LAGER']

base_learning_rate = .0001
class model():
    def __init__(self):
        data_augmentation = tf.keras.Sequential([
            tf.keras.layers.experimental.preprocessing.RandomRotation(0.2),
        ])
        preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input
        pre_predict = tf.keras.layers.Dense(200)
        prediction_layer = tf.keras.layers.Dense(len(classifications))

        self.base_model = tf.keras.applications.MobileNetV2(input_shape=(224,224,3),
                                                        include_top=False, weights='imagenet')
        self.base_model.trainable = False

        global_average_layer = tf.keras.layers.GlobalAveragePooling2D()
        inputs = tf.keras.Input(shape=(224, 224, 3))
        x = data_augmentation(inputs)
        x = preprocess_input(x)
        x = self.base_model(x, training=False)
        x = global_average_layer(x)
        x = tf.keras.layers.Dropout(0.2)(x)
        x = pre_predict(x)
        outputs = prediction_layer(x)
        self.model = tf.keras.Model(inputs, outputs)

        self.model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=base_learning_rate),
                        loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
                        metrics=['accuracy'])   
    def load_checkpoint(self,loc):
        self.model.load_weights(loc)
    def predict(self,img):
        pred = self.model.predict(img)
        pred = tf.nn.sigmoid(pred)
        return pred
    def classify(self,pred):
        pred_map = [(classifications[i],float(pred[i])) for i in range(len(pred))]
        pred_map = sorted(pred_map,key=lambda s:s[1])
        pred_map.reverse()
        pred_map = pred_map[:5]
        return {p[0]:p[1] for p in pred_map}

m =model()
m.load_checkpoint("./checkpoints/point")
def conv(url):
    nm = "fls/"+url[-10:]+".png"
    urllib.request.urlretrieve(url,nm)
    img = Image.open(nm).convert('RGB')
    new_img = np.array(img.resize((224,224)))
    return new_img

@app.route('/', methods=['GET'])
def home():
    return "<h1>Image CLassification</h1><p>This site is an API for Classification of images for work done py PRONTO.</p>"

@app.route('/api/predict')
def pred_img():
    url = request.args.get("img")
    try:
        new_img = conv(url).reshape((1,224,224,3))
        pred = m.predict(new_img)
        clasif_dict = m.classify(pred[0])
        # return '<img src="'+url+'" height=500><p>'+str(clasif_dict)+'</p>'
        return clasif_dict
    except Exception as e:
        return "invalid parameters:"+str(url)+" EX:"+str(e)
    
@app.route('/api/predict',methods=["POST"])
def pred_imgs():
    form = request.get_json()
    try:
        st_time = time.time()
        img_list = form.get("imgs")
        img_arr = np.array([conv(i) for i in img_list])
        end_time = time.time()
        ret_dict = {}
        return {img_list[i]:m.classify(pred) for i,pred in enumerate(m.predict(img_arr))}
    except Exception as e:
        return "invalid parameters: {} EX:{}".format(form,e)
