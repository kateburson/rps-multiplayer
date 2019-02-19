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
var playerKey = null;

// define functions

// // utility belt
// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// database logic
function initializeUser(name) {
  var userRef = database.ref().push({
    name: name,
    score: 0,
  });

  return userRef.key;
}

function updatePlayers(leftKey, rightKey, winnerKey) {
  database.ref().transaction(function(users) {
    // update winner
    users[leftKey].choice = null;
    users[rightKey].choice = null;

    if (winnerKey) {
      users[winnerKey].score++;
    }

    return users;
  });
}

// the game
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
  } else {
    return {};
  }
}

// functions that control components
function toggleComponent(id, show) {
  // toggle between showing a component
  // using jquery to select the component
  // with supplied id and using css to style it
  $(id).css({ visibility: show ? 'visible' : 'hidden' });
}

function updatePageState(user) {
  // Boolean will be false if playerKey is null or undefined
  toggleComponent('#hello', !Boolean(playerKey)); // hello is the name of the login component
  toggleComponent('#player1', Boolean(playerKey)); // player1 is the name of the game component
  if (!playerKey) {
    console.log('waiting for log in...');
    return; // don't update rest of page if no playerKey
  }

  console.log('attempting to update profile with: ', user);
  console.log($('#profile-name'));
  $('#profile-name').html(user.name);
  $('#profile-score').html(user.score);
  $('#profile-choice').html(user.choice ? user.choice : 'not yet submitted');
  console.log('updated profile with: ', user);
}

function updateGameState(snapshot) {
  // 'hello' is the id of the login component
  // 'player1' is the id of the game component
  // 'profile' is the id of the profile component
  if (playerKey === null) {
    console.log('waiting for log in');
    updatePageState({});
    return;
  }

  var snap = snapshot.val();
  var player = snap[playerKey];
  updatePageState(player);

  if (!player.choice) {
    return;
  }

  var opponentKeyList = Object.keys(snap)
    .filter(function(key) {
      return key !== playerKey;
    })
    .filter(function(key) {
      return Boolean(snap[key].choice);
    });

  var opponentKey = opponentKeyList[0]; // get first queued opponent

  if (opponentKey) {
    console.log('opponent found!', opponentKey);
    var opponent = snap[opponentKey];

    winner = playGame(player, opponent);
    if (winner === player) {
      console.log('player won');
      updatePlayers(playerKey, opponentKey, playerKey);
      // animateOutcome('won!');
      alert('won!');
    } else if (winner === opponent) {
      console.log('opponent won');
      //animateOutcome('lost!');
      alert('lost!');
      // dont report victory if loser
      // updatePlayers(playerKey, opponentKey, opponentKey);
    } else {
      console.log('tie');
      updatePlayers(playerKey, opponentKey, null);
      //animateOutcome('tie!');
      alert('tie!');
    }
  } else {
    console.log('no opponent found!');
  }

  //   updateComponents(snap[playerKey]);
}

function animateOutcome(outcome, color = 'black') {
  // short dumb animation...because i need something for myself...
  $('#profile-choice').html(outcome);
  $('#profile-choice').css({ color });
  toggleComponent('go', false);
  setTimeout(function() {
    $('#profile-choice').html('not yet submitted');
    $('#profile-choice').css({ color: 'black' });
    toggleComponent('go', true);
  }, 3000);
}

function login() {
  var name = $('#name-input').val();
  if (name === '') {
    console.log('empty user name...not going to log you in...');
    return;
  }

  console.log('attempting to login');
  var key = initializeUser(name);
  playerKey = key;
  console.log('logged in as: ', name, key);
  console.log('attaching update callback');
  database.ref().on('value', updateGameState);
}

function submitChoice() {
  database.ref(playerKey).update({
    choice: $('input[name="r"]:checked').val(),
  });
}

// attach callbacks
$('#add-player').on('click', function() {
  event.preventDefault();
  login();
});

$('#go').on('click', function() {
  event.preventDefault();
  submitChoice();
});

// runtime
updatePageState({});
