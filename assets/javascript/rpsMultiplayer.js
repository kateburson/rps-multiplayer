
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
// var p1clicked = false;
// var p2clicked = false;
var count = 0;

var player1key = '';
var player2key = '';

var player1 = {
    name: '',
    turn: false,
    score: 0,
    choice: '',
    diss: '',
    clicked: false
};
var player2 = {
    name: '',
    turn: false,
    score: 0,
    choice: '',
    diss: '',
    clicked: false
};

var playerKeys = [];

function initializeUser() {
    var name = $('#name-input').val();

    var entry = database.ref().push({
        'name': name,
        'score': 0,
        'choice': null
    })
    playerKeys.push(entry.key);
};

$('#add-player').on('click', function() {
    event.preventDefault();
    initializeUser();
});

// $('#add-player').on('click', function() {

//     event.preventDefault();
//     started = true;
//     player1.turn = true;

//     if(started === true) {
//         $('#hello').css({'display':'none'});
//     }
//     if(count === 0) {
//         var input = $('#name-input').val();     
//         player1.name = input;

//         database.ref().push({
//             player1: player1,
//         });
//     } else if(count === 1 && count < 2) {
//         var input = $('#name-input').val();     
//         player2.name = input;

//         database.ref().push({
//             player2: player2,
//         });
//     }
// });



// database.ref().on('child_added', function(snapshot) {
//     count++;
//     console.log(count);
//     console.log(snapshot.val(), snapshot.key);

//     if(count === 1) {
//         player1key = snapshot.key;
//         var p1name = snapshot.val().player1.name;
//         var p1score = snapshot.val().player1.score;
    
//         $('#p1-name').text(p1name);
//         $('#p1-score').text('Score: ' + p1score);

//     } else if(count === 2) {
//     player2key = snapshot.key;
//     var p2name = snapshot.val().player2.name;
//     var p2score = snapshot.val().player2.score;

//     $('#p2-name').text(p2name);
//     $('#p2-score').text('Score: ' + p2score);
//     }

//     }, function(errorObject) {
//     console.log('The read failed: ' + errorObject.code);

// });

function player1Go() {
    // console.log(database.ref(player1key))
    // if (player1.clicked === true) {
    //     return
    // }
    // var radioValue = $('input[name="p1"]:checked').val(); 
    // player1.choice = radioValue;
    // console.log(player1.choice);
    // player1.clicked =  true;

    // database.ref(player1key).update({
    //     player1: player1
    // });

    database.ref(player1key).update({
       choice: $('input[name="p1"]:checked').val(),
    });
};

function player2Go() {
    // if (player2.clicked === true) {
    //     return
    // }
    // var radioValue = $('input[name="p2"]:checked').val(); 
    // player2.choice = radioValue;
    // console.log(player2.choice);
    // player2.clicked = true;

    // database.ref(player2key).update({
    //     player2: player2
    // });

    database.ref(player2key).update({
        choice: $('input[name="p2"]:checked').val(),
    });
};

// function winner(playerLeft, playerRight) {
//     if(playerLeft.choice === 'rock' && playerRight.choice === 'paper') {
//         playerRight.score++;
//         database.ref().update({
//             player2:player2.score
//         })
//     } else if(playerLeft.choice === 'paper' && playerRight.choice === 'rock') {
//         playerLeft.score++;
//         database.ref().update({
//             player1:player1.score
//         })
//     } else if(playerLeft.choice === 'paper' && playerRight.choice === 'diss') {
//         playerRight.score++;
//         database.ref().update({
//             player2:player2.score
//         })
//     } else if(playerLeft.choice === 'diss' && playerRight.choice === 'paper') {
//         playerLeft.score++;
//         database.ref().update({
//             player1:player1.score
//         })
//     } else if(playerLeft.choice === 'diss' && playerRight.choice === 'rock') {
//         playerRight.score++;
//         database.ref().update({
//             player2:player2.score
//         })
//     } else if(playerLeft.choice === 'rock' && playerRight.choice === 'diss') {
//         playerLeft.score++;
//         database.ref().update({
//             player1:player1.score
//         })
//     } else if(playerLeft.choice === playerRight.choice) {
//         playerLeft.score = playerLeft.score;
//         playerRight.score = playerRight.score;
//     }
// };

function playGame(playerLeft, playerRight) {
    if(playerLeft.choice === 'rock' && playerRight.choice === 'paper') {
        return(playerRight);
    } else if(playerLeft.choice === 'paper' && playerRight.choice === 'rock') {
        return(playerLeft);
    } else if(playerLeft.choice === 'paper' && playerRight.choice === 'diss') {
        return(playerRight);
    } else if(playerLeft.choice === 'diss' && playerRight.choice === 'paper') {
        return(playerLeft);
    } else if(playerLeft.choice === 'diss' && playerRight.choice === 'rock') {
        return(playerRight);
    } else if(playerLeft.choice === 'rock' && playerRight.choice === 'diss') {
        return(playerLeft);
    } else if(playerLeft.choice === playerRight.choice) {
        return({});
    }
};
 
$('#p1go').on('click', function() {
    event.preventDefault();
    player1Go();
});

$('#p2go').on('click', function() {
    event.preventDefault();
    player2Go();
});

// database.ref().on('value', function(snapshot) {
//     console.log('data read');
//     var snap = snapshot.val();
//     var player1Db = snap[player1key].player1;
//     var player2Db = snap[player2key].player2;
//     if(player1Db.clicked === true && player2Db.clicked === true) {
//         winner(player1Db, player2Db);
//         $('#p1-choice').text(player1Db.choice);
//         $('#p1-score').text(player1Db.score);
//         $('#p2-choice').text(player2Db.choice);
//         $('#p2-score').text(player2Db.score);
//         player1.clicked = false;
//         player2.clicked = false;
//         player1Db.clicked = false;
//         player2Db.clicked = false;
//         database.ref().update({
//             player1:player1,
//             player2:player2
//         })
//     } 
//     },
//     function(errorObject) {
//         console.log('The read failed: ' + errorObject.code);
//     }
// );

database.ref().on('value', function(snapshot) {
    return
    var snap = snapshot.val();
    var player1Db = snap[player1key].player1;
    var player2Db = snap[player2key].player2;
    console.log(player1Db, player2Db);
    if(player1Db.choice != null && player2Db.choice != null) {
        var winner = playGame(player1Db, player2Db);
        // if(winner.name === )
    } 
});