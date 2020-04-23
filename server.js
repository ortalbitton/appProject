const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);


// Loading socket.io
var io = require('socket.io').listen(server);

var numClients = 0;

io.on('connection', function (socket) {

  var ConnectUser = false;

  socket.on('login', () => {
    if (ConnectUser) return;

    ++numClients;
    ConnectUser = true;
    socket.emit('numClients', {
      numClients: numClients
    });
    console.log('connect client', numClients);
  });

  socket.on('update', (newnumClients) => {
    console.log('update client', newnumClients);
  });

  socket.on('disconnect', function () {
    if (ConnectUser) {
      numClients--;
      socket.emit('numClients', {
        numClients: numClients
      });

      console.log('disconnected client', numClients);
    }
  });
});
