var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8080;

var appServer = {
  port: 5200,
  host: "172.31.11.27",
  path: "/Publication/Presentation/SE.Publication.Presentation.svc?wsdl"  ,
  method: "POST"

};

function proxyToAppServer(request, response) {
  console.log("routing request to app server " + appServer.host);
  response.writeHead(200, {"Content-Type": "text/xml"});
  function onAppResponse(appResponse) {
    
    appResponse.on('data', function(chunk) {
      response.write(chunk);
    });

    appResponse.on('end', function(chunk) {
      response.end();
    });
  }
  
  
  
  var appRequest = http.request({
        port:appServer.port,
        host:appServer.host,
        path:appServer.path,
        method:appServer.method,
        headers:request.headers
      },onAppResponse
  );


   
  request.on('data', function(chunk) {
    
    appRequest.write(chunk);
  });

  request.on('end', function() {
    appRequest.end();  
  });
    
    
}

function serveStaticFile(request, response) {
  var uri = url.parse(request.url).pathname
  
  var hashIdx = uri.indexOf("#");
  if ( hashIdx != -1 )  {
    uri = uri.substring(0,hashIdx);
  }



  var filename = path.join(process.cwd(), uri);

  


  var contentTypesByExtension = {
    '.html': "text/html",
    '.xml': "text/xml",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      console.log("NOT FOUND:"+filename);
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) 
      filename = path.join(filename,'index.html');

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        console.log(err);
        return;
      }
      //console.log(filename);
      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      console.log(contentType);
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });
}


http.createServer(function(request, response) {
  console.log(request.method+": "+request.url);
  if (request.method == "POST")
    proxyToAppServer(request, response);
  else
    serveStaticFile(request, response);
  
}).listen(parseInt(port, 10),"0.0.0.0");

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
