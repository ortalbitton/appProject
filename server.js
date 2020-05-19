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
    --numClients;
    io.emit('numClients', {
      numClients: numClients
    });
    console.log('disconnect client');

  });

  socket.on('disconnect', () => {
    if (ConnectUser) {
      console.log(numClients + ' client is still connected');
    }
  });
});

const puppeteer = require('puppeteer');


let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  await page.goto('http://localhost:4200/', {
    waitUntil: 'domcontentloaded',
    timeout: 0
  });


  const result = await page.evaluate(() => {

    let title = document.querySelector('body > app-root > main > app-login > mat-card > h1').innerText;
    let content = document.querySelector('body > app-root > main > app-login > mat-card > mat-card-content:nth-child(5)').innerText;
    return {
      title,
      content
    }
  });

  await browser.close();
  return result;
};

scrape().then((value) => {
  const Login = require("../appProject/backend/models/login");
  const login = new Login({
    title: value.title,
    content: value.content
  });

  login.save(); // Success!


  console.log(login);
});
