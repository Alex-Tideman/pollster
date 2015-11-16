var socket = io();

var choices = document.getElementById('choices');
var buttons = document.querySelectorAll('#choices button');
var pollId = document.getElementById('poll-id');
var endingTime = document.querySelector('#ending-time');
var statusMessage = document.getElementById('status-message');
var results = document.querySelector('#vote-results');

socket.on('connect', function () {
    $("#vote-results").append("Vote to see poll results!")
});

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
    connectionCount.innerText = 'Connected Users: ' + count;
});


socket.on('statusMessage', function (message) {
    statusMessage.innerText = message;
});


for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            socket.send('voteCast:' + pollId.innerHTML, [this.innerText, pollId.innerHTML]);
            socket.send('voteMessage', this.innerText);
        });
}

socket.on('voteCount:' + pollId.innerHTML, function (voteCount) {
    results.innerText = voteCount;
});

socket.on('endVote:' + pollId.innerHTML, function () {
    choices.innerText = "Poll ended";
});

var voteMessage = document.querySelector('#vote-message');

socket.on('voteMessage', function (message) {
    voteMessage.innerText = "You voted: " + message;
});
