const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');
const client = redis.createClient();
const bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));

app.get('/', function (req, res) {
  path.join(__dirname, '/public/index.html')
});


app.post('/new-poll', function (req, res) {
  res.send("Poll:" + req.body.title + "<br>Admin Url:<a href=" + md5(req.body.title) + "<br>Visitor Url:" + md5(req.body.response1));
});


//const polls = {};
//
//io.on('connection', function (socket) {
//  const id = socket.id;
//
//  console.log('Someone connected', id);
//
//  socket.on('message', function (channel,poll) {
//    if (channel === 'poll') {
//      const key = md5(id);
//      polls[id] = poll;
//      io.sockets.emit('polls', {admin_url: id, user_url: key});
//      client.set(key, JSON.stringify(poll));
//    }
//  });
//
//  socket.on('disconnect', function () {
//    //socket.emit('user disconnected', id)
//    //console.log('Someone has disconnected', id);
//  });
//});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});