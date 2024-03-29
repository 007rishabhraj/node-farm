// using this module we can read and write file
const fs = require("fs");
// module for creating server
const http = require("http");
const path = require("path");
const url = require("url");

////////////////////////////////////////////
// FILES

// blocking code or synchronous way

/* const fs =require('fs');
const textIN= fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIN);

// writing in file 

const textOUT = `My name is: ${textIN}`;
fs.writeFileSync('./txt/output.txt',textOUT);
console.log("file written");   */

// asynchronous way or non-blocking way
/*
const fs = require('fs');

fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
    if(err) console.log("ERROR!");

    fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data1)=>{
        console.log(data1);
        fs.readFile('./txt/append.txt','utf-8',(err,data2)=>{
            console.log(data2);

            fs.writeFile('./txt/final.txt',`${data1}\n${data2}`,'utf-8',(err)=>{
                    console.log("file written succesfully");
            })
        })
    })
})
// as we can see that hii will be executed first because the code is running asynchronously after that the upper code will be executed 

// the upper section of code is running asynchronously but in that we are passing arrow function that is a method of function callback where the second function is depends upon the first one and we are doing it various times so it is making a callback hell 
console.log("hii");  */

////////////////////////////////////////
// CREATING SERVER

// fisrt creating a server , and we save it to variable server
/*
const server = http.createServer((request,response)=>{
    // console.log(request);
    response.end("Hello from the server");

})

// listening the request from ther server
// arguments are port, host and a callback function
server.listen(8000,'127.0.0.1',()=>{
    console.log("listening to the request on port 8000");
})       
*/

// ROUTING

// passing data sychronously because we don't want to pass data again and again when client request each time. So,

// main code starts here from lec 11

// making a replace function to replace all the placeholders
const replaceTemplate = (temp, product) => {
  // by putting it in /...../g then it will chnage template at global level

  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

// reading all template
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //   whenever u change the url req.url changes so that is our path and it has a lot of properties which we acess by using parse funct below
  //     console.log(req.url)
  //     console.log(url.parse(req.url));

  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    // replacing all the place holder using function that made above and storing it in array using map funct.
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
  }



  // Product page
  else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    // just replacing the prduct template to actual data via id
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  // when api call we pass the data sychronously here
  else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  }

  //NOT FOUND
  else {
    // we always have to define writehead before the response
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

// listening to server
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to the request on port 8000");
});


// lec 15