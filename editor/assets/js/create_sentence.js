var numSentences = 1;

function createSentenceRow(parent) {
    $(parent).append("<div class='d-flex flex-wrap align-items-center justify-content-between mb-1'\
        id = 'sentence" + numSentences + "' >\
        <div draggable='true' ondragstart='drag(event)' ondrop='drop(event)' ondragover='allowDrop(event)' style='white-space: nowrap;'>\
            <i class='fas fa-bars mx-2'></i>\
            <input type='number' id='startMins' step='1' min='0' style='width:50px'\
            onchange=\"updateSentenceTime('#'+$(this).parent().parent().attr('id'))\">\
            :\
            <input type='number' id='startSecs' step='1' min='0' max='60' style='width:50px'\
            onchange=\"updateSentenceTime('#'+$(this).parent().parent().attr('id'))\">\
            <button title='Update start time from current video position'\
              onclick=\"fillTimeMinSec('#'+$(this).parent().parent().attr('id'))\" \
              class='border border-secondary mr-1'>\
              <i class='fas fa-history'></i>\
            </button>\
        </div>\
        <div class='mx-1 d-flex align-items-center'>\
            <input type='range' id='range' style='width:50px' class='mx-2' step='0.1' min='0' max='20' value='10'\
                oninput='$(this).next().val($(this).val())' onchange=\"playSentence('#sentence"+ numSentences + "')\">\
            <input type='number' id='length' value='10' step='0.1' min='0' style='width:50px' class='mx-1'\
                onchange='$(this).prev().val($(this).val())'> \
            <button title='Update length from current video position' \
                  onclick=\"fillLength('#'+$(this).parent().parent().attr('id'))\" \
                  class='border border-secondary mr-1'>\
                  <i class='fas fa-history'></i>\
            </button>\
        </div>\
            <button class='btn btn-primary btn-sm mx-2' onclick=\"playSentence('#sentence"+ numSentences + "')\">Play</button>\
            <div class='d-flex flex-column align-center flex-grow-1 mx-1'>\
                <input type='text' id='en' class='w-100 border-0' placeholder='English'>\
                <input type='text' id='ru' class='w-100 border-0' placeholder='2nd language'>\
            </div>\
            <i class='fas fa-trash-alt' onclick=\"deleteSentence(this)\"></i>\
        </div>\
    ");
}

function createSentence(parent) {
    createSentenceRow(parent);
    fillTimeMinSec("#sentence" + numSentences);
    numSentences++;
    $("#footer").show();
}

function createSentenceFromFire(parent, item) {
    createSentenceRow(parent);
    fillFire("#sentence" + numSentences, item);
    numSentences++;
    $("#footer").show();
}

function fillTimeMinSec(sentence) {
    $(sentence).data("currentTime", currentTime);
    $(sentence + " #startMins").val(mins);
    $(sentence + " #startSecs").val(secs);
}

function fillFire(sentence, item) {
    $(sentence).data("currentTime", item.start);
    mins=Math.floor(item.start/60);
    secs=item.start - mins * 60;
    $(sentence + " #startMins").val(mins);
    $(sentence + " #startSecs").val(secs);
    $(sentence + " #length").val(item.length).change();
    $(sentence + " #en").val(item.en);
    $(sentence + " #ru").val(item.ru);
}

function fillLength(sentence) {
    sentenceTime = $(sentence).data("currentTime");
    $(sentence + " #length").val(currentTime - sentenceTime).change();
    stopVideo();
}

function updateSentenceTime(sentence) {
    newTime = +$(sentence + " #startMins").val() * 60 + +$(sentence + " #startSecs").val();
    $(sentence).data("currentTime", newTime);
}