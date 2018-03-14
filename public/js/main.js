const playerController = 'player';
const aiController = 'ai';

const gameChoices = ['rock', 'paper', 'scissor'];

const startingPlayerControllers = [playerController, playerController, aiController];
let game = null;

class Player {
  constructor(controller) {
    this.controller = controller;
    this.id = Player.getNextId();
    this.choice = null;
    this.points = 0;
    this.wins = 0;

    this.createDom();

    console.log('created:', controller, this.id);
  }

  htmlTarget(target) {
    return `${target}${this.id}`;
  }

  createDom() {
    const playerContainer = document.querySelector('#playerContainer');

    this.rootNode = document.createElement('section');
    this.rootNode.id = this.htmlTarget('playerBox');
    this.rootNode.classList.add('player-box');

    const playerHeader = document.createElement('h2');
    playerHeader.id = this.htmlTarget('playerHeader');
    playerHeader.textContent = `${this.controller} : #${this.id}`;
    this.rootNode.appendChild(playerHeader)

    const selectedHeader = document.createElement('h3');
    selectedHeader.id = this.htmlTarget('selectedHeader');
    selectedHeader.textContent = 'Make a selection!'
    this.rootNode.appendChild(selectedHeader);

    const winsHeader = document.createElement('h3');
    winsHeader.id = this.htmlTarget('winsHeader');
    winsHeader.textContent = 'Wins: 0'
    this.rootNode.appendChild(winsHeader);

    const gameForm = document.createElement('form');
    gameForm.id = this.htmlTarget('gameForm');
    gameChoices.forEach((choice) => {
      const button = document.createElement('button');
      button.id = this.htmlTarget(`${choice}Button`);
      button.classList.add('player-button');
      button.textContent = choice;
      button.addEventListener('click', (event) => {
        event.preventDefault();

        if (!this.choice) {
          this.choice = choice;
          this.rootNode.querySelector(this.htmlTarget('#selectedHeader')).textContent = this.choice;
          console.log('choice:', this, choice);
          game.checkForWinner();
        }
        else {
          console.log('cannot make a choice:', this, 'already has made a choice');
        }
      });
      gameForm.appendChild(button);
    });
    this.rootNode.appendChild(gameForm);

    playerContainer.appendChild(this.rootNode);
  }

  fight(otherPlayer) {
    const winMap = {
      'rock': {'rock': 0, 'paper': 0, 'scissor': 1},
      'paper': {'rock': 1, 'paper': 0, 'scissor': 0},
      'scissor': {'rock': 0, 'paper': 1, 'scissor': 0},
    }
    const pointsDelta = winMap[this.choice][otherPlayer.choice];
    this.points += pointsDelta;
    return pointsDelta;
  }

  reset() {
    this.choice = null;
    this.points = 0;
    this.rootNode.querySelector(this.htmlTarget('#selectedHeader')).textContent = 'Make a selection!'
    this.rootNode.querySelector(this.htmlTarget('#winsHeader')).textContent = `Wins: ${this.wins}`;
  }
}
Player.NextId = 0;
Player.getNextId = () => {
  const idToGive = Player.NextId;
  Player.NextId += 1;
  return idToGive;
};

class Game {
  constructor(playerControllers) {
    this.players = [];
    playerControllers.forEach((controller) => {
      this.players.push(new Player(controller));
    });
  }

  checkForWinner() {
    let gameOver = true;
    const playerStillNeeded = [];
    this.players.forEach((player) => {
      if (!player.choice) {
        gameOver = false;
        playerStillNeeded.push(player);
      }
    });
    if (gameOver) {
      // Cause all players to fight one another
      this.players.map((player) => {
        this.players.forEach((otherPlayer) => {
          player.fight(otherPlayer);
        });
      });

      // Check for the winner
      const winners = []
      let winningPoints = 0;
      this.players.forEach((player) => {
        if (player.points >= winningPoints) {
          if (player.points > winningPoints) {
            winners.length = 0;
            winningPoints = player.points;
          }
          winners.push(player);
        }
      });

      // Gives points to winners
      winners.forEach((winner) => {
        winner.wins += 1;
      });

      console.log('winners:', winners);

      this.reset();
    }
    else {
      console.log('game cannot end', playerStillNeeded, 'still have not made their choices');
    }
  }

  addPlayer(controller) {
    this.players.push(new Player(controller));
  } 

  removePlayer(id) {
    let index = null;
    this.players.forEach((player) => {
      if (id == player.id) {
        index = this.players.indexOf(player);
        // player.removeDom();
      }
    });
    if (index != null) {
      this.players.splice(index, 1);
    }
  }

  reset() {
    this.players.forEach((player) => {
      player.reset();
    });
  }
}

const main = () => {
  game = new Game(startingPlayerControllers);
  document.querySelector('#addPlayer').addEventListener('click', (event) => {
    event.preventDefault();
    game.addPlayer(playerController);
  });
  document.querySelector('#addAi').addEventListener('click', (event) => {
    event.preventDefault();
    game.addPlayer(aiController);
  });
}

document.addEventListener('DOMContentLoaded', main)
