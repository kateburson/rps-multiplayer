
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

var started = false;
var count = 0;

var player1key = '';
var player2key = '';

var player1 = {
    name: '',
    turn: false,
    score: 0,
    choice: '',
    diss: ''
};
var player2 = {
    name: '',
    turn: false,
    score: 0,
    choice: '',
    diss: ''
};


$('#add-player').on('click', function() {
    event.preventDefault();
    started = true;
    player1.turn = true;

    if(started === true) {
        $('#hello').css({'display':'none'});
    }
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
    // console.log(count);
    console.log(snapshot.val(), snapshot.key);

    var snap = snapshot.val();
    if(count === 1) {
        player1key = snapshot.key;
        var p1name = snap.player1.name;
        var p1score = snap.player1.score;
    
        $('#p1-name').text(p1name);
        $('#p1-score').text(p1score);

    } else if(count === 2) {
    player2key = snapshot.key;
    var p2name = snap.player2.name;
    var p2score = snap.player2.score;

    $('#p2-name').text(p2name);
    $('#p2-score').text(p2score);
    }

    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);

});

function player1Go() {
    var radioValue = $('input[name="p1"]:checked').val(); 
    player1.choice = radioValue;
    console.log(player1.choice);

    database.ref(player1key).update({
        player1: player1
    });
};

function player2Go() {
    var radioValue = $('input[name="p2"]:checked').val(); 
    player2.choice = radioValue;
    console.log(player2.choice);

    database.ref(player2key).update({
        player2: player2
    });
    // player1.turn = true;
};


$('#p1go').on('click', function() {
    event.preventDefault();
    player1Go();
    // player1.turn = false;
    // player2.turn = true;
});

$('#p2go').on('click', function() {
    event.preventDefault();
    player2Go();
    // player1.turn = true;
    // player2.turn = false;
});

// if(player2.choice != '') {
database.ref().on('value', function(snapshot) {
    var snap = snapshot.val();
    console.log(snap);
    var p1choice = snap.player1.choice;
    var p2choice = snap.player2.choice;

    if(p1choice === 'rock' && p2choice === 'paper') {
        player2.score++;
        database.ref(player2key).update({
            player2: player2,
        });  
    } else if(p1choice === 'paper' && p2choice === 'rock') {
        player1.score++;
        database.ref(player1key).update({
            player1: player1,
        }); 
    } else if(p1choice === 'paper' && p2choice === 'diss') {
        player2.score++;
        database.ref(player2key).update({
            player2: player2,
        });  
    } else if(p1choice === 'diss' && p2choice === 'paper') {
        player1.score++;
        database.ref(player1key).update({
            player1: player1,
        }); 
    } else if(p1choice === 'diss' && p2choice === 'rock') {
        player2.score++;
        database.ref(player2key).update({
            player2: player2,
        });  
    } else if(p1choice === 'rock' && p2choice === 'diss') {
        player1.score++;
        database.ref(player1key).update({
            player1: player1,
        }); 
    } else if(p1choice === p2choice) {
        player1.score = player1.score;
        player2score = player2.score;
    }

    // var p1score = player1.score;
    // $('#p1-score').text(p1score);

    // var p2score = player2.score;
    // $('#p2-score').text(p2score);

    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
});
// }



