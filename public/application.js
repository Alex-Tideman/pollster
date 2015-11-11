var socket = io();

socket.on('polls:create', function (message) {
    console.log("working");
    //$('.polls').append('<br><div class="poll-url">Admin Url</div><div class="share-url">Share Url</div>');
});
