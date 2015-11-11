var socket = io();

$('input[name=response]').click( function () {
    socket.send('vote',$(this).val());
});
