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

// Function to disable the "Add Player" button
function DisableButton() {
  if (NumberOfPlayers >= 6) {
    AddPlayerButton.disabled = true;
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
      startGame();
    }
    else if (event.target.classList.contains('submit-bids')) {
      roundResults();
    }
  });


// ********************************Start Page ********************************************

// Add a player to the state
function addPlayerToState() {
  // Add player to the state on click of "Add Player"
  state.players.push({
    playerNumber: 'Player0' + (state.players.length + 1),
    playerName: PlayerNameInput.value,
    score: 0,
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
function startGame() {
  // Clear the template container
  templateContainer.innerHTML = '';
  // Add bidding template
  const biddingHtmlWithPlayers = biddingTemplate({
    roundNumber: currentRound,
    numberOfTricks: currentRound + 1,
    players: state.players
  });
  templateContainer.innerHTML += biddingHtmlWithPlayers;
}


// ********************************Results Page ********************************************
// Render results
function roundResults() {
  // Clear the template container
  templateContainer.innerHTML = '';
  // Add results template
  const resultsHtml = resultsTemplate({
    roundNumber: currentRound,
    numberOfTricks: currentRound,
    players: state.players
  });
  templateContainer.innerHTML = resultsHtml;
}


// fix round number!