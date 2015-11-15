var socket = io();


var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
    connectionCount.innerText = 'Connected Users: ' + count;
});

var endingTime = document.querySelector('#ending-time');
var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function (message) {
    statusMessage.innerText = message;
});

var buttons = document.querySelectorAll('#choices button');
var pollId = document.getElementById('poll-id');

for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            socket.send('voteCast:' + pollId.innerHTML, [this.innerText, pollId.innerHTML]);
            socket.send('voteMessage', this.innerText);
        });
}

var results = document.querySelector('#vote-results');

socket.on('voteCount:' + pollId.innerHTML, function (voteCount) {
    results.innerText = voteCount;
});

var voteMessage = document.querySelector('#vote-message');

socket.on('voteMessage', function (message) {
    voteMessage.innerText = "You voted: " + message;
});


var ctx = $("#myChart").get(0).getContext("2d");
// This will get the first returned node in the jQuery collection.

var data = {
    labels: ["Response 1", "Response 2", "Response 3", "Response 4"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

var myBarChart = new Chart(ctx).Bar(data, options);

