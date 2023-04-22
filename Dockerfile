FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ssrf-demo-app.js ./
COPY entrypoint.sh ./
RUN npm install http express needle command-line-args
EXPOSE 8000
ENTRYPOINT ["/bin/sh", "-c", "/usr/src/app/entrypoint.sh"]