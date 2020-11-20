$('.flip').bind('click', function() {
    $('.card', this).toggleClass('flipped');
    $('#ding').get(0).play();
});

