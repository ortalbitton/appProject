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
  var DisconnectUser = false;

  io.emit('numClients', {
    numClients: numClients
  });

  socket.on('login', (usarname) => {

    if (ConnectUser) return;

    ++numClients;
    ConnectUser = true;
    io.emit('numClients', {
      numClients: numClients
    });
    console.log(usarname + ' is connected')
    console.log('login client', numClients);
  });

  socket.on('update', (newnumClients) => {
    io.emit('numClients', {
      numClients: newnumClients
    });
    console.log('update client', newnumClients);
  });

  socket.on('logout', () => {
    if (!DisconnectUser) {
      --numClients;
      DisconnectUser = true;
      io.emit('numClients', {
        numClients: numClients
      });
    }
    console.log('logout client', numClients);
  });

  socket.on('disconnect', () => {
    if (ConnectUser && !DisconnectUser) {
      --numClients;
      io.emit('numClients', {
        numClients: numClients
      });
      console.log(numClients + ' client is still connected');
    }
  });
});
