var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
var humanhash = new (require("humanhash"))();

var salt = "dfvd"

//app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
//});
app.use(express.static("public"));

io.on("connection", function(socket) {
  io.emit("chat message", humanhash.humanize(socket.request.connection.remoteAddress+salt)+'-'+socket.id.substring(0, 1)+' has joined')
  socket.on("chat message", function(msg) {
    if (msg != "") {
      var ip = socket.request.connection.remoteAddress;
      msg =
        "<" +
        humanhash.humanize(ip + salt) +
        "-" +
        socket.id.substring(0, 1) +
        "> " +
        msg;
      console.log(ip, msg);
      io.emit("chat message", msg);
    }
  });
});


http.listen(port, function() {
  console.log("listening on *:" + port);
});
