// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBpA0990uBFSGg0nr0SFRVGhhmLjka097Y',
  authDomain: 'rps-multiplayer-f1be7.firebaseapp.com',
  databaseURL: 'https://rps-multiplayer-f1be7.firebaseio.com',
  projectId: 'rps-multiplayer-f1be7',
  storageBucket: 'rps-multiplayer-f1be7.appspot.com',
  messagingSenderId: '1007061601250',
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
  clicked: false,
};
var player2 = {
  name: '',
  turn: false,
  score: 0,
  choice: '',
  diss: '',
  clicked: false,
};

var playerKey = null;

$('#add-player').on('click', function() {
  event.preventDefault();
  initializeUser();
});

// define functions
function toggleComponent(id, show) {
  // toggle between showing a component
  // using jquery to select the component
  // with supplied id and using css to style it
  $(id).css({ visibility: show ? 'visible' : 'hidden' });
}

function toggleGame(show) {
  toggleComponent('#hello', show !== true); // 'hello' is the id of the login component
  toggleComponent('#player1', show === true); // 'player1' is the id of the game component
}

function initializeUser() {
  var name = $('#name-input').val();
  var entry = database.ref().push({
    name: name,
    score: 0,
  });
  playerKey = entry.key;
  toggleGame(true);
  console.log('logged in as: ', name, playerKey);
}

function submitChoice() {
  database.ref(playerKey).update({
    choice: $('input[name="r"]:checked').val(),
  });
}

function initializeComponents() {
  // initialze the default visbility of components on our page
  toggleGame(false);
}

initializeComponents();

function playGame(playerLeft, playerRight) {
  if (playerLeft.choice === 'rock' && playerRight.choice === 'paper') {
    return playerRight;
  } else if (playerLeft.choice === 'paper' && playerRight.choice === 'rock') {
    return playerLeft;
  } else if (playerLeft.choice === 'paper' && playerRight.choice === 'diss') {
    return playerRight;
  } else if (playerLeft.choice === 'diss' && playerRight.choice === 'paper') {
    return playerLeft;
  } else if (playerLeft.choice === 'diss' && playerRight.choice === 'rock') {
    return playerRight;
  } else if (playerLeft.choice === 'rock' && playerRight.choice === 'diss') {
    return playerLeft;
  } else if (playerLeft.choice === playerRight.choice) {
    return {};
  }
}

$('#go').on('click', function() {
  event.preventDefault();
  submitChoice();
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
  var snap = snapshot.val();
  var currentPlayer = snap[playerKey];
  if (playerKey === null || currentPlayer.choice === null) {
    return;
  }

  var playerKeys = Object.keys(snap)
    .filter(function(key) {
      return key !== playerKey;
    })
    .filter(function(key) {
      return snap[key].choice;
    });
  var playersList = playerKeys.map(function(key) {
    return snap[key];
  });

  var opponentIndex = randomIndex(playersList);
  var opponentPlayerKey = playerKeys[opponentIndex];
  var opponent = snap[opponentPlayerKey];
  console.log('n other keys', playerKeys.length);

  console.log('VALUE CHANGE', currentPlayer, opponent);

  if (opponentPlayerKey === null) {
    console.log('opponent player key is nulll');
    return;
  }

  if (opponentPlayerKey === undefined) {
    console.log('opponent player key is underfined');
    return;
  }

  if (opponentPlayerKey !== null || opponentPlayerKey !== undefined) {
    console.log('PLAY GAME', playerKey, opponentPlayerKey);

    console.log('players', currentPlayer, opponent);
    var winner = playGame(currentPlayer, opponent);
    console.log(winner, currentPlayer === winner, opponent === winner);
    if (winner === currentPlayer) {
      console.log('we won', winner);
      currentPlayer.score = currentPlayer.score + 1;
    } else if (winner === opponent) {
      console.log('opponent won', winner);
      opponent.score = opponent.score + 1;
    }
    currentPlayer.choice = null;
    opponent.choice = null;
    database.ref(playerKey).update(currentPlayer);
    database.ref(opponentPlayerKey).update(opponent);
  }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function isViable(player) {
  return player.choice !== null && player.choice !== undefined;
}

function randomIndex(playerList) {
  var viablePlayers = playerList.filter(isViable);
  var randomIndex = getRandomInt(viablePlayers.length - 1);
  console.log(randomIndex, viablePlayers[randomIndex]);
  return randomIndex;

  console.log('something went very wrong');
  return null;
}
