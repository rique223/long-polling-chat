import http from 'http';
// import url from 'url';
import fs from 'fs';

// const messages = ['testing'];
// const clients = [];

http.createServer((request, response) => {
    fs.readFile('./index.html', (err, data) => {
        response.end(data);
    });
}).listen(8080, 'localhost');

console.log('Server running at http://localhost:8080/');
