# pronto-image-classifer

LaunchPoint for all Drifti R&D projects. 

Can either be run with node, or with docker

node.js:
- dependencies must be installed, afterwich the application will launch on defaulted port 8080, this can be changed at the top of the index.js file
- npm install
- node index.js

docker
- BUILD: docker build -t driftiRD . --platform linux/amd64
- RUN: docker run --publish 8080:8080 --rm driftiRD