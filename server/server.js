var connect = require('connect');

// Create a Connect app
var app = connect();

// Configure the app
app.use(connect.static(__dirname + '/../build')); // Static file hosting from the `./public` directory
app.use(connect.compress()); // Compress all responses using Gzip
app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`
app.use(connect.timeout(20000)); // Set maximum time to complete a request to 20 seconds (20000 ms)

// Add custom logic
// Send a hello message unless the "cruel" querystring is set
app.use(function (request, response, next) {
    if (request.query.cruel) return next();
    response.end('hello world\n');
});

// The next middleware function in the chain
app.use(function (request, response, next) {
    response.end('goodbye cruel world\n');
});

// Listen for HTTP/HTTPS conncections on port 3000
app.listen(9999);
