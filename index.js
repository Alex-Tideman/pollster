const http = require('http').Server(app);
const express = require('express');
const _ = require('lodash');
const app = express();
const io = require('socket.io')(http);
const redis = require('redis');
const client = redis.createClient();
const bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');

app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var votes = {};

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/poll/:id', function(req, res) {
  res.render('pages/poll');
  //var poll = client.hgetall(req.params.id, function(err,dbset) {
  //  res.render('pages/poll',
  //      {poll: {title: dbset.title,
  //      response1: dbset.response1, response2:dbset.response2,
  //      response3: dbset.response3, endingTime: dbset.endingTime }
  //  });
  //});
});

app.get('/admin/:id', function(req, res) {
  res.render('pages/admin')
  //var poll = client.hgetall(req.params.id, function(err,dbset) {
  //  res.render('pages/admin',
  //      {poll: {title: dbset.title,
  //        response1: dbset.response1, response2:dbset.response2,
  //        response3: dbset.response3, endingTime: dbset.endingTime }
  //      });
  //});
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
  console.log('A user has connected.', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  io.sockets.emit('usersConnected', io.engine.clientsCount);
  io.sockets.emit('voteCount', countVotes(votes));

  socket.on('message', function (channel,message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      io.sockets.emit('voteCount', countVotes(votes));
      socket.emit('voteMessage', message);
    }
  });

  socket.on('disconnect', function(){
    console.log('A user has disconnected.', io.engine.clientsCount);
    socket.emit('voteCount', countVotes(votes));
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});


http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});

function countVotes(votes) {
  var voteCount = {
  };

  for (vote in votes) {
    voteCount[votes[vote]]++
  }

  var results = "";

  _.forOwn(voteCount, function(count,vote) {
    results += vote + ":" + count + "  ";
  });

  return results;
}
