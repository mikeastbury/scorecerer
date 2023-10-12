let state = {
    players: [],
    round: 0,
}

//App variables
let NumberOfPlayers = state.players.length;
const currentRound = state.round;
const templateSource = document.getElementById('start').innerHTML;
const template = Handlebars.compile(templateSource);
const templateContainer = document.getElementById('template-container');

//Template variables
const AddPlayerButton = document.querySelector('.add-player');
const PlayerNameInput = document.querySelector('.player-name');
const resetButton = document.querySelector('.reset');

// How many rounds are we playing? Cards divided by number of players.
function howManyRounds() {
    return 60 / state.players.length;
}

// Form reset
function reset() {
  state.players = [];
  NumberOfPlayers = 0;
  AddPlayerButton.disabled = false;
  templateContainer.innerHTML = '';
}

// ********************************Event listeners ***************************************
  // Reset button
  templateContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-player')) {
      AddPlayerToState();
    }
    else if (event.target.classList.contains('reset')) {
      reset();
    }
    else if (event.target.classList.contains('start-game')) {
      // Append the "buttons" template to the template container
      templateContainer.innerHTML = biddingHtml;
    }
  });


// ********************************Start Page ********************************************

// Add a player to the state - one big function, must refactor
function AddPlayerToState() {
  state.players.push({
    playerNumber: 'Player0' + (state.players.length + 1),
    playerName: PlayerNameInput.value,
    score: 0,
  });
  // Increase player count
  NumberOfPlayers++;
  // Reset the input value
  PlayerNameInput.value = 'Name';
  // Disable the button if there are 6 players
  if (NumberOfPlayers === 6) {
    AddPlayerButton.disabled = true;
  }

  // Calculate number of rounds
  const numberOfRounds = howManyRounds();
  
  // Render current player list
  const playerHtml = template({ players: state.players, numberOfRounds: numberOfRounds });
  templateContainer.innerHTML = playerHtml;

  // Render the "buttons" template
  const buttonsTemplateSource = document.getElementById('buttons').innerHTML;
  const buttonsTemplate = Handlebars.compile(buttonsTemplateSource);
  const buttonsHtml = buttonsTemplate();

  // Append the "buttons" template to the template container
  templateContainer.innerHTML += buttonsHtml;
}

// Add a player button
  AddPlayerButton.addEventListener('click', () => {
  AddPlayerToState();
    
  
  

  
});


// ********************************Bid Page ********************************************

const biddingTemplateSource = document.getElementById('bidding').innerHTML;
const biddingTemplate = Handlebars.compile(biddingTemplateSource);
const biddingHtml = biddingTemplate();



// ********************************Results Page ********************************************