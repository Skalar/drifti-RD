import numpy as np
from tensorflow.keras.preprocessing import image
from flask import request, send_file,Flask
import urllib.request 
import tensorflow as tf

import os

import create_model

app = Flask(__name__)

classifications=create_model.getClassificationList()

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
  try:
    nm = "fls/tst.png"
    urllib.request.urlretrieve(url,nm)
    # img = Image.open(nm).convert('RGB')
    # new_img = np.array(img.resize((224,224)))
    img = image.load_img(nm, target_size=(224, 224))
    new_img=image.img_to_array(img)
    return new_img
  except:
      raise Exception(url)
def conv_mult(*urls):
  return np.array([conv(u) for u in urls])

@app.route('/', methods=['GET'])
def home():
    return "<h1>Image CLassification</h1><p>This site is an API for Classification of images for work done py PRONTO.</p>"

@app.route('/api/predict')
def pred_img():
    try:
        url = request.args.get("img")
        new_img = conv(url).reshape((1,224,224,3))
    except Exception as e:
        return "invalid parameters:"+str(e),400
    try:
        pred = m.predict(new_img)
        clasif_dict = m.classify(pred[0])
        # return '<img src="'+url+'" height=500><p>'+str(clasif_dict)+'</p>'
        return clasif_dict,200
    except Exception as e:
        return str(e),500
    
@app.route('/api/predict',methods=["POST"])
def pred_imgs():
    try:
        form = request.get_json()
        img_list = form.get("imgs")
    except Exception as e:
        return "invalid parameters: {} EX:{}".format(request.get_data(),e),400
    try:
        img_arr = np.array([conv(i) for i in img_list])
    except Exception as e:
        return "url "+str(e),400
    try:
        return {img_list[i]:m.classify(pred) for i,pred in enumerate(m.predict(img_arr))}
    except Exception as e:
        return str(e),500

@app.route('/api/add',methods=["POST"])
def add():
    form = request.get_json()
    if not form:
        return "Empty JSON",400
    endmsg = ''
    towrite = []
    for f in form:
        url = f
        classes = form[f]
        for c in classes:
            if not c.upper() in classifications:
                endmsg+=" (new class : "+c+" added)"
        classes = " ".join(classes).upper()
        towrite.append((url,classes))
    with open('./model.csv', 'a') as f:
        for t in towrite:
            f.write("\n"+",".join(t))
    return "Success"+endmsg,200

@app.route('/api/csv')
def get():
    return send_file("./model.csv")

@app.route('/retrain')
def train():
    try:
        create_model.train()
        return "Success",200
    except Exception as e:
        return "error: {}".format(e),500

if __name__=='__main__':
    port = int(os.environ.get('PORT',5000))
    from waitress import serve
    serve(app,host='0.0.0.0',port = port)