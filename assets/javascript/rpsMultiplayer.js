
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBpA0990uBFSGg0nr0SFRVGhhmLjka097Y",
    authDomain: "rps-multiplayer-f1be7.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-f1be7.firebaseio.com",
    projectId: "rps-multiplayer-f1be7",
    storageBucket: "rps-multiplayer-f1be7.appspot.com",
    messagingSenderId: "1007061601250"
  };
  firebase.initializeApp(config);


// define variables
var database = firebase.database();

var p1score = 0;
var p2score = 0;

var count = 0;
var player1 = {
    name: '',
    turn: false,
    score: '',
    rock: false,
    paper: false,
    scissors: false,
    diss: ''
};
var player2 = {
    name: '',
    turn: false,
    score: '',
    rock: false,
    paper: false,
    scissors: false,
    diss: ''
};


$('#add-player').on('click', function() {
    event.preventDefault();

    if(count === 0) {
        var input = $('#name-input').val();     
        player1.name = input;

        database.ref().push({
            player1: player1,
        });

    } else if(count === 1 && count < 2) {
        var input = $('#name-input').val();     
        player2.name = input;

        database.ref().push({
            player2: player2,
        });
    }

});


database.ref().on('child_added', function(snapshot) {
    count++;
    console.log(count);

    console.log(snapshot.val());
    var snap = snapshot.val();

    var p1name = snap.player1.name;
    var p1score = snap.player1.score;

    $('#p1-name').text(p1name);
    $('#p1-score').text(p1score);

    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
});

database.ref().on('child_added', function(snapshot) {
    console.log(count);

    console.log(snapshot.val());
    var snap = snapshot.val();

    var p2name = snap.player2.name;
    var p2score = snap.player2.score;

    $('#p2-name').text(p2name);
    $('#p2-score').text(p2score);


    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
});

$('#add-player').on('click', function() {
    $('#hello').css({'display':'none'});
});