const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');
const client = redis.createClient();
const bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');
const User = require('./views/user');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.set('view engine', 'ejs');


const polls = {};

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/poll/:id', function(req, res) {
  var poll = client.hgetall(req.params.id, function(err,dbset) {
    res.render('pages/poll',
        {poll: {title: dbset.title,
        response1: dbset.response1, response2:dbset.response2,
        response3: dbset.response3, endingTime: dbset.endingTime }
    });
  });
});

app.get('/admin/:id', function(req, res) {
  var poll = client.hgetall(req.params.id, function(err,dbset) {
    res.render('pages/admin',
        {poll: {title: dbset.title,
          response1: dbset.response1, response2:dbset.response2,
          response3: dbset.response3, endingTime: dbset.endingTime }
        });
  });
});

app.post('/new-poll', function (req, res) {
  var id = md5(req.body.title);
  client.hset(id, "title", req.body.title);
  client.hset(id, "response1", req.body.response1);
  client.hset(id, "response2", req.body.response2);
  client.hset(id, "response3", req.body.response3);
  client.hset(id, "endingTime", req.body.endingTime);
  res.send("Title: " + req.body.title + "<br><a href=" + "/poll/" + id + ">Vistor Url</a><br><a href=" + "/admin/" + id + ">Admin Url</a>");
});

io.on('connection', function (socket) {
  var id = socket.id;
  var user = new User(id);

  console.log(user);

  socket.on('message', function (channel,vote) {
    if (channel === 'vote') {
      //client.hset(id,"vote",vote);
      //client.hset(id,"user",user.id);
      console.log({vote: vote, user: user.id });
      //io.sockets.emit('polls', {vote: 1});
    }
  });

  socket.on('disconnect', function () {
    //socket.emit('user disconnected', id)
    //console.log('Someone has disconnected', id);
  });
});


http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});