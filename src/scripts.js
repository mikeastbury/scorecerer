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

// Render the "tricks" template
const resultsTemplateSource = document.getElementById('roundResults').innerHTML;
const resultsTemplate = Handlebars.compile(resultsTemplateSource);

// Render the "scoreboard" template
const scoreBoardTemplateSource = document.getElementById('scoreBoard').innerHTML;
const scoreBoardTemplate = Handlebars.compile(scoreBoardTemplateSource);


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
      biddingPage();
    }
    else if (event.target.classList.contains('scoreboard')) {
      addTricksToState();
      console.log('Tricks added to state:', state.players);
      scoreBoard();
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
      tricksWon: 0,
      roundScore: 0,
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
    state.players[index].bidHistory[state.round - 1].tricksWon = trickValue;
  });
}

// Render results
function roundResults() {
  const lastRound = isLastRound();
  console.log("is it the last round?", lastRound);
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

function bidHistory(player) {
  // Render bid history
  const bidHistory = player.bidHistory;
  bidHistory.forEach((bid) => {
    return bid;
  });
  // console.log('bid history:', bidHistory)
}

function calculateScore() {
  const players = state.players;

  players.forEach((player) => {
    let currentScore = 0;

    player.bidHistory.forEach((round) => {
      if (round.bid === round.tricksWon) {
        // Score 20 points + 10 points per trick taken
        const scoreForRound = 20 + 10 * round.tricksWon;
        currentScore += scoreForRound;
        round.roundScore = scoreForRound;
      } else {
        //Lose 10 points for each over or under trick
        const difference = Math.abs(round.bid - round.tricksWon);
        const scoreForRound = -10 * difference;
        currentScore += scoreForRound;
        round.roundScore = scoreForRound;
      }
      //Math is hard!
    });
    player.currentScore = currentScore;
  });
}

function pushScoreToState() {
  // Calculate score for each player, run after tricks / before scoreboard template loads
  const players = state.players;
 players.forEach((player) => {
   bidHistory(player);
    calculateScore();
 });
}



// ********************************ScoreBoard Page ********************************************

function scoreBoard() {
  pushScoreToState();
  templateContainer.innerHTML = '';
  templateContainer.innerHTML = scoreBoardTemplate({  players: state.players, currentScore: state.players.currentScore, roundNumber: state.round });  
}



// ********************************End Page ********************************************

// figure out flow between rounds, scoreboard, and end page