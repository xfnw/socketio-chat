var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
var humanhash = new (require("humanhash"))();

var salt = "dfvd"

var chathistory = [];

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});
app.use(express.static("public"));

io.on("connection", function(socket) {
  chathistory.forEach( function (msg) {
    socket.emit("chat message", msg);
  });
  io.emit("chat jpq", new Date().toISOString().slice(11,19) + " " + humanhash.humanize(socket.request.connection.remoteAddress+salt, words = 1)+'-'+socket.id.substring(0, 1)+' has joined')
  socket.on("disconnect", function(reason) {
    io.emit("chat jpq", new Date().toISOString().slice(11,19) + " " + humanhash.humanize(socket.request.connection.remoteAddress+salt, words = 1)+'-'+socket.id.substring(0, 1)+' has left')
  });
  socket.on("chat message", function(msg) {
    if (msg != "") {
      var ip = socket.request.connection.remoteAddress;
      msg =
        new Date().toISOString().slice(11,19) +
        " <" +
        humanhash.humanize(ip + salt, words = 1) +
        "-" +
        socket.id.substring(0, 1) +
        "> " +
        msg;
      console.log(ip, msg);
      chathistory.push(msg);
      if (chathistory.length > 100) {
        chathistory.shift();
      }
      io.emit("chat message", msg);
    }
  });
});


http.listen(port, function() {
  console.log("listening on *:" + port);
});
