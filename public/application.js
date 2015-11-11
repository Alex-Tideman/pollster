var socket = io();

socket.on('polls:create', function (channel,message) {
    console.log(channel,message);
    //$('.polls').append('<br><div class="poll-url">Admin Url</div><div class="share-url">Share Url</div>');
});
