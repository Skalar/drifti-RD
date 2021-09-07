from tensorflow.keras.preprocessing import image
import pandas as pd
import numpy as np
import tensorflow as tf
import urllib.request 

##Create a folder entitiled fls and checkpoints
##add the file entitled model.csv containing column "Location", and "Category"


# transfer model only works with size 224x224, so no use uploading them larger
img_size = 224
base_learning_rate = 0.0001
#headers should be ['Location', 'Category']

#Grab categories - They should be separated by spaces in the column Category
def getClassificationList():
  ttrain = pd.read_csv("./model.csv")
  headers = list(ttrain.select_dtypes(include='object'))
  pre=ttrain[headers]
  pre.Category.unique()
  s=[]
  for i in pre.Category.unique():
    if i !=i:
      continue
    s.extend(i.split(" "))
  l=list(set(s))
  #sometimes there is an empty character in the list
  try:
      l.remove("")
  except:
      pass
  #print the list to copy to the correct file
  return l

def create_model(train = False):
  l = getClassificationList()
  data_augmentation = tf.keras.Sequential([
    tf.keras.layers.experimental.preprocessing.RandomRotation(0.2),
  ])
  preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input
  pre_predict = tf.keras.layers.Dense(200)
  prediction_layer = tf.keras.layers.Dense(len(l))


  base_model = tf.keras.applications.MobileNetV2(input_shape=(img_size,img_size,3),
                                                include_top=False,
                                                weights='imagenet')
  base_model.trainable = False

  global_average_layer = tf.keras.layers.GlobalAveragePooling2D()


  inputs = tf.keras.Input(shape=(img_size, img_size, 3))
  x = data_augmentation(inputs)
  x = preprocess_input(x)
  x = base_model(x, training=False)
  x = global_average_layer(x)
  x = tf.keras.layers.Dropout(0.2)(x)
  x = pre_predict(x)
  outputs = prediction_layer(x)
  model = tf.keras.Model(inputs, outputs)
  if train:
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=base_learning_rate),
                loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
                metrics=['accuracy'])
  return model,base_model


def conv(url):
  nm = "fls/tst.png"
  urllib.request.urlretrieve(url,nm)
  # img = Image.open(nm).convert('RGB')
  # new_img = np.array(img.resize((224,224)))
  img = image.load_img(nm, target_size=(224, 224))
  new_img=image.img_to_array(img)
  return new_img

def train():
  l = getClassificationList()
  ttrain = pd.read_csv("./model.csv")
  headers = list(ttrain.select_dtypes(include='object'))
  pre=ttrain[headers]

  train_class_img_x=[]
  train_class_img_y=[]
  for i,im in enumerate(pre['Location']):
    try:
      sp=pre['Category'][i]
      cats=[0 for i in range(len(l))]
      new_img = conv(im)
      if new_img.shape != (img_size,img_size,3):
        # we can't handle images with 4 dimensions
        continue
      if sp==sp and sp != "":
        for c in sp.split(" "):
          try:
            ind = l.index(c)
            cats[ind]=1
          except:
            continue
      if len(train_class_img_x)==0:
        train_class_img_x = np.array([new_img])
      else:
        train_class_img_x = np.append(train_class_img_x,[new_img],axis=0)
      train_class_img_y.append(cats) 
    except:
      pass
  
  train_dataset = tf.data.Dataset.from_tensor_slices((train_class_img_x, train_class_img_y))
  #you are welcome to change the batch size, make sure it doesn't overwhelm the GPU
  train_dataset =train_dataset.batch(10).shuffle(20)

  ## !! this should copy the create_model function found in app.py exactly !!

  model,base_model = create_model(train=True)
  try:
    model.load_weights("./checkpoints/point")
  except:
    pass
  #I found that it took about 15 epoch to train the base, and then 15 to train the full
  #feel free to change these numbers
  num_base_epoch = 20
  num_all_epoch = num_base_epoch+15

  history = model.fit(train_dataset, epochs=num_base_epoch,verbose=0)
  base_model.trainable = True
  fine_tune_at = 100

  # Freeze all the layers before the `fine_tune_at` layer
  for layer in base_model.layers[:fine_tune_at]:
    layer.trainable =  False
  model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
                optimizer = tf.keras.optimizers.RMSprop(learning_rate=base_learning_rate/10),
                metrics=['accuracy'])
  model.fit(train_dataset, epochs=num_all_epoch,
                initial_epoch=history.epoch[-1],
                verbose=0)

  model.save_weights('./checkpoints/point')