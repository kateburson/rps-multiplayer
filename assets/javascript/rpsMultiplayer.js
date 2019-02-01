
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

$('#add-player').on('click', function() {
    event.preventDefault();

    if(count === 0) {
        var name = $('#name-input').val();
        var player1 = name;       
        
        database.ref().push({
            player1: player1,
        });


    } else if(count === 1 && count < 2) {
        var name = $('#name-input').val();
        var player2 = name;       
        
        database.ref().push({
            player2: player2,
        });

    }

});

database.ref().on('child_added', function(snapshot) {
    console.log(snapshot.val());
    count++;
    console.log(count);

    // var p1name = snapshot.val().player1[0];
    // var p1fact = snapshot.val().player1[1];
    // var p2name = snapshot.val().player2[0];
    // var p2fact = snapshot.val().player2[1];

    // $('#p1-name').text(p1name);
    // $('#p1-fact').text(p1fact);
    // $('#p2-name').text(p2name);
    // $('#p2-fact').text(p2fact);

    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
});



