const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');
const client = redis.createClient();

const path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/new_poll', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/new_poll.html'));
});

io.on('connection', function (socket) {
  console.log('Someone has connected.');

  socket.on('message', function (channel, message) {
    client.publish(channel, message);
  });


  socket.on('disconnect', function () {
    // Something here later.
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});