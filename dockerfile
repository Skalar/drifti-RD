#syntax=docker/dockerfile:1
FROM python:3.8-slim-buster
WORKDIR /app
COPY require.txt .
RUN pip install -r require.txt
COPY . .
CMD [ "python3", "app.py"]
