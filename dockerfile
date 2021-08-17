#syntax=docker/dockerfile:1
FROM tensorflow/tensorflow
WORKDIR /app
COPY require.txt .
RUN pip install -r require.txt
COPY . .
CMD [ "python3", "app.py"]
