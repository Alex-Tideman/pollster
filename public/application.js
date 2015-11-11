$('#add-response').click( function () {
    $('.responses').append('<div class="response"><input type="text" placeholder="Poll Response"></div>');
});

//function createPoll () {
//    var pollResponses = [];
//    $('.responses').children().each(function () {
//        pollResponses.push({ text: $(this).children('input[type=text]').val(),
//            count: 0 });
//    });
//
//    var poll = { title: $('.title input[type=text]').val(),
//        responses: pollResponses,
//        ending_time: $('.ending-time input[type=text]').val()
//    };
//
//    socket.send('poll', poll);
//}