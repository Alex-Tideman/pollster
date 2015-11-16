var socket = io();
var pollId = document.getElementById('poll-id');
var viewResults = document.getElementById('view-results');
var endingTime = document.querySelector('#ending-time');
var statusMessage = document.getElementById('status-message');
var results = document.querySelector('#vote-results');

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
    connectionCount.innerText = 'Connected Users: ' + count;
});


socket.on('statusMessage', function (message) {
    statusMessage.innerText = message;
});

viewResults.addEventListener('click', function () {
    socket.send('viewResults:' + pollId.innerHTML, pollId.innerHTML);
});

socket.on('voteCount:' + pollId.innerHTML, function (voteCount) {
    results.innerText = voteCount;
});
