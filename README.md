# pronto-image-classifer

BUILD: docker build -t pronto-image-classifer . --platform linux/amd64

RUN: docker run --name tf1 --platform linux/amd64 --publish 5000:5000 --rm pronto-image-classifer

STOP: docker stop tf1

TEST: curl -G -d img=https://prod-5929f14.s3.eu-north-1.amazonaws.com/accounts/136/files/ck5du6wwc006c07qx9j596su9 localhost:5000/api/predict OR .../api/predict?img=https%3A%2F%2Fprod-5929f14.s3.eu-north-1.amazonaws.com%2Faccounts%2F136%2Ffiles%2Fck6izzznq01e008oybkak9k8j

TEST_MULTIPLE: curl -i -X POST -H "Content-Type: application/json" -d "{\\\"imgs\\\":[\\\"https://prod-c467854.s3.eu-north-1.amazonaws.com/accounts/128/files/3oXVxlCDCDjxnh9sPYA7g\\\",\\\"https://prod-5929f14.s3.eu-north-1.amazonaws.com/accounts/136/files/ck57u3urw001d07hd6lbe2ciz\\\"]}" localhost:5000/api/predict

multiple sends a post to the same api address, but with an array of img urls in a json object

--rm removes the container after it has been stopped

won't run on the plafrom linux/arm64, or the Apple M1 chip

This takes quite a while, a url is uploaded, the file is copied, opened, converted to RGB, then to a tensor. Afterwhich it passes through the model (this part is practially instintaneous)


Use the attached create_model.py to retrain the additional model - eventually this may become an endpoint. You can update the model.csv file with the new training data, and then you will be able to run 'python create_model.py' and then rebuild and rerun the docker image.
In order to run this script you must have python downloaded, and the dependencies installed. You can either see the attached require.txt or run 'python -m pip install --upgrade pip pandas numpy Pillow tensorflow'
Alternatively you can upload these files to Google Colab which will have all dependencies installed and run the script there