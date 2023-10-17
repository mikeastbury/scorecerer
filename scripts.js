let state = {
    players: [],
    round: 0,
}

//State variables
let NumberOfPlayers = state.players.length;
let currentRound = state.round;

// Handlebars templates: start, buttons, bidding, results
// Render the "start" template
const templateSource = document.getElementById('start').innerHTML;
const template = Handlebars.compile(templateSource);
const templateContainer = document.getElementById('template-container');

// Render the "start" template on load
const playerHtml = template({ players: state.players, numberOfRounds: howManyRounds() });
templateContainer.innerHTML = playerHtml;

// Render the "buttons" template
const buttonsTemplateSource = document.getElementById('buttons').innerHTML;
const buttonsTemplate = Handlebars.compile(buttonsTemplateSource);
const buttonsHtml = buttonsTemplate();

// Render the "bidding" template
const biddingTemplateSource = document.getElementById('bidding').innerHTML;
const biddingTemplate = Handlebars.compile(biddingTemplateSource);
const biddingHtml = biddingTemplate();

// Render the "results" template
const resultsTemplateSource = document.getElementById('roundResults').innerHTML;
const resultsTemplate = Handlebars.compile(resultsTemplateSource);


//DOM elements
const AddPlayerButton = document.querySelector('.add-player');
const PlayerNameInput = document.querySelector('.player-name');
const resetButton = document.querySelector('.reset');

//*****************************FUNctions*********************************************** */

// How many rounds are we playing? Cards divided by number of players.
function howManyRounds() {
    return 60 / state.players.length;
}

// Form reset
function reset() {
  state.players = [];
  NumberOfPlayers = 0;
  AddPlayerButton.disabled = false;
  templateContainer.innerHTML = playerHtml;
}

// Function to disable the "Add Player" button *** gotta fix this
function DisableButton() {
  if (NumberOfPlayers >= 6) {
    AddPlayerButton.disabled = true;
  }
}

// Function to check if its the last round
function isLastRound() {
  if (state.round === howManyRounds()) {
    return true;
  }
  else {
    return false;
  }
}

// ********************************Event listeners ***************************************
  templateContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-player')) {
      addPlayerToState();
    }
    else if (event.target.classList.contains('reset')) {
      reset();
    }
    else if (event.target.classList.contains('start-game')) {
      biddingPage();
    }
    else if (event.target.classList.contains('submit-bids')) {
      addBidsToState();
      console.log('Bids added to state:', state.players);
      roundResults();
    }
    else if (event.target.classList.contains('next-round')) {
      addTricksToState();
      console.log('Tricks added to state:', state.players);
      biddingPage();
    }
    else if (event.target.classList.contains('score-board')) {
      console.log("score board click");
    }
  });


// ********************************Start Page ********************************************

// Add a player to the state
function addPlayerToState() {
  // Add player to the state on click of "Add Player"
  state.players.push({
    playerNumber: 'Player0' + (state.players.length + 1),
    playerName: PlayerNameInput.value,
    currentBid: 0,
    totalScore: 0,
    bidHistory: [],
  });
  // Increase player count
  NumberOfPlayers++;
  // Reset the input value
  PlayerNameInput.placeholder = 'Name';
  // Calculate number of rounds
  const numberOfRounds = howManyRounds();
  // Render current player list
  const playerHtml = template({ players: state.players, numberOfRounds: numberOfRounds });
  templateContainer.innerHTML = playerHtml;
  // Append the "buttons" template to the template container
  templateContainer.innerHTML += buttonsHtml;
}

// ********************************Bidding Page ********************************************
// Start game and render bidding
function biddingPage() {
  // Clear the template container
  templateContainer.innerHTML = '';
  // Increase round count
  state.round++;
  let currentRound = state.round;
  // Add bidding template
  const biddingHtmlWithPlayers = biddingTemplate({
    roundNumber: currentRound,
    numberOfTricks: currentRound,
    players: state.players
  });
  templateContainer.innerHTML += biddingHtmlWithPlayers;
}

function addBidsToState() {
  const playerBidInputs = document.querySelectorAll('.player-bid');
  // Iterate through each player and update their bid based on input value
  playerBidInputs.forEach((input, index) => {
    const bidValue = parseInt(input.value);
    const bidObject = {
      round: state.round,
      bid: bidValue,
    };
    state.players[index].currentBid = bidValue;
    state.players[index].bidHistory.push(bidObject);
  });
}



// ********************************Results Page ********************************************
// add tricks to state
function addTricksToState() {
  const playerTrickInputs = document.querySelectorAll('.player-tricks');
  // Iterate through each player and update their bid based on input value
  playerTrickInputs.forEach((input, index) => {
    const trickValue = parseInt(input.value);
    state.players[index].tricksTaken = trickValue;
  });
}

// Render results
function roundResults() {
  const lastRound = isLastRound();
  console.log(lastRound);
  let currentRound = state.round;
  // Clear the template container
  templateContainer.innerHTML = '';
  // Add results template
  const resultsHtml = resultsTemplate({
    roundNumber: currentRound,
    numberOfTricks: currentRound,
    players: state.players
  });
  templateContainer.innerHTML = resultsHtml;
  addTricksToState();
}


function calculateScore() {
  // Calculate score for each player
  state.players.forEach((player, index) => {
    const bid = player.currentBid;
    const tricks = player.tricksTaken;
    const score = Math.abs(bid - tricks) * 10;
    console.log(state.players[index].totalScore += score);
  });
}

// ********************************ScoreBoard Page ********************************************

// function scoreBoard() {
  
// }



// ********************************End Page ********************************************

// figure out flow between rounds, scoreboard, and end page