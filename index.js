const http = require('http');
const express = require('express');
const _ = require('lodash');
const app = express();
//const redis = require('redis');
//const client = redis.createClient();
const bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');

const port = process.env.PORT || 3000;

const server = http.createServer(app)
    .listen(port, function(){
      console.log('Listening on port ' + port + '.');
    });

const socketIo = require('socket.io');
const io = socketIo(server);
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var polls = {};

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/poll/:id', function(req, res) {
  var poll = polls[req.params.id];
  if(pollOver(poll["endingTime"])) {
    res.render('pages/pollOver', { id: req.params.id, poll: poll});
  }
  else {
  res.render('pages/poll', { id: req.params.id, poll: poll});
  }


  //var poll = client.hgetall(req.params.id, function(err,dbset) {
  //  res.render('pages/poll',
  //      {poll: {title: dbset.title,
  //      response1: dbset.response1, response2:dbset.response2,
  //      response3: dbset.response3, endingTime: dbset.endingTime }
  //  });
  //});
});

app.get('/admin/:id', function(req, res) {
  res.render('pages/admin', { id: req.params.id, poll: polls[req.params.id] });
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
  polls[id] = req.body;
  polls[id]["votes"] = {};
  var date = polls[id]["endingTime"];
  console.log(Date.parse(date));
  res.send("Title: " + req.body.title + "<br><a href=" + "/poll/" + id + ">Vistor Url</a><br><a href=" + "/admin/" + id + ">Admin Url</a>");
  //client.hset(id, "title", req.body.title);
  //client.hset(id, "response1", req.body.response1);
  //client.hset(id, "response2", req.body.response2);
  //client.hset(id, "response3", req.body.response3);
  //client.hset(id, "endingTime", req.body.endingTime);
});

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel,message) {
      if (channel === 'voteCast:' + message[1]) {
        var votes = polls[message[1]]['votes'];
        votes[socket.id] = message[0];
        io.sockets.emit('voteCount:' + message[1], countVotes(votes));
        socket.emit('voteMessage', message[0]);
      }
  });

  socket.on('disconnect', function(channel,message){
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});


function countVotes(votes) {
  var voteCount = {
  };

  for (vote in votes) {
    voteCount[votes[vote]] = 0;
  }

  for (vote in votes) {
    voteCount[votes[vote]]++
  }

  var results = "";

  _.forOwn(voteCount, function(count,vote) {
    results += vote + ":" + count + "  ";
  });

  return results;
}

function pollOver (time) {
  var currentTime = new Date();
  var endingTime = new Date();

  if(time.includes('am')){
    var splitTime = time.slice(0, -2).split(":");
    var hour = parseInt(splitTime[0]);
    var minute = parseInt(splitTime[1]);
    endingTime.setHours(hour,minute);

    if(currentTime.getTime() > endingTime.getTime()) {
      return true
    }
    else {
      return false
    }
  }
  else {
    var splitTime = time.slice(0, -2).split(":");
    var hour = parseInt(splitTime[0]);
    var minute = parseInt(splitTime[1]);
    endingTime.setHours(12 + hour,minute);

    if (currentTime.getTime() > endingTime.getTime()) {
      return true
    }
    else {
      return false
    }
  }
}

module.exports = server;