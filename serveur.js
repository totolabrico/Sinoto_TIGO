var myFile = [];
var fs = require("fs");
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const socket = require('socket.io');
const io = socket(server);
io.sockets.on('connection', newConnection);
app.use(express.static("public"));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + "/sinoto.html"));
});


function newConnection(socket) {

  console.log("new connection : " + socket.id);

  socket.on('cmd', cmdLine);
  socket.on('save', saveFile);
  socket.on('load', loadFile);


  function cmdLine(data) {
    socket.broadcast.emit('Servorcmd', data);
    console.log('broadcast',data);
  }

  function saveFile(name,data) {
    //console.log(data);
    myFile = data;
    fs.writeFile('sessions/'+name+'.txt', data, function(err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
  }


  function loadFile(name,type) {

    var content;
    var thename=name;
    if(type==true)thename="set_"+name;
    // First I want to read the file

    fs.readFile('sessions/'+thename+'.txt',"utf8", function read(err, data) {
//      if (err)  throw err;

      content = data;
      console.log("load is done");
      //console.log(content); // Put all of the code here (not the best solution)
      if(content!=null)socket.emit('getData', content,type);

    });

  }

}


server.listen(3000);
console.log("serveur running");
