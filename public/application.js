var socket = io();

socket.on('connect', function () {
    console.log('You have connected!');
});

socket.on('message', function (message) {
    $('.messages').append(`[${message.username}]: ${message.text} <br>`);
});


$('.send-message').click( function () {
    socket.send('message', {
        username: $('.username input[type=text]').val(),
        text: $('.message input[type=text]').val()
    });
});

