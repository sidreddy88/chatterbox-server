
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

var url = require('url');

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function (request, callback){
  var data = "";
  request.on('data', function (chunk) {
    data += chunk;
  });
  request.on('end', function () {
    callback(JSON.parse(data));
   });
};

var objectId = 1;

var messages = [

{
  text:"Hello World",
  username:"Sid",
  objectId: objectId

}

];

var actions = {
"GET": function (request, response) {
  sendResponse(response, {results: messages});
},
"POST": function(request, response) {
  collectData (request, function (message) {
    messages.push(message);
    message.objectId = ++objectId;
    sendResponse(response, {objectId:1}, 201);
  });
},
"OPTIONS": function(request, response) {
  sendResponse(response, null);
}
}

var requestHandler = function(request, response) {

  var parsedUrl = url.parse(request.url);
  var pathName = parsedUrl.pathname;
  var statusCode = 200;
  console.log("Serving request type " + request.method + " for url " + request.url);

  var action = actions[request.method];
  if (action) {
    action(request, response)
  } else {
    sendResponse(response, "Not Found",404);
  }

};


module.exports = requestHandler;


