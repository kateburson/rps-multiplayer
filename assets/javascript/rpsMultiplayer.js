
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
var p1clicked = false;
var p2clicked = false;
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
    console.log(count);
    console.log(snapshot.val(), snapshot.key);

    if(count === 1) {
        player1key = snapshot.key;
        var p1name = player1.name;
        var p1score = player1.score;
    
        $('#p1-name').text(p1name);
        $('#p1-score').text('Score: ' + p1score);

    } else if(count === 2) {
    player2key = snapshot.key;
    var p2name = player2.name;
    var p2score = player2.score;

    $('#p2-name').text(p2name);
    $('#p2-score').text('Score: ' + p2score);
    }

    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);

});

function player1Go() {
    var radioValue = $('input[name="p1"]:checked').val(); 
    player1.choice = radioValue;
    console.log(player1.choice);
};

function player2Go() {
    var radioValue = $('input[name="p2"]:checked').val(); 
    player2.choice = radioValue;
    console.log(player2.choice);
    // player1.turn = true;
};

function winner() {
    if(player1.choice === 'rock' && player2.choice === 'paper') {
        player2.score++;
        
    } else if(player1.choice === 'paper' && player2.choice === 'rock') {
        player1.score++;
        database.ref().update({
            player1:player1.score
        })
    } else if(player1.choice === 'paper' && player2.choice === 'diss') {
        player2.score++;
        database.ref().update({
            player2:player2.score
        })
    } else if(player1.choice === 'diss' && player2.choice === 'paper') {
        player1.score++;
        database.ref().update({
            player1:player1.score
        })
    } else if(player1.choice === 'diss' && player2.choice === 'rock') {
        player2.score++;
        database.ref().update({
            player2:player2.score
        })
    } else if(player1.choice === 'rock' && player2.choice === 'diss') {
        player1.score++;
        database.ref().update({
            player1:player1.score
        })
    } else if(player1.choice === player2.choice) {
        player1.score = player1.score;
        player2score = player2.score;
    }
};
 
$('#p1go').on('click', function() {
    event.preventDefault();
    player1Go();
    p1clicked =  true;
    // player1.turn = false;
    // player2.turn = true;
});

$('#p2go').on('click', function() {
    event.preventDefault();
    player2Go();
    p2clicked = true;
    // player1.turn = true;
    // player2.turn = false;
});

if(p1clicked === true && p2clicked === true) {
    database.ref(player2key).update({
        player2: player2
    });

    database.ref(player1key).update({
        player1: player1
    });
};

database.ref().on('child_changed', function(snapshot) {
    console.log('data read');
    var snap = snapshot.val();

    $('#p1-choice').text(snap.player1.choice);
    $('#p1-score').text(snap.player1.score);
    $('#p2-choice').text(snap.player2.choice);
    $('#p2-score').text(snap.player2.score);


    
    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
});
    







