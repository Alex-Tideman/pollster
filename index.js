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
app.use(express.static('views'));
app.set('view engine', 'ejs');


const polls = {};

app.get('/', function (req, res) {
  res.render('pages/index');
  //res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/poll/:id', function(req, res) {
  res.render('pages/poll', {
    poll: polls[req.params.id]
  });
});

app.get('/admin/:id', function(req, res) {
  res.render('pages/admin', {
    poll: polls[req.params.id]
  });
});

app.post('/new-poll', function (req, res) {
  var id = md5(req.body.title);
  polls[id] = req.body;
  res.send("Title: " + req.body.title + "<br><a href=" + "/poll/" + id + ">Vistor Url</a><br><a href=" + "/admin/" + id + ">Admin Url</a>");
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