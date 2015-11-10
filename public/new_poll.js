$('#add-response').click( function () {
    $('.responses').append('<div class="response"><input type="text" placeholder="Poll Response"></div>');
});

$('#create-poll').click( function () {
    createPoll();
});

function createPoll () {
    var pollResponses = [];
    $('.responses').children().each(function () {
        pollResponses.push($(this).children('input[type=text]').val());
    });

    var poll = { title: $('.title input[type=text]').val(),
                 responses: pollResponses};

    socket.send('create poll', poll);
}