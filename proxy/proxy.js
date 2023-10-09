const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use(cors()); // Enable CORS for all routes

// Proxy middleware
app.use('/ymca', (req, res) => {
    const targetUrl = decodeURIComponent(req.originalUrl.replace('/ymca/', ''));
    const options = {
        host: 'api.proxiesapi.com',
        path: `/?auth_key=4af892af5bdcc2389aaec2fe31798af5_sr98766_ooPq87=${encodeURIComponent(targetUrl)}`,
        method: 'GET',
        headers: {
            'User-Agent': req.headers['user-agent'],
        },
    };

    console.log('Proxy Request Options:', options);

    const proxyReq = http.request(options, (proxyRes) => {
        res.statusCode = proxyRes.statusCode;
        res.setHeader('Content-Type', proxyRes.headers['content-type']);

        let responseData = '';

        proxyRes.on('data', (chunk) => {
            responseData += chunk;
            res.write(chunk);
        });

        proxyRes.on('end', () => {
            console.log('Proxy Response Data:', responseData);
            res.end();
        });
    });

    proxyReq.on('error', (error) => {
        console.error('Proxy Error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy Error');
    });

    proxyReq.end();
});

// Start the server
const port = 3002;
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
