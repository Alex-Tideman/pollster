const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const md5 = require('md5');
const _ = require('lodash');
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
  var dateTime = poll["endingDate"] + " " + poll["endingTime"];

  if(pollOver(dateTime,poll["userTimezone"])) {
    res.render('pages/pollOver', { id: req.params.id, poll: poll});
  }
  else {
  res.render('pages/poll', { id: req.params.id, poll: poll});
  }
});

app.get('/:adminId/:id', function(req, res) {
  res.render('pages/admin', { id: req.params.id, poll: polls[req.params.id] });
});

app.post('/new-poll', function (req, res) {
  var id = md5(req.body.title);
  var adminId = md5(req.body.response1);

  polls[id] = req.body;
  polls[id]["votes"] = {};
  polls[id]["admin-id"] = adminId;

  res.send("<div class='container'>Title: " + req.body.title + "<br><a href=" + "/poll/" + id + ">Vistor Url</a><br><a href=" + "/" + adminId + "/" + id + ">Admin Url</a></div>");
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
      else if (channel === 'endVote:' + message) {
        polls[message]['endingDate'] = "01/01/2015";
        io.sockets.emit('endVote:' + message);
      }
     else if (channel === 'viewResults:' + message) {
      var votes = polls[message]['votes'];
      socket.emit('voteCount:' + message, countVotes(votes));
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
    results += vote + ":" + count + "   ";
  });

  return results;
}

function pollOver (dateTime,offset) {

  var currentTime = new Date();
  var endingTime = new Date(dateTime);
  var offsetEndingTime = new Date(endingTime.setHours(endingTime.getHours() + (offset / 60)));

  if( currentTime.getTime() > endingTime.getTime()) {
    return true
  }
  else {
    return false
  }
}


module.exports = server;