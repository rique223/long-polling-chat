import http from 'http';
import url from 'url';
import fs from 'fs';

const messages = [];
const clients = [];

http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url);

    console.log(parsedUrl);

    if (parsedUrl.pathname === '/') {
        fs.readFile('./index.html', (_, data) => {
            response.end(data);
        });
        return;
    }

    if (parsedUrl.pathname.includes('/poll')) {
        const requestsCount = parsedUrl.pathname.replace('/poll/', '');

        console.log(requestsCount);

        if (messages.length > requestsCount) {
            response.end(JSON.stringify({
                messageCounter: messages.length,
                append: `${messages.slice(requestsCount).join('\n')}\n`,
            }));
        } else {
            clients.push(response);
        }
        return;
    }

    if (parsedUrl.pathname.includes('/msg')) {
        const newMessage = parsedUrl.pathname.replace('/msg/', '');

        messages.push(newMessage);

        while (clients.length > 0) {
            const client = clients.pop();

            client.end(JSON.stringify({
                messageCounter: messages.length,
                append: `${newMessage}\n`,
            }));
        }
        response.end();
    }

    console.log('Number of messages:', messages.length);
}).listen(8080, 'localhost');

console.log('Server running at http://localhost:8080/');
