
////////////////////////////////////
// FILE SYSTEMS
///////////////////////////////////
// const fs = require('fs');

// Blocking, synchronous way
// reading text from the file system
// const textIn = fs.readFileSync('input.txt', 'utf-8')
// console.log(textIn)

// writing text to the file system
// const textOut = `This is what we know abou the Lord:\n ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync('output.txt', textOut);
// console.log("Thanks, your file has been written");


// asynchronous, non-blocking
// fs.readFile('start.txt', 'utf-8', (err, data) => {
//     console.log(data);
// })


const http = require('http')
const url = require('url')
const fs = require('fs')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName), {lower: true});

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);
    if(pathname ==="/" || pathname === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
    }else if(pathname === "/product"){
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const product = dataObj[query.id]; 
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    }else if(pathname == "/api"){
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    }else{
        res.writeHead(404, {
            'Content-type' : "text/html"
        });
        res.end("Page not found");
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Server started, listening to request on port 8000')
},);
 