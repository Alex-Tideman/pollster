
$('#add-response').click( function () {
    $('.responses').append('<div class="response"><input type="text" placeholder="Poll Response"></div>');
});

$('#create-poll').click( function () {
    createPoll();
    window.location.replace("/");
});

function createPoll () {
    var pollResponses = [];
    $('.responses').children().each(function () {
        pollResponses.push({ text: $(this).children('input[type=text]').val(),
                             count: 0 });
    });

    var poll = { title: $('.title input[type=text]').val(),
                 responses: pollResponses};

    socket.send('polls:create', JSON.stringify(poll));
}