var sentenceDatabase = {};

function showHideCreateButton() {
    if (!locked) {
        $("#btn-create").show();
        $("#btn-create").html("Create sentence at " + mins + ":" + secs);
    }
    else {
        $("#btn-create").hide();
        $("#save").hide();
    }
}

function playSegment(start, length) {
    startSec = start;
    stopTimer = length * 1000;
    timerDone = false;
    restartVideo(true);
}

function playSentence(sentence) {
    startMins = $(sentence + " #startMins").val();
    startSecs = $(sentence + " #startSecs").val();
    startTime = +startMins * 60 + +startSecs;

    length = $(sentence + " #length").val();
    playSegment(startTime, length);
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function writeFire() {
    // Add a new document in collection "cities"
    db.collection("ru").doc(fireBaseDocumentId).set(sentenceDatabase)
        .then(function () {
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            $("#savedate").text("Successfully saved at " + time).fadeOut().fadeIn();
        })
        .catch(function (error) {
            alert("Error writing document: ", error);
        });
}

function readFire() {
    var docRef = db.collection("ru").doc(fireBaseDocumentId);
    docRef.get().then(function (fireDoc) {
        if (fireDoc.exists) {
            console.log("Document data:", fireDoc.data());

            data = fireDoc.data();
            $("#doc").val(data.fileName);
            numSentences = 1;
            locked=data.locked || false;
            characterCounter=0;
            data.scenes.forEach(function (item, index) {
                createSentenceFromFire('#sentences', item);
                characterCounter+=item.en.replace(' ','').replace('_','').length;
            });
            showHideCreateButton();
            $('#charCounter').text(characterCounter);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            showHideCreateButton();
        }
    }).catch(function (error) {
        $("#btn-create").hide();
        $("#no-video").show().text("No internet connection");
    });
}

function readFireSaveFile() {
    var docRef = db.collection("ru").doc(fireBaseDocumentId);
    docRef.get().then(function (docFire) {
        if (docFire.exists) {
            console.log("Document data:", docFire.data());
            download(JSON.stringify(docFire.data()), docFire.data().fileName + '.json', 'text/plain');
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function stopVideo() {
    editorPlayer.stopVideo();
}

function getVideoCurrentTime() {
    t = Math.round(editorPlayer.getCurrentTime()); //this is in milliseconds, however, the player does not accept millisec, only whole sec
    if (t != 0) { //this can be a false zero after pausing the video. So I keep the number before the pause happened
        currentTime = t;
        mins = Math.floor(currentTime / 60);
        secs = currentTime - mins * 60;
    }
}

function restartVideo(play) {
    if (playerReady) {
        editorPlayer.stopVideo();
        editorPlayer.destroy();
        playerReady = false;
        newEditorPlayer();
        playVideo = play;
        videoStarted = play;
    }
}

function saveChangesFireBase() {
    freshDatabase = {};
    freshDatabase.videoID = editorVideoId;
    freshDatabase.fileName = $("#doc").val();
    freshDatabase.locked=locked;
    if ($("#sentences").children().length == 0) return; //no sentences to save
    freshDatabase.start = $("#sentences").children().first().data("currentTime");
    freshDatabase.end = +$("#sentences").children().last().data("currentTime") + +$("#sentences").children().last().find("#length").first().val();
    freshDatabase.scenes = [];
    $("#sentences").children().each(function () {
        var scene = {
            start: $(this).data("currentTime"),
            length: $("#length", this).val(),
            en: $("#en", this).val(),
            ru: $("#ru", this).val(),
        };
        freshDatabase.scenes.push(scene);
    });

    if (JSON.stringify(freshDatabase) != JSON.stringify(sentenceDatabase)) {
        sentenceDatabase = freshDatabase;
        //console.log(JSON.stringify(freshDatabase));
        writeFire();
    }
    sentenceDatabase = freshDatabase;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.parentNode.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    parent=$(ev.target).parents("div[id^='sentence']").first();
    console.log(parent);
    console.log("Drag: "+$("#"+data).attr('id'));
    console.log("Drop. "+$(parent).attr('id'));
    $(parent).before($("#"+data));
}

function deleteSentence(target) {
    parent=$(target).parents("div[id^='sentence']").first().remove();
}