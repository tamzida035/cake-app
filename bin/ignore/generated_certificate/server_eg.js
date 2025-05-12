// server.js
const app = require('express')();
const https = require('https');
const fs = require('fs');
const fss=fs.promises;

const options = {
    key: fs.readFileSync('./server_eg.key'), // replace it with your key path
    cert: fs.readFileSync('./server_eg.crt'), // replace it with your certificate path
}

/*https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello, HTTPS World!');
}).listen(443, () => {
  console.log('Server is running on port 443');
});*/
https.createServer(options, (req, res) => {
  fss.readFile(__dirname + "/speech_recog.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
  //res.writeHead(200);
  //res.end('Hello, HTTPS World!');
}).listen(443, () => {
  console.log('Server is running on port 443');
});